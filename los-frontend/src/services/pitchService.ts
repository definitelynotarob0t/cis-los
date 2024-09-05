import axios from 'axios'
import { Pitch, Content } from '../types'
import { apiBaseUrl } from '../constants'

const pitchUrl = `${apiBaseUrl}/pitches`

let token: string | null = null;

const setToken = (newToken: string) => {
  token = `Bearer ${newToken}`;
};

const getPitch = async (id: number) => {
  const config = {
    headers: { Authorization: token }
  };
  const response = await axios.get(`${pitchUrl}/${id}`, config);
  return response.data;
};


// const getAll = async (): Promise<Pitch[]> => {
//   const response = await fetch(pitchUrl);
//   if (!response.ok) {
//     throw new Error('Network response was not ok');
//   }
//   return response.json();
// };


const createNew = async (content: Content) => {
  const config = {
    headers: { Authorization: token }
  };
    const response = await axios.post(pitchUrl, content, config)
    return response.data
}


const updatePitch = async (pitch: Pitch) => {
  const config = {
    headers: { Authorization: token }
  };
  const updatedPitch = {pitch}
  const response = await axios.put(`${pitchUrl}/${pitch.id}`, updatedPitch, config)
  return response.data
}


const deletePitch = async (pitchToDelete: Pitch) => {
  const config = {
    headers: { Authorization: token }
  };
  const response = await axios.delete(`${pitchUrl}/${pitchToDelete.id}`, config)
  return response.data
}

export default { setToken, getPitch, createNew, updatePitch, deletePitch }