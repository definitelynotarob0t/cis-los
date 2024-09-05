import axios from 'axios'
import { Pitch } from '../types';
import { apiBaseUrl } from '../constants'

const userUrl = `${apiBaseUrl}/users`

let token: string | null = null;


// Add pitchId to user upon user saving pitch
const updateUser = async (pitch: Pitch) => {
    const config = {
        headers: { Authorization: token }
      };

    const response = await axios.put(`${userUrl}/${pitch.userId}/pitch`, { pitchId: pitch.id }, config);
    return response.data;
}


export default { updateUser }