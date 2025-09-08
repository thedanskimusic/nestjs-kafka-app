// src/services/api.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

class ApiService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 5000,
  });

  // Generator control methods
  async startGenerator(intervalMs: number = 5000) {
    try {
      const response = await this.api.post('/generator/start', { intervalMs });
      return response.data;
    } catch (error) {
      console.error('Failed to start generator:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to start generator');
    }
  }

  async pauseGenerator() {
    try {
      const response = await this.api.put('/generator/pause');
      return response.data;
    } catch (error) {
      console.error('Failed to pause generator:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to pause generator');
    }
  }

  async resumeGenerator() {
    try {
      const response = await this.api.put('/generator/resume');
      return response.data;
    } catch (error) {
      console.error('Failed to resume generator:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to resume generator');
    }
  }

  async stopGenerator() {
    try {
      const response = await this.api.put('/generator/stop');
      return response.data;
    } catch (error) {
      console.error('Failed to stop generator:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to stop generator');
    }
  }

  async updateInterval(intervalMs: number) {
    try {
      const response = await this.api.put('/generator/interval', { intervalMs });
      return response.data;
    } catch (error) {
      console.error('Failed to update interval:', error);
      throw error;
    }
  }

  async getGeneratorState() {
    try {
      const response = await this.api.get('/generator/state');
      return response.data;
    } catch (error) {
      console.error('Failed to get generator state:', error);
      throw error;
    }
  }

  async sendTestMessage(message: string, topic: string = 'my-topic') {
    try {
      const response = await this.api.post('/send-kafka-message', { message, topic });
      return response.data;
    } catch (error) {
      console.error('Failed to send test message:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
