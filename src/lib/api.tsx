import axios from 'axios';

const api = axios.create({
    baseURL:"https://taskts.vercel.app",
    withCredentials: true 
});

export default api;
