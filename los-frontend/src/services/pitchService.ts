import axios from 'axios'
import { Pitch } from '../types'
import { apiBaseUrl } from '../constants'
import tokenService from './tokenService'

const pitchUrl = `${apiBaseUrl}/pitches`

const token = tokenService.getToken();

const getPitches = async () => {

  const config = {
    headers: { Authorization: token }
  };
  const response = await axios.get(pitchUrl, config);
  return response.data;
}


const getUserPitches = async (userId: number) => {
  try {
    const allPitches = await getPitches();
    // Filter pitches by userId
    return allPitches.filter((pitch: Pitch) => pitch.userId === userId);
  } catch (error) {
    console.error('Failed to fetch user programs:', error);
  }
};


const getPitch = async (id: number) => {
  const config = {
    headers: { Authorization: token }
  };
  const response = await axios.get(`${pitchUrl}/${id}`, config);
  return response.data;
};


const updatePitch = async (pitch: Pitch) => {
  const config = {
    headers: { Authorization: token }
  };
  const response = await axios.put(`${pitchUrl}/${pitch.id}`, pitch, config)
  return response.data
}


export default { getPitches, getUserPitches, getPitch, updatePitch }