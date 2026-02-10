import { useState } from 'react';
import api from '../services/api';
import type { SheetData, QualityReport, AnalyzeResponse } from '../types/data';

export function useFetchSheet() {
  const [data, setData] = useState<SheetData | null>(null);
  const [quality, setQuality] = useState<QualityReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSheet = async (url: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post<AnalyzeResponse>('/sheets/analyze', { url });
      setData(response.data.data);
      setQuality(response.data.quality);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load sheet';
      setError(errorMessage);
      setData(null);
      setQuality(null);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setQuality(null);
    setError(null);
  };

  return {
    data,
    quality,
    loading,
    error,
    fetchSheet,
    reset,
  };
}
