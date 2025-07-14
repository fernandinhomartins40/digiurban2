export interface AlertCategory {
  id: number;
  name: string;
  description?: string;
  color: string;
  icon: string;
  is_active: boolean;
  created_at: Date;
}

export interface CitizenAlert {
  id: number;
  title: string;
  message: string;
  alert_type: 'info' | 'warning' | 'urgent' | 'emergency';
  category_id?: number;
  priority: 1 | 2 | 3 | 4; // 1=baixa, 2=média, 3=alta, 4=crítica
  target_type: 'all' | 'department' | 'region' | 'custom';
  target_criteria?: any;
  sender_id: number;
  is_active: boolean;
  schedule_at?: Date;
  expires_at?: Date;
  created_at: Date;
  updated_at: Date;
  category?: {
    name: string;
    color: string;
    icon: string;
  };
  sender?: {
    name: string;
    email: string;
  };
  delivery_stats?: {
    total_recipients: number;
    delivered_count: number;
    read_count: number;
  };
  is_read?: boolean;
  read_at?: Date;
}

export interface CreateAlertRequest {
  title: string;
  message: string;
  alert_type: 'info' | 'warning' | 'urgent' | 'emergency';
  category_id?: number;
  priority: 1 | 2 | 3 | 4;
  target_type: 'all' | 'department' | 'region' | 'custom';
  target_criteria?: any;
  schedule_at?: Date;
  expires_at?: Date;
}

export interface AlertFilters {
  alert_type?: string;
  category_id?: number;
  priority?: number;
  is_active?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface AlertRecipient {
  id: number;
  alert_id: number;
  user_id: number;
  is_read: boolean;
  read_at?: Date;
  created_at: Date;
}

export interface AlertDeliveryStats {
  id: number;
  alert_id: number;
  total_recipients: number;
  delivered_count: number;
  read_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface AlertStatistics {
  total_alerts: number;
  active_alerts: number;
  total_recipients: number;
  total_read: number;
  read_rate: string;
} 