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

export default { createUser, forgotPassword, resetPassword };
