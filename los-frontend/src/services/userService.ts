import axios from 'axios'
import { apiBaseUrl } from '../constants'

const userUrl = `${apiBaseUrl}/users`


// Update user's password


// Create user upon sign-in form submission
const createUser = async ( credentials: {email: string, password: string, name: string }) => {
  const response = await axios.post(userUrl, credentials)
  return response.data
}


export default { createUser }