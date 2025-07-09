import axios from "axios";

export const axiosi = axios.create({
  baseURL: 'http://localhost:3001/', 
  withCredentials: true,// Adjust the base URL as needed
  headers: {
    "Content-Type": "application/json",
  },
},
);