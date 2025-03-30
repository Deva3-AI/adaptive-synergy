export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_insights: {
        Row: {
          created_at: string | null
          insight: string | null
          insight_id: number
          task_id: number
        }
        Insert: {
          created_at?: string | null
          insight?: string | null
          insight_id?: number
          task_id: number
        }
        Update: {
          created_at?: string | null
          insight?: string | null
          insight_id?: number
          task_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "ai_insights_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["task_id"]
          },
        ]
      }
      clients: {
        Row: {
          client_id: number
          client_name: string
          contact_info: string | null
          created_at: string | null
          description: string | null
        }
        Insert: {
          client_id?: number
          client_name: string
          contact_info?: string | null
          created_at?: string | null
          description?: string | null
        }
        Update: {
          client_id?: number
          client_name?: string
          contact_info?: string | null
          created_at?: string | null
          description?: string | null
        }
        Relationships: []
      }
      communication_logs: {
        Row: {
          channel: string | null
          client_id: number | null
          created_at: string | null
          log_id: number
          message: string | null
          sender_id: number | null
        }
        Insert: {
          channel?: string | null
          client_id?: number | null
          created_at?: string | null
          log_id?: number
          message?: string | null
          sender_id?: number | null
        }
        Update: {
          channel?: string | null
          client_id?: number | null
          created_at?: string | null
          log_id?: number
          message?: string | null
          sender_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "communication_logs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "communication_logs_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      employee_attendance: {
        Row: {
          attendance_id: number
          login_time: string | null
          logout_time: string | null
          user_id: number
          work_date: string
        }
        Insert: {
          attendance_id?: number
          login_time?: string | null
          logout_time?: string | null
          user_id: number
          work_date: string
        }
        Update: {
          attendance_id?: number
          login_time?: string | null
          logout_time?: string | null
          user_id?: number
          work_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_attendance_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      employee_details: {
        Row: {
          date_of_birth: string | null
          employee_id: string | null
          joining_date: string | null
          user_id: number
        }
        Insert: {
          date_of_birth?: string | null
          employee_id?: string | null
          joining_date?: string | null
          user_id: number
        }
        Update: {
          date_of_birth?: string | null
          employee_id?: string | null
          joining_date?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "employee_details_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      financial_records: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          record_date: string
          record_id: number
          record_type: Database["public"]["Enums"]["financial_record_type"]
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          record_date: string
          record_id?: number
          record_type: Database["public"]["Enums"]["financial_record_type"]
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          record_date?: string
          record_id?: number
          record_type?: Database["public"]["Enums"]["financial_record_type"]
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          client_id: number
          created_at: string | null
          due_date: string | null
          invoice_id: number
          invoice_number: string
          status: Database["public"]["Enums"]["invoice_status"] | null
        }
        Insert: {
          amount: number
          client_id: number
          created_at?: string | null
          due_date?: string | null
          invoice_id?: number
          invoice_number: string
          status?: Database["public"]["Enums"]["invoice_status"] | null
        }
        Update: {
          amount?: number
          client_id?: number
          created_at?: string | null
          due_date?: string | null
          invoice_id?: number
          invoice_number?: string
          status?: Database["public"]["Enums"]["invoice_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["client_id"]
          },
        ]
      }
      roles: {
        Row: {
          role_id: number
          role_name: string
        }
        Insert: {
          role_id?: number
          role_name: string
        }
        Update: {
          role_id?: number
          role_name?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          actual_time: number | null
          assigned_to: number | null
          client_id: number | null
          created_at: string | null
          description: string | null
          end_time: string | null
          estimated_time: number | null
          start_time: string | null
          status: Database["public"]["Enums"]["task_status"] | null
          task_id: number
          title: string
          updated_at: string | null
        }
        Insert: {
          actual_time?: number | null
          assigned_to?: number | null
          client_id?: number | null
          created_at?: string | null
          description?: string | null
          end_time?: string | null
          estimated_time?: number | null
          start_time?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          task_id?: number
          title: string
          updated_at?: string | null
        }
        Update: {
          actual_time?: number | null
          assigned_to?: number | null
          client_id?: number | null
          created_at?: string | null
          description?: string | null
          end_time?: string | null
          estimated_time?: number | null
          start_time?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          task_id?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tasks_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["client_id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          name: string
          password_hash: string
          role_id: number | null
          updated_at: string | null
          user_id: number
        }
        Insert: {
          created_at?: string | null
          email: string
          name: string
          password_hash: string
          role_id?: number | null
          updated_at?: string | null
          user_id?: number
        }
        Update: {
          created_at?: string | null
          email?: string
          name?: string
          password_hash?: string
          role_id?: number | null
          updated_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "users_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["role_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      financial_record_type: "expense" | "income"
      invoice_status: "pending" | "paid" | "overdue"
      task_status: "pending" | "in_progress" | "completed" | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
