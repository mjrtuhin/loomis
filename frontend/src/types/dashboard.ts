export interface ChartItem {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  config: {
    title: string;
    columns: {
      x: string;
      y: string[];
      category?: string | null;
    };
    rowFilter: {
      type: string;
      value?: any;
    };
    style: {
      colorScheme: string;
      showLegend: boolean;
      showTooltip: boolean;
    };
  };
}

export interface TextBlockItem {
  id: string;
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  content: string;
}

export interface DashboardLayout {
  charts: ChartItem[];
  textBlocks: TextBlockItem[];
}

export interface Dashboard {
  id: string;
  userId: string;
  googleSheetUrl: string;
  refreshInterval: number;
  layout: DashboardLayout;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardConfig {
  googleSheetUrl: string;
  refreshInterval: number;
  layout: DashboardLayout;
}

export interface SaveDashboardResponse {
  dashboardId: string;
  message: string;
}

export interface LoadDashboardResponse {
  dashboard: Dashboard;
}
