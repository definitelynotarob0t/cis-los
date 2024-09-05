import axios from 'axios';
import { apiBaseUrl } from '../constants';

const loginUrl = `${apiBaseUrl}/login`;

let token: string | null = null;

const setToken = (newToken: string | null) => {
  token = newToken ? `Bearer ${newToken}` : null;
}

const login = async (credentials: { email: string, password: string }) => {
  const response = await axios.post(loginUrl, credentials);
  return response.data;
};

const logout = () => {
  token = null;
  sessionStorage.removeItem('loggedUser');
};

export default { login, setToken, logout };
