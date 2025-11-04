import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/chat';

export const getMessages = (user1, user2) => {
  return axios.get(`${BASE_URL}/messages/${user1}/${user2}`);
};

export const sendMessage = (message) => {
  return axios.post(`${BASE_URL}/send`, message);
};

export const getUserConversations = (username) => {
  return axios.get(`${BASE_URL}/conversations/${username}`);
};

export const getBroadcastMessages = () => {
  return axios.get(`${BASE_URL}/broadcast`);
};

export const sendBroadcastMessage = (message) => {
  return axios.post(`${BASE_URL}/broadcast`, message);
};

export const getActiveUsers = () => {
  return axios.get(`${BASE_URL}/active-users`);
};