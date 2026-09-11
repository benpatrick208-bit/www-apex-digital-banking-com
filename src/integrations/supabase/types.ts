export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          apy: number | null
          available: number
          balance: number
          created_at: string
          credit_limit: number | null
          id: string
          name: string
          number: string
          routing: string
          type: string
          user_id: string
        }
        Insert: {
          apy?: number | null
          available?: number
          balance?: number
          created_at?: string
          credit_limit?: number | null
          id?: string
          name: string
          number: string
          routing?: string
          type: string
          user_id: string
        }
        Update: {
          apy?: number | null
          available?: number
          balance?: number
          created_at?: string
          credit_limit?: number | null
          id?: string
          name?: string
          number?: string
          routing?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      budgets: {
        Row: {
          category: string
          id: string
          limit_amount: number
          user_id: string
        }
        Insert: {
          category: string
          id?: string
          limit_amount?: number
          user_id: string
        }
        Update: {
          category?: string
          id?: string
          limit_amount?: number
          user_id?: string
        }
        Relationships: []
      }
      cards: {
        Row: {
          brand: string
          cvv: string
          expiry: string
          frozen: boolean
          id: string
          number: string
          user_id: string
        }
        Insert: {
          brand?: string
          cvv: string
          expiry: string
          frozen?: boolean
          id?: string
          number: string
          user_id: string
        }
        Update: {
          brand?: string
          cvv?: string
          expiry?: string
          frozen?: boolean
          id?: string
          number?: string
          user_id?: string
        }
        Relationships: []
      }
      goals: {
        Row: {
          created_at: string
          id: string
          name: string
          saved: number
          target: number
          target_date: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          saved?: number
          target: number
          target_date?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          saved?: number
          target?: number
          target_date?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string
          date: string
          id: string
          kind: string
          read: boolean
          title: string
          user_id: string
        }
        Insert: {
          body?: string
          date?: string
          id?: string
          kind?: string
          read?: boolean
          title: string
          user_id: string
        }
        Update: {
          body?: string
          date?: string
          id?: string
          kind?: string
          read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_locked: boolean
          address: string
          created_at: string
          credit_score: number
          dark_mode: boolean
          email: string
          full_name: string
          id: string
          member_since: string
          phone: string
          pin: string
          security_pin: string
          username: string
        }
        Insert: {
          account_locked?: boolean
          address?: string
          created_at?: string
          credit_score?: number
          dark_mode?: boolean
          email?: string
          full_name?: string
          id: string
          member_since?: string
          phone?: string
          pin?: string
          security_pin?: string
          username?: string
        }
        Update: {
          account_locked?: boolean
          address?: string
          created_at?: string
          credit_score?: number
          dark_mode?: boolean
          email?: string
          full_name?: string
          id?: string
          member_since?: string
          phone?: string
          pin?: string
          security_pin?: string
          username?: string
        }
        Relationships: []
      }
      recipients: {
        Row: {
          account_mask: string
          bank: string
          created_at: string
          favorite: boolean
          id: string
          name: string
          routing: string
          user_id: string
        }
        Insert: {
          account_mask?: string
          bank?: string
          created_at?: string
          favorite?: boolean
          id?: string
          name: string
          routing?: string
          user_id: string
        }
        Update: {
          account_mask?: string
          bank?: string
          created_at?: string
          favorite?: boolean
          id?: string
          name?: string
          routing?: string
          user_id?: string
        }
        Relationships: []
      }
      scheduled_transfers: {
        Row: {
          active: boolean
          amount: number
          frequency: string
          from_account_id: string
          id: string
          next_date: string
          recipient_id: string
          user_id: string
        }
        Insert: {
          active?: boolean
          amount: number
          frequency: string
          from_account_id: string
          id?: string
          next_date: string
          recipient_id: string
          user_id: string
        }
        Update: {
          active?: boolean
          amount?: number
          frequency?: string
          from_account_id?: string
          id?: string
          next_date?: string
          recipient_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_transfers_from_account_id_fkey"
            columns: ["from_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_transfers_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "recipients"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          account_id: string
          amount: number
          category: string
          date: string
          description: string
          id: string
          merchant: string
          method: string
          status: string
          user_id: string
        }
        Insert: {
          account_id: string
          amount: number
          category?: string
          date?: string
          description: string
          id?: string
          merchant?: string
          method?: string
          status?: string
          user_id: string
        }
        Update: {
          account_id?: string
          amount?: number
          category?: string
          date?: string
          description?: string
          id?: string
          merchant?: string
          method?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      provision_customer: {
        Args: {
          _brand?: string
          _full_name?: string
          _phone?: string
          _pin?: string
          _username?: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
