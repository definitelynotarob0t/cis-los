import axios from 'axios'
import { apiBaseUrl } from '../constants'

const userUrl = `${apiBaseUrl}/users`


// Create user upon sign-in form submission
const createUser = async ( credentials: {email: string, password: string, name: string }) => {
  const response = await axios.post(userUrl, credentials)
  return response.data
}

// Redirect user to forgot password from
const forgotPassword = async (credentials: { email: string }) => {
    await axios.post(`${userUrl}/forgot-password`, credentials);
};

// Update user's password
const resetPassword = async (data: { token: string | null, email: string | null, newPassword: string }) => {
    await axios.put(`${userUrl}/reset-password`, data);
};


// Check if user with the given email exists
const findUserByEmail = async (email: string | null) => {
  const response = await axios.get(`${userUrl}/email/${email}`);
  return response.data; // This will return the user or null if not found
};

export default { createUser, forgotPassword, resetPassword, findUserByEmail };
 