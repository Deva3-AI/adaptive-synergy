
export interface Brand {
  id: number;
  name: string;
  logo?: string;
  description?: string;
  website?: string;
  industry?: string;
  client_id: number;
  created_at?: string;
}

export interface ClientPreferences {
  id: number;
  client_id: number;
  preferred_contact_method?: string;
  communication_frequency?: string;
  design_preferences: {
    colors: string[];
    style: string;
    fonts: string[];
  };
  industry_specific_requirements: {
    [key: string]: any;
  };
  dos: string[];
  donts: string[];
  created_at: string;
  updated_at: string;
}

export interface Client {
  client_id: number;
  client_name: string;
  description?: string;
  contact_info?: string;
  created_at: string;
  brands?: Brand[];
  preferences?: ClientPreferences;
}

export interface ClientTask {
  task_id: number;
  title: string;
  description?: string;
  status: string;
  due_date?: string;
  assigned_to?: number;
  assignee_name?: string;
  client_id: number;
  brand_id?: number;
  brand_name?: string;
  created_at: string;
  progress?: number;
}
