import axios from 'axios';
import { apiBaseUrl } from '../constants';
import { Program } from '../types';

const programUrl = `${apiBaseUrl}/programs`;

let token: string | null = null;

const setToken = (newToken: string) => {
  token = `Bearer ${newToken}`;
};

const getPrograms = async () => {
  const config = {
    headers: { Authorization: token }
  };

  const response = await axios.get(programUrl, config);
  return response.data;
};

// Function to get programs for a specific user
const getUserPrograms = async (userId: number) => {
  try {
    const allPrograms = await getPrograms();
    // Filter programs by userId
    return allPrograms.filter((program: Program) => program.userId === userId);
  } catch (error) {
    console.error('Failed to fetch user programs:', error);
  }
};


const createProgram = async () => {
  const config = {
    headers: { Authorization: token }
  };
  try {
    const response = await axios.post(programUrl, {}, config);
    return response.data;
  } catch (error) {
    console.error('Error creating program:', error);
    throw error;
  }
};

const deleteProgram = async (id: number) => {
  const config = {
    headers: { Authorization: token }
  };
  try {
    const response = await axios.delete(`${programUrl}/${id}`, config);
    return response.data;
  } catch (error) {
    console.error('Error deleting program:', error);
    throw error;
  }
};


export default { setToken, getPrograms, getUserPrograms, createProgram, deleteProgram };
