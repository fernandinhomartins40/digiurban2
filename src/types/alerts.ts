
export interface AlertCategory {
  id: number;
  name: string;
  description?: string;
  color: string;
  icon: string;
  is_active: boolean;
  created_at: string;
}

export interface CitizenAlert {
  id: number;
  title: string;
  message: string;
  alert_type: 'info' | 'warning' | 'urgent' | 'emergency';
  category_id?: number;
  priority: 1 | 2 | 3 | 4; // 1=baixa, 2=média, 3=alta, 4=crítica
  target_type: 'all' | 'department' | 'region' | 'custom';
  target_criteria?: Record<string, string | number | boolean>;
  sender_id: number;
  is_active: boolean;
  schedule_at?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
  category?: AlertCategory;
  sender?: {
    id: number;
    name: string;
    email: string;
  };
  delivery_stats?: AlertDeliveryStats;
}

export interface AlertRecipient {
  id: number;
  alert_id: number;
  user_id: number;
  is_read: boolean;
  read_at?: string;
  created_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface AlertDeliveryStats {
  id: number;
  alert_id: number;
  total_recipients: number;
  delivered_count: number;
  read_count: number;
  click_count: number;
  updated_at: string;
}

export interface CreateAlertRequest {
  title: string;
  message: string;
  alert_type: 'info' | 'warning' | 'urgent' | 'emergency';
  category_id?: number;
  priority: 1 | 2 | 3 | 4;
  target_type: 'all' | 'department' | 'region' | 'custom';
  target_criteria?: Record<string, string | number | boolean>;
  schedule_at?: string;
  expires_at?: string;
}

export interface AlertFilters {
  alert_type?: string;
  category_id?: number;
  priority?: number;
  is_active?: boolean;
  date_from?: string;
  date_to?: string;
  search?: string;
}

export interface AlertState {
  alerts: CitizenAlert[];
  categories: AlertCategory[];
  recipients: AlertRecipient[];
  isLoading: boolean;
  error: string | null;
}
