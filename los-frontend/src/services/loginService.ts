import axios from 'axios';
import { apiBaseUrl } from '../constants';
import tokenService from './tokenService';

const loginUrl = `${apiBaseUrl}/login`;

const login = async (credentials: { email: string, password: string }) => {
  const response = await axios.post(loginUrl, credentials);
  return response.data;
};

const logout = () => {
  tokenService.clearToken();
};

export default { login, logout };
