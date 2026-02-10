import { useState } from 'react';
import api from '../services/api';
import { Dashboard, DashboardConfig, SaveDashboardResponse, LoadDashboardResponse } from '../types';

export function useDashboard() {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveDashboard = async (config: DashboardConfig): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post<SaveDashboardResponse>('/dashboard/save', config);
      return response.data.dashboardId;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to save dashboard';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const loadDashboard = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get<LoadDashboardResponse>('/dashboard');
      setDashboard(response.data.dashboard);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load dashboard';
      setError(errorMessage);
      setDashboard(null);
    } finally {
      setLoading(false);
    }
  };

  const updateDashboard = async (id: string, config: DashboardConfig): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await api.put(`/dashboard/${id}`, config);
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update dashboard';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteDashboard = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await api.delete(`/dashboard/${id}`);
      setDashboard(null);
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete dashboard';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    dashboard,
    loading,
    error,
    saveDashboard,
    loadDashboard,
    updateDashboard,
    deleteDashboard,
  };
}
