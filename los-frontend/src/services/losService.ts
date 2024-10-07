import axios from 'axios'
import { Los } from '../types'
import { apiBaseUrl } from '../constants'

const losUrl = `${apiBaseUrl}/loses`

let token: string | null = null;

const setToken = (newToken: string) => {
  token = `Bearer ${newToken}`;
};

const getLoses = async () => {
  const config = {
    headers: { Authorization: token }
  };
  const response = await axios.get(losUrl, config);
  return response.data;
}


const getUserLoses = async (userId: number) => {
  try {
    const allLoses = await getLoses();
    // Filter loses by userId
    return allLoses.filter((los: Los) => los.userId === userId);
  } catch (error) {
    console.error('Failed to fetch user programs:', error);
  }
}

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


const createLos = async (newLos: Omit<Los, 'id'>) => {
  const config = {
    headers: { Authorization: token }
  };
  const response = await axios.post(losUrl, newLos, config)
  return response.data
}

const deleteLos = async (id: number) => {
  const config = {
    headers: { Authorization: token }
  };
  await axios.delete(`${losUrl}/${id}`, config)
}


export default { setToken, getLoses, getUserLoses, getLos, updateLos, createLos, deleteLos }