import api from './api';

export const statsService = {
  getOverview: async (period = 30) => {
    const { data } = await api.get(`/stats/overview?period=${period}`);
    return data;
  },

  getRevenueChart: async (period = 30) => {
    const { data } = await api.get(`/stats/revenue?period=${period}`);
    return data;
  },

  getTopSpaces: async (period = 30) => {
    const { data } = await api.get(`/stats/top-spaces?period=${period}`);
    return data;
  },

  getActivityFeed: async (limit = 20) => {
    const { data } = await api.get(`/stats/activity?limit=${limit}`);
    return data;
  },
};
