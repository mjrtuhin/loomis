import { db } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';

export interface Dashboard {
  id: string;
  userId: string;
  googleSheetUrl: string;
  refreshInterval: number;
  layout: {
    charts: Array<{
      id: string;
      type: string;
      chartType: string;
      position: { x: number; y: number; w: number; h: number };
      chartConfig?: any;
    }>;
    textBlocks: Array<{
      id: string;
      type: string;
      content: string;
      position: { x: number; y: number; w: number; h: number };
    }>;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

function sanitizeForFirestore(obj: any): any {
  if (obj === null || obj === undefined) {
    return null;
  }
  
  if (typeof obj === 'function') {
    return null;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeForFirestore(item)).filter(item => item !== null);
  }
  
  if (typeof obj === 'object') {
    const sanitized: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = sanitizeForFirestore(obj[key]);
        if (value !== null) {
          sanitized[key] = value;
        }
      }
    }
    return sanitized;
  }
  
  return obj;
}

export const dashboardService = {
  async create(userId: string, googleSheetUrl: string, items: any[], refreshInterval: number = 60) {
    const dashboardId = `dashboard_${Date.now()}`;
    const dashboardRef = doc(db, 'dashboards', dashboardId);
    
    const charts = items.filter(i => i.type === 'chart').map(i => ({
      id: i.id,
      type: i.type,
      chartType: i.chartType || 'bar',
      position: i.position,
      chartConfig: sanitizeForFirestore(i.chartConfig || null)
    }));

    const textBlocks = items.filter(i => i.type === 'text').map(i => ({
      id: i.id,
      type: i.type,
      content: i.content || '',
      position: i.position
    }));

    const dashboard = {
      userId,
      googleSheetUrl,
      refreshInterval,
      layout: {
        charts,
        textBlocks
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(dashboardRef, dashboard);
    return dashboardId;
  },

  async update(dashboardId: string, items: any[], refreshInterval?: number) {
    const dashboardRef = doc(db, 'dashboards', dashboardId);
    
    const charts = items.filter(i => i.type === 'chart').map(i => ({
      id: i.id,
      type: i.type,
      chartType: i.chartType || 'bar',
      position: i.position,
      chartConfig: sanitizeForFirestore(i.chartConfig || null)
    }));

    const textBlocks = items.filter(i => i.type === 'text').map(i => ({
      id: i.id,
      type: i.type,
      content: i.content || '',
      position: i.position
    }));

    const updates: any = {
      layout: {
        charts,
        textBlocks
      },
      updatedAt: serverTimestamp()
    };

    if (refreshInterval !== undefined) {
      updates.refreshInterval = refreshInterval;
    }

    await updateDoc(dashboardRef, updates);
  },

  async getById(dashboardId: string): Promise<Dashboard | null> {
    const dashboardRef = doc(db, 'dashboards', dashboardId);
    const snapshot = await getDoc(dashboardRef);
    
    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data()
    } as Dashboard;
  },

  async getUserDashboards(userId: string): Promise<Dashboard[]> {
    const q = query(
      collection(db, 'dashboards'),
      where('userId', '==', userId)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Dashboard[];
  },

  async delete(dashboardId: string) {
    const dashboardRef = doc(db, 'dashboards', dashboardId);
    await deleteDoc(dashboardRef);
  }
};
