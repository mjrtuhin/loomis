import api from './api';
import { ChartTypeInfo, EChartsOption, ChartType } from '../types';

export const chartApi = {
  // Get all available chart types
  getChartTypes: async (): Promise<ChartTypeInfo[]> => {
    const response = await api.get('/charts/types');
    return response.data.charts;
  },

  // Generate chart configuration
  generateChart: async (
    type: ChartType,
    title: string,
    data: { xData: string[]; yData: number[] },
    options?: { colorScheme?: string; showLegend?: boolean }
  ): Promise<EChartsOption> => {
    const response = await api.post('/charts/generate', {
      type,
      title,
      data,
      options: options || { colorScheme: 'default', showLegend: true },
    });
    return response.data.chartConfig;
  },
};
