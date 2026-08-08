import axios from 'axios';
import { SECONDARY_URL, stats } from '../Api/endpoints';



export const getLiveStats = async () => {
    try {
        const response = await axios.get(`${SECONDARY_URL}${stats}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching live stats:', error);
        throw error;
    }
};