// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
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
    PostgrestVersion: '14.4'
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          accountPotential: string | null
          cadenceStage: string | null
          city: string | null
          companyName: string | null
          contactName: string | null
          createdAt: string | null
          detailedSource: string | null
          email: string | null
          fleetEstimate: number | null
          fleetModel: string | null
          icpFit: string | null
          id: string
          interestLevel: string | null
          lastTouchDate: string | null
          leadSource: string | null
          loja_id: string | null
          lossReason: string | null
          name: string
          nextAction: string | null
          nextActionDate: string | null
          notes: string | null
          phone: string | null
          pipelineStage: string | null
          priority: string
          segment: string | null
          source: string | null
          state: string | null
          status: string
          updatedAt: string | null
          user_id: string | null
          vehicleCount: number | null
          website: string | null
        }
        Insert: {
          accountPotential?: string | null
          cadenceStage?: string | null
          city?: string | null
          companyName?: string | null
          contactName?: string | null
          createdAt?: string | null
          detailedSource?: string | null
          email?: string | null
          fleetEstimate?: number | null
          fleetModel?: string | null
          icpFit?: string | null
          id?: string
          interestLevel?: string | null
          lastTouchDate?: string | null
          leadSource?: string | null
          loja_id?: string | null
          lossReason?: string | null
          name: string
          nextAction?: string | null
          nextActionDate?: string | null
          notes?: string | null
          phone?: string | null
          pipelineStage?: string | null
          priority: string
          segment?: string | null
          source?: string | null
          state?: string | null
          status: string
          updatedAt?: string | null
          user_id?: string | null
          vehicleCount?: number | null
          website?: string | null
        }
        Update: {
          accountPotential?: string | null
          cadenceStage?: string | null
          city?: string | null
          companyName?: string | null
          contactName?: string | null
          createdAt?: string | null
          detailedSource?: string | null
          email?: string | null
          fleetEstimate?: number | null
          fleetModel?: string | null
          icpFit?: string | null
          id?: string
          interestLevel?: string | null
          lastTouchDate?: string | null
          leadSource?: string | null
          loja_id?: string | null
          lossReason?: string | null
          name?: string
          nextAction?: string | null
          nextActionDate?: string | null
          notes?: string | null
          phone?: string | null
          pipelineStage?: string | null
          priority?: string
          segment?: string | null
          source?: string | null
          state?: string | null
          status?: string
          updatedAt?: string | null
          user_id?: string | null
          vehicleCount?: number | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'accounts_loja_id_fkey'
            columns: ['loja_id']
            isOneToOne: false
            referencedRelation: 'lojas'
            referencedColumns: ['id']
          },
        ]
      }
      activities: {
        Row: {
          accountId: string | null
          channel: string | null
          completed: boolean | null
          contactId: string | null
          createdAt: string | null
          custom_type: string | null
          date: string
          description: string | null
          google_event_id: string | null
          id: string
          loja_id: string | null
          meet_link: string | null
          nextAction: string | null
          nextActionDate: string | null
          result: string | null
          status: string | null
          title: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          accountId?: string | null
          channel?: string | null
          completed?: boolean | null
          contactId?: string | null
          createdAt?: string | null
          custom_type?: string | null
          date: string
          description?: string | null
          google_event_id?: string | null
          id?: string
          loja_id?: string | null
          meet_link?: string | null
          nextAction?: string | null
          nextActionDate?: string | null
          result?: string | null
          status?: string | null
          title?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          accountId?: string | null
          channel?: string | null
          completed?: boolean | null
          contactId?: string | null
          createdAt?: string | null
          custom_type?: string | null
          date?: string
          description?: string | null
          google_event_id?: string | null
          id?: string
          loja_id?: string | null
          meet_link?: string | null
          nextAction?: string | null
          nextActionDate?: string | null
          result?: string | null
          status?: string | null
          title?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'activities_accountId_fkey'
            columns: ['accountId']
            isOneToOne: false
            referencedRelation: 'accounts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activities_contactId_fkey'
            columns: ['contactId']
            isOneToOne: false
            referencedRelation: 'contacts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activities_loja_id_fkey'
            columns: ['loja_id']
            isOneToOne: false
            referencedRelation: 'lojas'
            referencedColumns: ['id']
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          changed_by: string | null
          created_at: string
          id: string
          loja_id: string | null
          new_data: Json | null
          old_data: Json | null
          record_id: string
          table_name: string
        }
        Insert: {
          action: string
          changed_by?: string | null
          created_at?: string
          id?: string
          loja_id?: string | null
          new_data?: Json | null
          old_data?: Json | null
          record_id: string
          table_name: string
        }
        Update: {
          action?: string
          changed_by?: string | null
          created_at?: string
          id?: string
          loja_id?: string | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string
          table_name?: string
        }
        Relationships: [
          {
            foreignKeyName: 'audit_logs_loja_id_fkey'
            columns: ['loja_id']
            isOneToOne: false
            referencedRelation: 'lojas'
            referencedColumns: ['id']
          },
        ]
      }
      company_settings: {
        Row: {
          address: string | null
          city: string | null
          cnpj: string | null
          company_name: string | null
          created_at: string | null
          district: string | null
          email: string | null
          fantasy_name: string | null
          id: string
          logo_url: string | null
          loja_id: string | null
          number: string | null
          phone: string | null
          responsible_name: string | null
          responsible_role: string | null
          state: string | null
          state_registration: string | null
          updated_at: string | null
          user_id: string | null
          website: string | null
          whatsapp: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          cnpj?: string | null
          company_name?: string | null
          created_at?: string | null
          district?: string | null
          email?: string | null
          fantasy_name?: string | null
          id?: string
          logo_url?: string | null
          loja_id?: string | null
          number?: string | null
          phone?: string | null
          responsible_name?: string | null
          responsible_role?: string | null
          state?: string | null
          state_registration?: string | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
          whatsapp?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          cnpj?: string | null
          company_name?: string | null
          created_at?: string | null
          district?: string | null
          email?: string | null
          fantasy_name?: string | null
          id?: string
          logo_url?: string | null
          loja_id?: string | null
          number?: string | null
          phone?: string | null
          responsible_name?: string | null
          responsible_role?: string | null
          state?: string | null
          state_registration?: string | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
          whatsapp?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'company_settings_loja_id_fkey'
            columns: ['loja_id']
            isOneToOne: true
            referencedRelation: 'lojas'
            referencedColumns: ['id']
          },
        ]
      }
      contacts: {
        Row: {
          accountId: string | null
          city: string | null
          companyName: string | null
          createdAt: string | null
          email: string | null
          id: string
          isChampion: boolean | null
          isDecisionMaker: boolean | null
          isInfluencer: boolean | null
          linkedin: string | null
          loja_id: string | null
          name: string
          preferredChannel: string | null
          processRole: string | null
          role: string | null
          state: string | null
          updatedAt: string | null
          user_id: string | null
          whatsapp: string | null
        }
        Insert: {
          accountId?: string | null
          city?: string | null
          companyName?: string | null
          createdAt?: string | null
          email?: string | null
          id?: string
          isChampion?: boolean | null
          isDecisionMaker?: boolean | null
          isInfluencer?: boolean | null
          linkedin?: string | null
          loja_id?: string | null
          name: string
          preferredChannel?: string | null
          processRole?: string | null
          role?: string | null
          state?: string | null
          updatedAt?: string | null
          user_id?: string | null
          whatsapp?: string | null
        }
        Update: {
          accountId?: string | null
          city?: string | null
          companyName?: string | null
          createdAt?: string | null
          email?: string | null
          id?: string
          isChampion?: boolean | null
          isDecisionMaker?: boolean | null
          isInfluencer?: boolean | null
          linkedin?: string | null
          loja_id?: string | null
          name?: string
          preferredChannel?: string | null
          processRole?: string | null
          role?: string | null
          state?: string | null
          updatedAt?: string | null
          user_id?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'contacts_accountId_fkey'
            columns: ['accountId']
            isOneToOne: false
            referencedRelation: 'accounts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'contacts_loja_id_fkey'
            columns: ['loja_id']
            isOneToOne: false
            referencedRelation: 'lojas'
            referencedColumns: ['id']
          },
        ]
      }
      lojas: {
        Row: {
          created_at: string | null
          id: string
          nome: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          nome: string
        }
        Update: {
          created_at?: string | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
      monthly_goals: {
        Row: {
          created_at: string
          id: string
          leads_goal: number
          loja_id: string | null
          meetings_goal: number
          month: string
          proposals_goal: number
          sales_goal: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          leads_goal?: number
          loja_id?: string | null
          meetings_goal?: number
          month: string
          proposals_goal?: number
          sales_goal?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          leads_goal?: number
          loja_id?: string | null
          meetings_goal?: number
          month?: string
          proposals_goal?: number
          sales_goal?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'monthly_goals_loja_id_fkey'
            columns: ['loja_id']
            isOneToOne: false
            referencedRelation: 'lojas'
            referencedColumns: ['id']
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          loja_id: string | null
          message: string | null
          read: boolean | null
          related_id: string | null
          related_type: string | null
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          loja_id?: string | null
          message?: string | null
          read?: boolean | null
          related_id?: string | null
          related_type?: string | null
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          loja_id?: string | null
          message?: string | null
          read?: boolean | null
          related_id?: string | null
          related_type?: string | null
          title?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      opportunities: {
        Row: {
          accountId: string | null
          closeDate: string | null
          createdAt: string | null
          id: string
          loja_id: string | null
          lossReason: string | null
          mrr: number | null
          name: string
          nextAction: string | null
          nextActionDate: string | null
          probability: number | null
          setup: number | null
          stage: string
          total: number | null
          user_id: string | null
        }
        Insert: {
          accountId?: string | null
          closeDate?: string | null
          createdAt?: string | null
          id?: string
          loja_id?: string | null
          lossReason?: string | null
          mrr?: number | null
          name: string
          nextAction?: string | null
          nextActionDate?: string | null
          probability?: number | null
          setup?: number | null
          stage: string
          total?: number | null
          user_id?: string | null
        }
        Update: {
          accountId?: string | null
          closeDate?: string | null
          createdAt?: string | null
          id?: string
          loja_id?: string | null
          lossReason?: string | null
          mrr?: number | null
          name?: string
          nextAction?: string | null
          nextActionDate?: string | null
          probability?: number | null
          setup?: number | null
          stage?: string
          total?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'opportunities_accountId_fkey'
            columns: ['accountId']
            isOneToOne: false
            referencedRelation: 'accounts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'opportunities_loja_id_fkey'
            columns: ['loja_id']
            isOneToOne: false
            referencedRelation: 'lojas'
            referencedColumns: ['id']
          },
        ]
      }
      order_form_items: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          notes: string | null
          order_form_id: string
          product_name: string
          quantity: number | null
          total_price: number | null
          unit: string | null
          unit_price: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          notes?: string | null
          order_form_id: string
          product_name: string
          quantity?: number | null
          total_price?: number | null
          unit?: string | null
          unit_price?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          notes?: string | null
          order_form_id?: string
          product_name?: string
          quantity?: number | null
          total_price?: number | null
          unit?: string | null
          unit_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'order_form_items_order_form_id_fkey'
            columns: ['order_form_id']
            isOneToOne: false
            referencedRelation: 'order_forms'
            referencedColumns: ['id']
          },
        ]
      }
      order_forms: {
        Row: {
          account_id: string | null
          address: string | null
          city: string | null
          contact_id: string | null
          contact_name: string | null
          created_at: string | null
          created_by: string | null
          customer_cnpj: string | null
          customer_name: string | null
          discount: number | null
          email: string | null
          id: string
          is_manual_customer: boolean | null
          logo_url: string | null
          loja_id: string | null
          notes: string | null
          order_number: string
          phone: string | null
          responsible: string | null
          save_customer_to_crm: boolean | null
          state: string | null
          status: string | null
          subtotal: number | null
          total_amount: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          account_id?: string | null
          address?: string | null
          city?: string | null
          contact_id?: string | null
          contact_name?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_cnpj?: string | null
          customer_name?: string | null
          discount?: number | null
          email?: string | null
          id?: string
          is_manual_customer?: boolean | null
          logo_url?: string | null
          loja_id?: string | null
          notes?: string | null
          order_number?: string
          phone?: string | null
          responsible?: string | null
          save_customer_to_crm?: boolean | null
          state?: string | null
          status?: string | null
          subtotal?: number | null
          total_amount?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          account_id?: string | null
          address?: string | null
          city?: string | null
          contact_id?: string | null
          contact_name?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_cnpj?: string | null
          customer_name?: string | null
          discount?: number | null
          email?: string | null
          id?: string
          is_manual_customer?: boolean | null
          logo_url?: string | null
          loja_id?: string | null
          notes?: string | null
          order_number?: string
          phone?: string | null
          responsible?: string | null
          save_customer_to_crm?: boolean | null
          state?: string | null
          status?: string | null
          subtotal?: number | null
          total_amount?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'order_forms_account_id_fkey'
            columns: ['account_id']
            isOneToOne: false
            referencedRelation: 'accounts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'order_forms_contact_id_fkey'
            columns: ['contact_id']
            isOneToOne: false
            referencedRelation: 'contacts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'order_forms_loja_id_fkey'
            columns: ['loja_id']
            isOneToOne: false
            referencedRelation: 'lojas'
            referencedColumns: ['id']
          },
        ]
      }
      profiles: {
        Row: {
          ativo: boolean | null
          avatar_url: string | null
          created_at: string | null
          id: string
          loja_id: string | null
          nome: string
          phone: string | null
          role: string | null
        }
        Insert: {
          ativo?: boolean | null
          avatar_url?: string | null
          created_at?: string | null
          id: string
          loja_id?: string | null
          nome: string
          phone?: string | null
          role?: string | null
        }
        Update: {
          ativo?: boolean | null
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          loja_id?: string | null
          nome?: string
          phone?: string | null
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_loja_id_fkey'
            columns: ['loja_id']
            isOneToOne: false
            referencedRelation: 'lojas'
            referencedColumns: ['id']
          },
        ]
      }
      proposals: {
        Row: {
          accountId: string | null
          companyName: string | null
          contactName: string | null
          cover: Json | null
          createdAt: string | null
          id: string
          items: Json | null
          logo_url: string | null
          loja_id: string | null
          notes: string | null
          proposalNumber: string | null
          status: string | null
          terms: Json | null
          totalEquipment: number | null
          totalMonthly: number | null
          totalSetup: number | null
          travelFee: Json | null
          updatedAt: string | null
          user_id: string | null
          value: number | null
          vehicleQuantity: number | null
        }
        Insert: {
          accountId?: string | null
          companyName?: string | null
          contactName?: string | null
          cover?: Json | null
          createdAt?: string | null
          id?: string
          items?: Json | null
          logo_url?: string | null
          loja_id?: string | null
          notes?: string | null
          proposalNumber?: string | null
          status?: string | null
          terms?: Json | null
          totalEquipment?: number | null
          totalMonthly?: number | null
          totalSetup?: number | null
          travelFee?: Json | null
          updatedAt?: string | null
          user_id?: string | null
          value?: number | null
          vehicleQuantity?: number | null
        }
        Update: {
          accountId?: string | null
          companyName?: string | null
          contactName?: string | null
          cover?: Json | null
          createdAt?: string | null
          id?: string
          items?: Json | null
          logo_url?: string | null
          loja_id?: string | null
          notes?: string | null
          proposalNumber?: string | null
          status?: string | null
          terms?: Json | null
          totalEquipment?: number | null
          totalMonthly?: number | null
          totalSetup?: number | null
          travelFee?: Json | null
          updatedAt?: string | null
          user_id?: string | null
          value?: number | null
          vehicleQuantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'proposals_accountId_fkey'
            columns: ['accountId']
            isOneToOne: false
            referencedRelation: 'accounts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'proposals_loja_id_fkey'
            columns: ['loja_id']
            isOneToOne: false
            referencedRelation: 'lojas'
            referencedColumns: ['id']
          },
        ]
      }
      user_integrations: {
        Row: {
          access_token: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          provider: string
          refresh_token: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          provider: string
          refresh_token?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          provider?: string
          refresh_token?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_loja: { Args: never; Returns: string }
      get_user_role: { Args: never; Returns: string }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

// ====== DATABASE EXTENDED CONTEXT (auto-generated) ======
// This section contains actual PostgreSQL column types, constraints, RLS policies,
// functions, triggers, indexes and materialized views not present in the type definitions above.
// IMPORTANT: The TypeScript types above map UUID, TEXT, VARCHAR all to "string".
// Use the COLUMN TYPES section below to know the real PostgreSQL type for each column.
// Always use the correct PostgreSQL type when writing SQL migrations.

// --- COLUMN TYPES (actual PostgreSQL types) ---
// Use this to know the real database type when writing migrations.
// "string" in TypeScript types above may be uuid, text, varchar, timestamptz, etc.
// Table: accounts
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   website: text (nullable)
//   phone: text (nullable)
//   segment: text (nullable)
//   fleetModel: text (nullable)
//   fleetEstimate: integer (nullable)
//   leadSource: text (nullable)
//   detailedSource: text (nullable)
//   status: text (not null)
//   priority: text (not null)
//   icpFit: text (nullable)
//   interestLevel: text (nullable)
//   accountPotential: text (nullable)
//   nextAction: text (nullable)
//   nextActionDate: timestamp with time zone (nullable)
//   lastTouchDate: timestamp with time zone (nullable)
//   cadenceStage: text (nullable)
//   lossReason: text (nullable)
//   loja_id: uuid (nullable)
//   createdAt: timestamp with time zone (nullable, default: now())
//   updatedAt: timestamp with time zone (nullable, default: now())
//   companyName: text (nullable)
//   contactName: text (nullable)
//   email: text (nullable)
//   city: text (nullable)
//   state: text (nullable)
//   pipelineStage: text (nullable, default: 'Prospecção'::text)
//   vehicleCount: integer (nullable, default: 0)
//   source: text (nullable)
//   notes: text (nullable)
//   user_id: uuid (nullable)
// Table: activities
//   id: uuid (not null, default: gen_random_uuid())
//   accountId: uuid (nullable)
//   contactId: uuid (nullable)
//   date: timestamp with time zone (not null)
//   channel: text (nullable)
//   type: text (not null)
//   result: text (nullable)
//   nextAction: text (nullable)
//   nextActionDate: timestamp with time zone (nullable)
//   completed: boolean (nullable, default: false)
//   loja_id: uuid (nullable)
//   createdAt: timestamp with time zone (nullable, default: now())
//   google_event_id: text (nullable)
//   meet_link: text (nullable)
//   title: text (nullable)
//   user_id: uuid (nullable)
//   custom_type: text (nullable)
//   description: text (nullable)
//   status: text (nullable, default: 'Pendente'::text)
// Table: audit_logs
//   id: uuid (not null, default: gen_random_uuid())
//   table_name: text (not null)
//   record_id: uuid (not null)
//   action: text (not null)
//   old_data: jsonb (nullable)
//   new_data: jsonb (nullable)
//   changed_by: uuid (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   loja_id: uuid (nullable)
// Table: company_settings
//   id: uuid (not null, default: gen_random_uuid())
//   loja_id: uuid (nullable)
//   logo_url: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   company_name: text (nullable)
//   fantasy_name: text (nullable)
//   cnpj: text (nullable)
//   state_registration: text (nullable)
//   address: text (nullable)
//   number: text (nullable)
//   district: text (nullable)
//   city: text (nullable)
//   state: text (nullable)
//   zip_code: text (nullable)
//   phone: text (nullable)
//   whatsapp: text (nullable)
//   email: text (nullable)
//   website: text (nullable)
//   responsible_name: text (nullable)
//   responsible_role: text (nullable)
//   user_id: uuid (nullable)
// Table: contacts
//   id: uuid (not null, default: gen_random_uuid())
//   accountId: uuid (nullable)
//   name: text (not null)
//   role: text (nullable)
//   processRole: text (nullable)
//   linkedin: text (nullable)
//   email: text (nullable)
//   whatsapp: text (nullable)
//   preferredChannel: text (nullable)
//   isDecisionMaker: boolean (nullable, default: false)
//   isInfluencer: boolean (nullable, default: false)
//   isChampion: boolean (nullable, default: false)
//   loja_id: uuid (nullable)
//   createdAt: timestamp with time zone (nullable, default: now())
//   updatedAt: timestamp with time zone (nullable, default: now())
//   companyName: text (nullable)
//   city: text (nullable)
//   state: text (nullable)
//   user_id: uuid (nullable)
// Table: lojas
//   id: uuid (not null, default: gen_random_uuid())
//   nome: text (not null)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: monthly_goals
//   id: uuid (not null, default: gen_random_uuid())
//   month: character varying (not null)
//   leads_goal: integer (not null, default: 100)
//   meetings_goal: integer (not null, default: 15)
//   proposals_goal: integer (not null, default: 8)
//   sales_goal: integer (not null, default: 4)
//   loja_id: uuid (nullable)
//   user_id: uuid (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: notifications
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (nullable)
//   title: text (not null)
//   message: text (nullable)
//   type: text (nullable)
//   read: boolean (nullable, default: false)
//   related_id: uuid (nullable)
//   related_type: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   loja_id: uuid (nullable)
// Table: opportunities
//   id: uuid (not null, default: gen_random_uuid())
//   accountId: uuid (nullable)
//   name: text (not null)
//   stage: text (not null)
//   mrr: numeric (nullable, default: 0)
//   setup: numeric (nullable, default: 0)
//   total: numeric (nullable, default: 0)
//   probability: integer (nullable, default: 0)
//   lossReason: text (nullable)
//   closeDate: timestamp with time zone (nullable)
//   nextAction: text (nullable)
//   nextActionDate: timestamp with time zone (nullable)
//   loja_id: uuid (nullable)
//   createdAt: timestamp with time zone (nullable, default: now())
//   user_id: uuid (nullable)
// Table: order_form_items
//   id: uuid (not null, default: gen_random_uuid())
//   order_form_id: uuid (not null)
//   product_name: text (not null)
//   description: text (nullable)
//   quantity: numeric (nullable, default: 1)
//   unit: text (nullable, default: 'Unidade'::text)
//   unit_price: numeric (nullable, default: 0)
//   total_price: numeric (nullable, default: 0)
//   notes: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: order_forms
//   id: uuid (not null, default: gen_random_uuid())
//   order_number: text (not null, default: ('PED-'::text || (nextval('order_number_seq'::regclass))::text))
//   account_id: uuid (nullable)
//   contact_id: uuid (nullable)
//   is_manual_customer: boolean (nullable, default: false)
//   save_customer_to_crm: boolean (nullable, default: false)
//   customer_name: text (nullable)
//   customer_cnpj: text (nullable)
//   contact_name: text (nullable)
//   phone: text (nullable)
//   email: text (nullable)
//   city: text (nullable)
//   state: text (nullable)
//   address: text (nullable)
//   responsible: text (nullable)
//   status: text (nullable, default: 'Rascunho'::text)
//   notes: text (nullable)
//   logo_url: text (nullable)
//   subtotal: numeric (nullable, default: 0)
//   discount: numeric (nullable, default: 0)
//   total_amount: numeric (nullable, default: 0)
//   created_by: uuid (nullable)
//   user_id: uuid (nullable)
//   loja_id: uuid (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
// Table: profiles
//   id: uuid (not null)
//   nome: text (not null)
//   role: text (nullable, default: 'vendedor'::text)
//   loja_id: uuid (nullable)
//   ativo: boolean (nullable, default: true)
//   created_at: timestamp with time zone (nullable, default: now())
//   avatar_url: text (nullable)
//   phone: text (nullable)
// Table: proposals
//   id: uuid (not null, default: gen_random_uuid())
//   accountId: uuid (nullable)
//   proposalNumber: text (nullable)
//   companyName: text (nullable)
//   contactName: text (nullable)
//   vehicleQuantity: integer (nullable)
//   status: text (nullable, default: 'Rascunho'::text)
//   totalSetup: numeric (nullable, default: 0)
//   totalEquipment: numeric (nullable, default: 0)
//   totalMonthly: numeric (nullable, default: 0)
//   value: numeric (nullable, default: 0)
//   travelFee: jsonb (nullable)
//   loja_id: uuid (nullable)
//   createdAt: timestamp with time zone (nullable, default: now())
//   updatedAt: timestamp with time zone (nullable, default: now())
//   user_id: uuid (nullable)
//   items: jsonb (nullable, default: '[]'::jsonb)
//   cover: jsonb (nullable, default: '{}'::jsonb)
//   terms: jsonb (nullable, default: '{}'::jsonb)
//   notes: text (nullable)
//   logo_url: text (nullable)
// Table: user_integrations
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   provider: text (not null)
//   access_token: text (nullable)
//   refresh_token: text (nullable)
//   expires_at: timestamp with time zone (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())

// --- CONSTRAINTS ---
// Table: accounts
//   FOREIGN KEY accounts_loja_id_fkey: FOREIGN KEY (loja_id) REFERENCES lojas(id)
//   PRIMARY KEY accounts_pkey: PRIMARY KEY (id)
//   FOREIGN KEY accounts_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id)
// Table: activities
//   FOREIGN KEY activities_accountId_fkey: FOREIGN KEY ("accountId") REFERENCES accounts(id) ON DELETE CASCADE
//   FOREIGN KEY activities_contactId_fkey: FOREIGN KEY ("contactId") REFERENCES contacts(id) ON DELETE SET NULL
//   FOREIGN KEY activities_loja_id_fkey: FOREIGN KEY (loja_id) REFERENCES lojas(id)
//   PRIMARY KEY activities_pkey: PRIMARY KEY (id)
//   FOREIGN KEY activities_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id)
// Table: audit_logs
//   FOREIGN KEY audit_logs_changed_by_fkey: FOREIGN KEY (changed_by) REFERENCES auth.users(id)
//   FOREIGN KEY audit_logs_loja_id_fkey: FOREIGN KEY (loja_id) REFERENCES lojas(id)
//   PRIMARY KEY audit_logs_pkey: PRIMARY KEY (id)
// Table: company_settings
//   FOREIGN KEY company_settings_loja_id_fkey: FOREIGN KEY (loja_id) REFERENCES lojas(id) ON DELETE CASCADE
//   UNIQUE company_settings_loja_id_key: UNIQUE (loja_id)
//   PRIMARY KEY company_settings_pkey: PRIMARY KEY (id)
//   FOREIGN KEY company_settings_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id)
// Table: contacts
//   FOREIGN KEY contacts_accountId_fkey: FOREIGN KEY ("accountId") REFERENCES accounts(id) ON DELETE CASCADE
//   FOREIGN KEY contacts_loja_id_fkey: FOREIGN KEY (loja_id) REFERENCES lojas(id)
//   PRIMARY KEY contacts_pkey: PRIMARY KEY (id)
//   FOREIGN KEY contacts_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id)
// Table: lojas
//   PRIMARY KEY lojas_pkey: PRIMARY KEY (id)
// Table: monthly_goals
//   FOREIGN KEY monthly_goals_loja_id_fkey: FOREIGN KEY (loja_id) REFERENCES lojas(id) ON DELETE CASCADE
//   PRIMARY KEY monthly_goals_pkey: PRIMARY KEY (id)
//   FOREIGN KEY monthly_goals_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: notifications
//   PRIMARY KEY notifications_pkey: PRIMARY KEY (id)
//   FOREIGN KEY notifications_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: opportunities
//   FOREIGN KEY opportunities_accountId_fkey: FOREIGN KEY ("accountId") REFERENCES accounts(id) ON DELETE CASCADE
//   FOREIGN KEY opportunities_loja_id_fkey: FOREIGN KEY (loja_id) REFERENCES lojas(id)
//   PRIMARY KEY opportunities_pkey: PRIMARY KEY (id)
//   FOREIGN KEY opportunities_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id)
// Table: order_form_items
//   FOREIGN KEY order_form_items_order_form_id_fkey: FOREIGN KEY (order_form_id) REFERENCES order_forms(id) ON DELETE CASCADE
//   PRIMARY KEY order_form_items_pkey: PRIMARY KEY (id)
// Table: order_forms
//   FOREIGN KEY order_forms_account_id_fkey: FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE SET NULL
//   FOREIGN KEY order_forms_contact_id_fkey: FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE SET NULL
//   FOREIGN KEY order_forms_created_by_fkey: FOREIGN KEY (created_by) REFERENCES auth.users(id)
//   FOREIGN KEY order_forms_loja_id_fkey: FOREIGN KEY (loja_id) REFERENCES lojas(id)
//   PRIMARY KEY order_forms_pkey: PRIMARY KEY (id)
//   FOREIGN KEY order_forms_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id)
// Table: profiles
//   FOREIGN KEY profiles_id_fkey: FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
//   FOREIGN KEY profiles_loja_id_fkey: FOREIGN KEY (loja_id) REFERENCES lojas(id)
//   PRIMARY KEY profiles_pkey: PRIMARY KEY (id)
//   CHECK profiles_role_check: CHECK ((role = ANY (ARRAY['admin'::text, 'gerente'::text, 'vendedor'::text])))
// Table: proposals
//   FOREIGN KEY proposals_accountId_fkey: FOREIGN KEY ("accountId") REFERENCES accounts(id) ON DELETE CASCADE
//   FOREIGN KEY proposals_loja_id_fkey: FOREIGN KEY (loja_id) REFERENCES lojas(id)
//   PRIMARY KEY proposals_pkey: PRIMARY KEY (id)
//   FOREIGN KEY proposals_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id)
// Table: user_integrations
//   PRIMARY KEY user_integrations_pkey: PRIMARY KEY (id)
//   FOREIGN KEY user_integrations_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
//   UNIQUE user_integrations_user_id_provider_key: UNIQUE (user_id, provider)

// --- ROW LEVEL SECURITY POLICIES ---
// Table: accounts
//   Policy "accounts_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: ((get_user_role() = ANY (ARRAY['admin'::text, 'gerente'::text, 'gestor'::text])) OR (user_id = auth.uid()) OR (user_id IS NULL))
//   Policy "accounts_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: ((get_user_role() = ANY (ARRAY['admin'::text, 'gerente'::text, 'gestor'::text])) OR (user_id = auth.uid()) OR (user_id IS NULL))
//   Policy "accounts_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "accounts_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: ((get_user_role() = ANY (ARRAY['admin'::text, 'gerente'::text, 'gestor'::text])) OR (user_id = auth.uid()) OR (user_id IS NULL))
//     WITH CHECK: ((get_user_role() = ANY (ARRAY['admin'::text, 'gerente'::text, 'gestor'::text])) OR (user_id = auth.uid()) OR (user_id IS NULL))
// Table: activities
//   Policy "activities_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: ((get_user_role() = ANY (ARRAY['admin'::text, 'gerente'::text, 'gestor'::text])) OR (user_id = auth.uid()) OR (user_id IS NULL))
//   Policy "activities_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: ((get_user_role() = ANY (ARRAY['admin'::text, 'gerente'::text, 'gestor'::text])) OR (user_id = auth.uid()) OR (user_id IS NULL))
//   Policy "activities_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "activities_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: ((get_user_role() = ANY (ARRAY['admin'::text, 'gerente'::text, 'gestor'::text])) OR (user_id = auth.uid()) OR (user_id IS NULL))
//     WITH CHECK: ((get_user_role() = ANY (ARRAY['admin'::text, 'gerente'::text, 'gestor'::text])) OR (user_id = auth.uid()) OR (user_id IS NULL))
// Table: audit_logs
//   Policy "audit_logs_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: ((get_user_role() = ANY (ARRAY['admin'::text, 'gestor'::text])) OR (changed_by = auth.uid()) OR (changed_by IS NULL))
//   Policy "audit_logs_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: ((get_user_role() = ANY (ARRAY['admin'::text, 'gestor'::text])) OR (changed_by = auth.uid()) OR (record_id IN ( SELECT accounts.id    FROM accounts   WHERE (accounts.user_id = auth.uid()))) OR (record_id IN ( SELECT contacts.id    FROM contacts   WHERE (contacts.user_id = auth.uid()))) OR (record_id IN ( SELECT activities.id    FROM activities   WHERE (activities.user_id = auth.uid()))) OR (record_id IN ( SELECT opportunities.id    FROM opportunities   WHERE (opportunities.user_id = auth.uid()))) OR (record_id IN ( SELECT proposals.id    FROM proposals   WHERE (proposals.user_id = auth.uid()))))
// Table: company_settings
//   Policy "company_settings_all" (ALL, PERMISSIVE) roles={public}
//     USING: ((loja_id = get_user_loja()) OR (get_user_role() = 'admin'::text))
// Table: contacts
//   Policy "contacts_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: ((get_user_role() = ANY (ARRAY['admin'::text, 'gerente'::text, 'gestor'::text])) OR (user_id = auth.uid()) OR (user_id IS NULL))
//   Policy "contacts_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: ((get_user_role() = ANY (ARRAY['admin'::text, 'gerente'::text, 'gestor'::text])) OR (user_id = auth.uid()) OR (user_id IS NULL))
//   Policy "contacts_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "contacts_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: ((get_user_role() = ANY (ARRAY['admin'::text, 'gerente'::text, 'gestor'::text])) OR (user_id = auth.uid()) OR (user_id IS NULL))
//     WITH CHECK: ((get_user_role() = ANY (ARRAY['admin'::text, 'gerente'::text, 'gestor'::text])) OR (user_id = auth.uid()) OR (user_id IS NULL))
// Table: lojas
//   Policy "lojas_read" (SELECT, PERMISSIVE) roles={public}
//     USING: true
// Table: monthly_goals
//   Policy "monthly_goals_all" (ALL, PERMISSIVE) roles={public}
//     USING: ((get_user_role() = 'admin'::text) OR (loja_id = get_user_loja()))
// Table: notifications
//   Policy "notifications_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "notifications_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "notifications_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "notifications_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: true
// Table: opportunities
//   Policy "opportunities_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: ((get_user_role() = ANY (ARRAY['admin'::text, 'gerente'::text, 'gestor'::text])) OR (user_id = auth.uid()) OR (user_id IS NULL))
//   Policy "opportunities_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: ((get_user_role() = ANY (ARRAY['admin'::text, 'gerente'::text, 'gestor'::text])) OR (user_id = auth.uid()) OR (user_id IS NULL))
//   Policy "opportunities_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "opportunities_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: ((get_user_role() = ANY (ARRAY['admin'::text, 'gerente'::text, 'gestor'::text])) OR (user_id = auth.uid()) OR (user_id IS NULL))
//     WITH CHECK: ((get_user_role() = ANY (ARRAY['admin'::text, 'gerente'::text, 'gestor'::text])) OR (user_id = auth.uid()) OR (user_id IS NULL))
// Table: order_form_items
//   Policy "order_form_items_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: order_forms
//   Policy "order_forms_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: ((get_user_role() = ANY (ARRAY['admin'::text, 'gerente'::text, 'gestor'::text])) OR (user_id = auth.uid()) OR (user_id IS NULL))
//   Policy "order_forms_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: ((get_user_role() = ANY (ARRAY['admin'::text, 'gerente'::text, 'gestor'::text])) OR (user_id = auth.uid()) OR (user_id IS NULL))
//   Policy "order_forms_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "order_forms_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: ((get_user_role() = ANY (ARRAY['admin'::text, 'gerente'::text, 'gestor'::text])) OR (user_id = auth.uid()) OR (user_id IS NULL))
// Table: profiles
//   Policy "profiles_read" (SELECT, PERMISSIVE) roles={public}
//     USING: ((auth.uid() = id) OR (get_user_role() = 'admin'::text))
//   Policy "profiles_update" (UPDATE, PERMISSIVE) roles={public}
//     USING: ((auth.uid() = id) OR (get_user_role() = 'admin'::text))
// Table: proposals
//   Policy "proposals_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: ((get_user_role() = ANY (ARRAY['admin'::text, 'gerente'::text, 'gestor'::text])) OR (user_id = auth.uid()) OR (user_id IS NULL))
//   Policy "proposals_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "proposals_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "proposals_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: true
// Table: user_integrations
//   Policy "Users can manage their own integrations" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)

// --- DATABASE FUNCTIONS ---
// FUNCTION cascade_account_user_id()
//   CREATE OR REPLACE FUNCTION public.cascade_account_user_id()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     IF OLD.user_id IS DISTINCT FROM NEW.user_id AND NEW.user_id IS NOT NULL THEN
//       UPDATE public.contacts SET user_id = NEW.user_id WHERE "accountId" = NEW.id;
//       UPDATE public.activities SET user_id = NEW.user_id WHERE "accountId" = NEW.id;
//       UPDATE public.opportunities SET user_id = NEW.user_id WHERE "accountId" = NEW.id;
//       UPDATE public.proposals SET user_id = NEW.user_id WHERE "accountId" = NEW.id;
//     END IF;
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION get_user_loja()
//   CREATE OR REPLACE FUNCTION public.get_user_loja()
//    RETURNS uuid
//    LANGUAGE sql
//    SECURITY DEFINER
//   AS $function$
//     SELECT loja_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
//   $function$
//
// FUNCTION get_user_role()
//   CREATE OR REPLACE FUNCTION public.get_user_role()
//    RETURNS text
//    LANGUAGE sql
//    SECURITY DEFINER
//   AS $function$
//     SELECT lower(role) FROM public.profiles WHERE id = auth.uid() LIMIT 1;
//   $function$
//
// FUNCTION handle_new_account_after_insert()
//   CREATE OR REPLACE FUNCTION public.handle_new_account_after_insert()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     -- Etapa inicial: Sempre "Prospecção"
//     INSERT INTO public.opportunities (
//       "accountId", name, stage, "nextAction", "nextActionDate", loja_id, probability
//     ) VALUES (
//       NEW.id,
//       NEW.name,
//       'Prospecção',
//       NEW."nextAction",
//       NEW."nextActionDate",
//       NEW.loja_id,
//       10
//     );
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION handle_new_account_auto_pipeline()
//   CREATE OR REPLACE FUNCTION public.handle_new_account_auto_pipeline()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     -- Regras Automáticas (Obrigatórias)
//     -- Campos auto-preenchidos
//     IF NEW."cadenceStage" IS NULL OR NEW."cadenceStage" = '' THEN NEW."cadenceStage" := '1º Toque'; END IF;
//     IF NEW."interestLevel" IS NULL OR NEW."interestLevel" = '' THEN NEW."interestLevel" := 'Frio'; END IF;
//     IF NEW."accountPotential" IS NULL OR NEW."accountPotential" = '' THEN NEW."accountPotential" := 'Médio'; END IF;
//     IF NEW."detailedSource" IS NULL OR NEW."detailedSource" = '' THEN NEW."detailedSource" := 'Manual'; END IF;
//
//     -- Próxima ação padrão
//     IF NEW."nextAction" IS NULL OR NEW."nextAction" = '' THEN NEW."nextAction" := 'Contato inicial via WhatsApp'; END IF;
//     IF NEW."nextActionDate" IS NULL THEN NEW."nextActionDate" := NOW(); END IF;
//
//     -- Sempre "Prospecção" / "Em prospecção"
//     IF NEW.status IS NULL OR NEW.status = 'Novo' THEN NEW.status := 'Em prospecção'; END IF;
//
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION handle_new_contact_auto_pipeline()
//   CREATE OR REPLACE FUNCTION public.handle_new_contact_auto_pipeline()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//     v_opp_exists BOOLEAN;
//     v_acc_name TEXT;
//   BEGIN
//     -- Evite repetição: Não crie atividades duplicadas
//     SELECT EXISTS(
//       SELECT 1 FROM public.opportunities WHERE "accountId" = NEW."accountId"
//     ) INTO v_opp_exists;
//
//     IF NOT v_opp_exists THEN
//       SELECT name INTO v_acc_name FROM public.accounts WHERE id = NEW."accountId";
//
//       -- Atualiza a conta com os padrões iniciais
//       UPDATE public.accounts SET
//         "nextAction" = COALESCE("nextAction", 'Contato inicial via WhatsApp'),
//         "nextActionDate" = COALESCE("nextActionDate", NOW()),
//         "cadenceStage" = COALESCE("cadenceStage", '1º Toque'),
//         "interestLevel" = COALESCE("interestLevel", 'Frio'),
//         "accountPotential" = COALESCE("accountPotential", 'Médio'),
//         "status" = 'Em prospecção'
//       WHERE id = NEW."accountId";
//
//       -- Cria a Oportunidade na primeira etapa
//       INSERT INTO public.opportunities (
//         "accountId", name, stage, "nextAction", "nextActionDate", loja_id, probability
//       ) VALUES (
//         NEW."accountId",
//         COALESCE(v_acc_name, 'Contato ' || NEW.name),
//         'Prospecção',
//         'Contato inicial via WhatsApp',
//         NOW(),
//         NEW.loja_id,
//         10
//       );
//     END IF;
//
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION handle_new_user()
//   CREATE OR REPLACE FUNCTION public.handle_new_user()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     INSERT INTO public.profiles (id, nome, role, loja_id)
//     VALUES (
//       NEW.id,
//       COALESCE(NEW.raw_user_meta_data->>'nome', split_part(NEW.email, '@', 1)),
//       COALESCE(NEW.raw_user_meta_data->>'role', 'vendedor'),
//       NULLIF(NEW.raw_user_meta_data->>'loja_id', '')::uuid
//     );
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION log_contact_changes()
//   CREATE OR REPLACE FUNCTION public.log_contact_changes()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//     v_user_id UUID;
//     v_loja_id UUID;
//   BEGIN
//     v_user_id := auth.uid();
//
//     IF TG_OP = 'INSERT' THEN
//       v_loja_id := NEW.loja_id;
//       INSERT INTO public.audit_logs (table_name, record_id, action, new_data, changed_by, loja_id)
//       VALUES ('contacts', NEW.id, 'INSERT', row_to_json(NEW)::jsonb, v_user_id, v_loja_id);
//       RETURN NEW;
//     ELSIF TG_OP = 'UPDATE' THEN
//       v_loja_id := NEW.loja_id;
//       INSERT INTO public.audit_logs (table_name, record_id, action, old_data, new_data, changed_by, loja_id)
//       VALUES ('contacts', NEW.id, 'UPDATE', row_to_json(OLD)::jsonb, row_to_json(NEW)::jsonb, v_user_id, v_loja_id);
//       RETURN NEW;
//     ELSIF TG_OP = 'DELETE' THEN
//       v_loja_id := OLD.loja_id;
//       INSERT INTO public.audit_logs (table_name, record_id, action, old_data, changed_by, loja_id)
//       VALUES ('contacts', OLD.id, 'DELETE', row_to_json(OLD)::jsonb, v_user_id, v_loja_id);
//       RETURN OLD;
//     END IF;
//     RETURN NULL;
//   END;
//   $function$
//
// FUNCTION set_account_user_id()
//   CREATE OR REPLACE FUNCTION public.set_account_user_id()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     IF NEW.user_id IS NULL THEN
//       NEW.user_id := auth.uid();
//     END IF;
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION set_current_timestamp_updated_at()
//   CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   BEGIN
//     NEW.updated_at = NOW();
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION set_dependent_user_id()
//   CREATE OR REPLACE FUNCTION public.set_dependent_user_id()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//     v_account_user_id UUID;
//   BEGIN
//     IF NEW."accountId" IS NOT NULL THEN
//       SELECT user_id INTO v_account_user_id FROM public.accounts WHERE id = NEW."accountId";
//       IF v_account_user_id IS NOT NULL THEN
//         NEW.user_id := v_account_user_id;
//       ELSIF NEW.user_id IS NULL THEN
//         NEW.user_id := auth.uid();
//       END IF;
//     ELSIF NEW.user_id IS NULL THEN
//       NEW.user_id := auth.uid();
//     END IF;
//     RETURN NEW;
//   END;
//   $function$
//

// --- TRIGGERS ---
// Table: accounts
//   cascade_user_id_on_account_update: CREATE TRIGGER cascade_user_id_on_account_update AFTER UPDATE OF user_id ON public.accounts FOR EACH ROW EXECUTE FUNCTION cascade_account_user_id()
//   on_account_created_after_insert: CREATE TRIGGER on_account_created_after_insert AFTER INSERT ON public.accounts FOR EACH ROW EXECUTE FUNCTION handle_new_account_after_insert()
//   on_account_created_auto_pipeline: CREATE TRIGGER on_account_created_auto_pipeline BEFORE INSERT ON public.accounts FOR EACH ROW EXECUTE FUNCTION handle_new_account_auto_pipeline()
//   set_accounts_user_id: CREATE TRIGGER set_accounts_user_id BEFORE INSERT ON public.accounts FOR EACH ROW EXECUTE FUNCTION set_account_user_id()
// Table: activities
//   set_activities_user_id: CREATE TRIGGER set_activities_user_id BEFORE INSERT OR UPDATE ON public.activities FOR EACH ROW EXECUTE FUNCTION set_dependent_user_id()
// Table: contacts
//   on_contact_change: CREATE TRIGGER on_contact_change AFTER INSERT OR DELETE OR UPDATE ON public.contacts FOR EACH ROW EXECUTE FUNCTION log_contact_changes()
//   on_contact_created_auto_pipeline: CREATE TRIGGER on_contact_created_auto_pipeline AFTER INSERT ON public.contacts FOR EACH ROW EXECUTE FUNCTION handle_new_contact_auto_pipeline()
//   set_contacts_user_id: CREATE TRIGGER set_contacts_user_id BEFORE INSERT OR UPDATE ON public.contacts FOR EACH ROW EXECUTE FUNCTION set_dependent_user_id()
// Table: opportunities
//   set_opportunities_user_id: CREATE TRIGGER set_opportunities_user_id BEFORE INSERT OR UPDATE ON public.opportunities FOR EACH ROW EXECUTE FUNCTION set_dependent_user_id()
// Table: order_forms
//   set_order_forms_updated_at: CREATE TRIGGER set_order_forms_updated_at BEFORE UPDATE ON public.order_forms FOR EACH ROW EXECUTE FUNCTION set_current_timestamp_updated_at()
//   set_order_forms_user_id: CREATE TRIGGER set_order_forms_user_id BEFORE INSERT ON public.order_forms FOR EACH ROW EXECUTE FUNCTION set_account_user_id()
// Table: proposals
//   set_proposals_user_id: CREATE TRIGGER set_proposals_user_id BEFORE INSERT OR UPDATE ON public.proposals FOR EACH ROW EXECUTE FUNCTION set_dependent_user_id()

// --- INDEXES ---
// Table: company_settings
//   CREATE UNIQUE INDEX company_settings_loja_id_key ON public.company_settings USING btree (loja_id)
// Table: monthly_goals
//   CREATE UNIQUE INDEX monthly_goals_month_loja_user_idx ON public.monthly_goals USING btree (month, COALESCE(loja_id, '00000000-0000-0000-0000-000000000000'::uuid), COALESCE(user_id, '00000000-0000-0000-0000-000000000000'::uuid))
// Table: user_integrations
//   CREATE UNIQUE INDEX user_integrations_user_id_provider_key ON public.user_integrations USING btree (user_id, provider)
