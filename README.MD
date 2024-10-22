# Project Planning Web Application

## Overview

This application is designed to ease early-stage project planning, allowing users to structure and clarify project logic in a user-friendly way, aided by intuitive prompts and interactive tools.


## Pages

1. **Elevator Pitch Page**:  
    Provides four prompts that help users craft a clear and concise articulation of their programs' core activities, the challenge being addressed and intended outcomes. As users type, the full pitch paragraph is dynamically previewed in real-time. 

2. **Line-of-Sight Page**:  
   Helps users break down their projects into critical components, including activities, outputs, usages, and outcomes/impacts. Users have the option to drag and drop pre-filled suggestive 'answers' or type their own for each of the component fields. Each project can have many lines-of-sight on the same page.

3. **Home Page**:  
    Allows for the display and management of users' projects. Projects are added or deleted from this page.

## Client Context

This tool was developed for [Consulting & Implementation Services](https://consultingis.com.au/) (CIS), a mid-tier management consulting firm that regularly assists clients with grant applications and other complex project needs. As the sole developer, I worked closely with CIS to ensure the tool met their specific requirements. 

## Why This Tool?

CIS needed a project planning tool that was intuitive, uncluttered and highly customised, addressing gaps they found in pre-existing solutions. Inspired by the University of Technology Sydney’s [toolbox](https://toolbox.socialimpacttoolbox.com/toolbox/api/tools#popup), I built this app to meet CIS's exact needs, featuring user authentication, project data persistence, and the ability to export completed plans to PDF.

## Technologies Used

This project uses a modern and scalable tech stack. **Node.js** powers the backend, while **React** ensures a responsive, dynamic frontend. **PostgreSQL** was selected for reliable data management, and **AWS** (EC2 and RDS) was implemented to provide a secure, cost-efficient hosting solution. **JWTs** are used to safeguard user authentication, session storage is used to persist user authentication. **Nodemailer** and **JWTs** are used for password resetting. **Redux** ensures efficient state management across components.

## Challenges & Learning Experience

Building this project involved navigating technical challenges, which helped me grow as a developer taking on my first commercial project:

1. **Data Hosting Migration and Deployment (AWS)**: I had initially set up the database on Fly.io for development, but due to cost considerations and scalability needs, I migrated it to AWS. Having no prior experience with AWS, the transition presented a steep learning curve, especially in configuring and optimising services like EC2 and RDS, as well as ensuring the security of data. This enhanced my understanding of cloud infrastructure, and I gained valuable experience in setting up secure, scalable, and cost-efficient data hosting solutions.

2. **The Importance of CI/CD for Efficient Post-Production Changes**: One of the biggest lessons I learned during this project was the importance of having CI/CD pipelines in place. Initially, I didn't foresee the need for such processes and ended up having to make changes directly on the remote EC2 instance after the app had gone live. This approach was tedious, time-consuming, and risky because it left room for manual errors and made testing and deploying changes much more difficult than needed. I now realise that implementing a tool like GitHub Actions during the development phase would have made post-deployment changes far easier to manage.  


## Demo

![Watch the demo video](assets/cis-los-demo-ezgif.com-video-to-gif-converter.gif)

[Visit live site](https://app.consultingis.com.au)
