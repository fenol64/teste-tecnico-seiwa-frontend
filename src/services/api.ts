import axios from 'axios';

// Replace with your API URL
// For Android Emulator use 'http://10.0.2.2:8000'
// For iOS Simulator use 'http://localhost:8000'
// For Physical Device use your machine's LAN IP
// const API_URL = process.env.API_URL || 'https://api-seiwa.fenol64.com.br/api/v1'
const API_URL = process.env.API_URL || 'http://localhost:8000/api/v1'

console.log(`API URL: ${API_URL}`);

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};
