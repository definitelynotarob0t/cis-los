import express from 'express';
import cors from 'cors'; 
import { PORT } from './util/config';
import { connectToDatabase } from './util/db';
import { errorHandler, unknownEndpoint } from './util/middleware';
import './types';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

// Import routers
import programRouter from './routes/programs';
import pitchRouter from './routes/pitches';
import userRouter from './routes/users';
import loginRouter from './routes/login';
import logoutRouter from './routes/logout';
import losRouter from './routes/loses';


const app = express();


// Middleware
app.use(cors());
app.use(helmet()); // Automatically sets security headers

// Configure specific security headers
app.use(
  helmet.hsts({
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true, // Opt-in to preload list
  })
);

app.use(
  helmet.frameguard({
    action: 'sameorigin', // Allow iframes on the same origin (the CIS domain)
  })
);

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      frameAncestors: ["'self'", "https://consultingis.com.au"], // Restrict iframes to 'self' and CIS webiste
    },
  })
);


app.use((_req, res, next) => {
  res.setHeader(
    'Permissions-Policy',
    'geolocation=(self), microphone=(), camera=()'  // Lock down these featuers
  );
  next();
});

app.use(express.json());



// Limit requests to the login route to avoid brute force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limit each IP to 15 requests per windowMs
  message: 'Too many login attempts from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const emailCheckLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 80, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});


// Routes
app.use('/api/login', loginLimiter); // Apply the login limiter to the login route
app.use('/api/login', loginRouter);
app.use('/api/users/email', emailCheckLimiter);

app.use('/api/', apiLimiter); // Apply the general limiter to all API routes
app.use('/api/programs', programRouter);
app.use('/api/pitches', pitchRouter);
app.use('/api/users', userRouter);
app.use('/api/logout', logoutRouter);
app.use('/api/loses', losRouter);

// Error handling
app.use(errorHandler)
app.use(unknownEndpoint)


const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}, http://localhost:${PORT}`);
  });
};

start();
