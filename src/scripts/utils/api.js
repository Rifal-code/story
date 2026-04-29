const BASE_URL = 'https://story-api.dicoding.dev/v1';

const API = {
  async register(name, email, password) {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    return response.json();
  },

  async login(email, password) {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  async getStories() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/stories?location=1`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  async addStory(data) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/stories`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: data, // FormData doesn't need Content-Type header manually
    });
    return response.json();
  },

  async getStoryDetail(id) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/stories/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  async subscribeNotification(subscription) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/notifications/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(subscription),
    });
    return response.json();
  },

  async unsubscribeNotification(endpoint) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/notifications/subscribe`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ endpoint }),
    });
    return response.json();
  }
};

export default API;
