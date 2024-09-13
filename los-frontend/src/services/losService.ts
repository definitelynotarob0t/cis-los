import axios from 'axios'
import { Los } from '../types'
import { apiBaseUrl } from '../constants'

const losUrl = `${apiBaseUrl}/loses`

let token: string | null = null;

const setToken = (newToken: string) => {
  token = `Bearer ${newToken}`;
};


const getLos = async (id: number) => {
  const config = {
    headers: { Authorization: token }
  };
  const response = await axios.get(`${losUrl}/${id}`, config);
  return response.data;
};


const updateLos = async (los: Los) => {
  const config = {
    headers: { Authorization: token }
  };
  const response = await axios.put(`${losUrl}/${los.id}`, los, config)
  return response.data
}

export default { setToken, getLos, updateLos }