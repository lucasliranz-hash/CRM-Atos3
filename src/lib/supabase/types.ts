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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          accountPotential: string | null
          address: string | null
          cadenceStage: string | null
          city: string | null
          clientSince: string | null
          cnpj: string | null
          companyName: string | null
          contactName: string | null
          contactRole: string | null
          createdAt: string | null
          detailedSource: string | null
          district: string | null
          email: string | null
          fleet_notes: string | null
          fleetEstimate: number | null
          fleetModel: string | null
          fleetPotential: string | null
          icpFit: string | null
          id: string
          interestLevel: string | null
          lastTouchDate: string | null
          leadSource: string | null
          leadTemperature: string | null
          loja_id: string | null
          lossDate: string | null
          lossReason: string | null
          mainInterest: string | null
          name: string
          nextAction: string | null
          nextActionDate: string | null
          nextActionNotes: string | null
          nextActionStatus: string | null
          nextActionTime: string | null
          notes: string | null
          number: string | null
          phone: string | null
          pipelineStage: string | null
          priority: string
          segment: string | null
          solutionInterest: string | null
          source: string | null
          state: string | null
          status: string
          updatedAt: string | null
          user_id: string | null
          vehicleCount: number | null
          website: string | null
          whatsapp: string | null
          zip_code: string | null
        }
        Insert: {
          accountPotential?: string | null
          address?: string | null
          cadenceStage?: string | null
          city?: string | null
          clientSince?: string | null
          cnpj?: string | null
          companyName?: string | null
          contactName?: string | null
          contactRole?: string | null
          createdAt?: string | null
          detailedSource?: string | null
          district?: string | null
          email?: string | null
          fleet_notes?: string | null
          fleetEstimate?: number | null
          fleetModel?: string | null
          fleetPotential?: string | null
          icpFit?: string | null
          id?: string
          interestLevel?: string | null
          lastTouchDate?: string | null
          leadSource?: string | null
          leadTemperature?: string | null
          loja_id?: string | null
          lossDate?: string | null
          lossReason?: string | null
          mainInterest?: string | null
          name: string
          nextAction?: string | null
          nextActionDate?: string | null
          nextActionNotes?: string | null
          nextActionStatus?: string | null
          nextActionTime?: string | null
          notes?: string | null
          number?: string | null
          phone?: string | null
          pipelineStage?: string | null
          priority: string
          segment?: string | null
          solutionInterest?: string | null
          source?: string | null
          state?: string | null
          status: string
          updatedAt?: string | null
          user_id?: string | null
          vehicleCount?: number | null
          website?: string | null
          whatsapp?: string | null
          zip_code?: string | null
        }
        Update: {
          accountPotential?: string | null
          address?: string | null
          cadenceStage?: string | null
          city?: string | null
          clientSince?: string | null
          cnpj?: string | null
          companyName?: string | null
          contactName?: string | null
          contactRole?: string | null
          createdAt?: string | null
          detailedSource?: string | null
          district?: string | null
          email?: string | null
          fleet_notes?: string | null
          fleetEstimate?: number | null
          fleetModel?: string | null
          fleetPotential?: string | null
          icpFit?: string | null
          id?: string
          interestLevel?: string | null
          lastTouchDate?: string | null
          leadSource?: string | null
          leadTemperature?: string | null
          loja_id?: string | null
          lossDate?: string | null
          lossReason?: string | null
          mainInterest?: string | null
          name?: string
          nextAction?: string | null
          nextActionDate?: string | null
          nextActionNotes?: string | null
          nextActionStatus?: string | null
          nextActionTime?: string | null
          notes?: string | null
          number?: string | null
          phone?: string | null
          pipelineStage?: string | null
          priority?: string
          segment?: string | null
          solutionInterest?: string | null
          source?: string | null
          state?: string | null
          status?: string
          updatedAt?: string | null
          user_id?: string | null
          vehicleCount?: number | null
          website?: string | null
          whatsapp?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accounts_loja_id_fkey"
            columns: ["loja_id"]
            isOneToOne: false
            referencedRelation: "lojas"
            referencedColumns: ["id"]
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
            foreignKeyName: "activities_accountId_fkey"
            columns: ["accountId"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_loja_id_fkey"
            columns: ["loja_id"]
            isOneToOne: false
            referencedRelation: "lojas"
            referencedColumns: ["id"]
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
            foreignKeyName: "audit_logs_loja_id_fkey"
            columns: ["loja_id"]
            isOneToOne: false
            referencedRelation: "lojas"
            referencedColumns: ["id"]
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
            foreignKeyName: "company_settings_loja_id_fkey"
            columns: ["loja_id"]
            isOneToOne: true
            referencedRelation: "lojas"
            referencedColumns: ["id"]
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
            foreignKeyName: "contacts_accountId_fkey"
            columns: ["accountId"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_loja_id_fkey"
            columns: ["loja_id"]
            isOneToOne: false
            referencedRelation: "lojas"
            referencedColumns: ["id"]
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
            foreignKeyName: "monthly_goals_loja_id_fkey"
            columns: ["loja_id"]
            isOneToOne: false
            referencedRelation: "lojas"
            referencedColumns: ["id"]
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
            foreignKeyName: "opportunities_accountId_fkey"
            columns: ["accountId"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunities_loja_id_fkey"
            columns: ["loja_id"]
            isOneToOne: false
            referencedRelation: "lojas"
            referencedColumns: ["id"]
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
            foreignKeyName: "order_form_items_order_form_id_fkey"
            columns: ["order_form_id"]
            isOneToOne: false
            referencedRelation: "order_forms"
            referencedColumns: ["id"]
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
            foreignKeyName: "order_forms_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_forms_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_forms_loja_id_fkey"
            columns: ["loja_id"]
            isOneToOne: false
            referencedRelation: "lojas"
            referencedColumns: ["id"]
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
            foreignKeyName: "profiles_loja_id_fkey"
            columns: ["loja_id"]
            isOneToOne: false
            referencedRelation: "lojas"
            referencedColumns: ["id"]
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
            foreignKeyName: "proposals_accountId_fkey"
            columns: ["accountId"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_loja_id_fkey"
            columns: ["loja_id"]
            isOneToOne: false
            referencedRelation: "lojas"
            referencedColumns: ["id"]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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

