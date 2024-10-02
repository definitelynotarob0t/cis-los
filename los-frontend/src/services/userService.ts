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
const findUserByEmail = async (email: string) => {
  try {
    const response = await axios.get(`${userUrl}/email/${email}`);
    if (response.data && response.data.length > 0) {
      return response.data[0]; // User found
    }
    return null; // No user found
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.status === 404) {
        return null; // No user found, return null
      }
    }
    throw error; // Other errors should be rethrown
  }
};

export default { createUser, forgotPassword, resetPassword, findUserByEmail };
 