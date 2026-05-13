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
          cadenceStage: string | null
          createdAt: string | null
          detailedSource: string | null
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
          phone: string | null
          priority: string
          segment: string | null
          status: string
          updatedAt: string | null
          website: string | null
        }
        Insert: {
          accountPotential?: string | null
          cadenceStage?: string | null
          createdAt?: string | null
          detailedSource?: string | null
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
          phone?: string | null
          priority: string
          segment?: string | null
          status: string
          updatedAt?: string | null
          website?: string | null
        }
        Update: {
          accountPotential?: string | null
          cadenceStage?: string | null
          createdAt?: string | null
          detailedSource?: string | null
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
          phone?: string | null
          priority?: string
          segment?: string | null
          status?: string
          updatedAt?: string | null
          website?: string | null
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
          date: string
          google_event_id: string | null
          id: string
          loja_id: string | null
          meet_link: string | null
          nextAction: string | null
          nextActionDate: string | null
          result: string | null
          type: string
        }
        Insert: {
          accountId?: string | null
          channel?: string | null
          completed?: boolean | null
          contactId?: string | null
          createdAt?: string | null
          date: string
          google_event_id?: string | null
          id?: string
          loja_id?: string | null
          meet_link?: string | null
          nextAction?: string | null
          nextActionDate?: string | null
          result?: string | null
          type: string
        }
        Update: {
          accountId?: string | null
          channel?: string | null
          completed?: boolean | null
          contactId?: string | null
          createdAt?: string | null
          date?: string
          google_event_id?: string | null
          id?: string
          loja_id?: string | null
          meet_link?: string | null
          nextAction?: string | null
          nextActionDate?: string | null
          result?: string | null
          type?: string
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
          created_at: string | null
          id: string
          logo_url: string | null
          loja_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          logo_url?: string | null
          loja_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          logo_url?: string | null
          loja_id?: string | null
          updated_at?: string | null
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
          updatedAt: string | null
          whatsapp: string | null
        }
        Insert: {
          accountId?: string | null
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
          updatedAt?: string | null
          whatsapp?: string | null
        }
        Update: {
          accountId?: string | null
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
          updatedAt?: string | null
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
// Table: profiles
//   id: uuid (not null)
//   nome: text (not null)
//   role: text (nullable, default: 'vendedor'::text)
//   loja_id: uuid (nullable)
//   ativo: boolean (nullable, default: true)
//   created_at: timestamp with time zone (nullable, default: now())
//   avatar_url: text (nullable)
//   phone: text (nullable)
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
// Table: activities
//   FOREIGN KEY activities_accountId_fkey: FOREIGN KEY ("accountId") REFERENCES accounts(id) ON DELETE CASCADE
//   FOREIGN KEY activities_contactId_fkey: FOREIGN KEY ("contactId") REFERENCES contacts(id) ON DELETE SET NULL
//   FOREIGN KEY activities_loja_id_fkey: FOREIGN KEY (loja_id) REFERENCES lojas(id)
//   PRIMARY KEY activities_pkey: PRIMARY KEY (id)
// Table: audit_logs
//   FOREIGN KEY audit_logs_changed_by_fkey: FOREIGN KEY (changed_by) REFERENCES auth.users(id)
//   FOREIGN KEY audit_logs_loja_id_fkey: FOREIGN KEY (loja_id) REFERENCES lojas(id)
//   PRIMARY KEY audit_logs_pkey: PRIMARY KEY (id)
// Table: company_settings
//   FOREIGN KEY company_settings_loja_id_fkey: FOREIGN KEY (loja_id) REFERENCES lojas(id) ON DELETE CASCADE
//   UNIQUE company_settings_loja_id_key: UNIQUE (loja_id)
//   PRIMARY KEY company_settings_pkey: PRIMARY KEY (id)
// Table: contacts
//   FOREIGN KEY contacts_accountId_fkey: FOREIGN KEY ("accountId") REFERENCES accounts(id) ON DELETE CASCADE
//   FOREIGN KEY contacts_loja_id_fkey: FOREIGN KEY (loja_id) REFERENCES lojas(id)
//   PRIMARY KEY contacts_pkey: PRIMARY KEY (id)
// Table: lojas
//   PRIMARY KEY lojas_pkey: PRIMARY KEY (id)
// Table: monthly_goals
//   FOREIGN KEY monthly_goals_loja_id_fkey: FOREIGN KEY (loja_id) REFERENCES lojas(id) ON DELETE CASCADE
//   PRIMARY KEY monthly_goals_pkey: PRIMARY KEY (id)
//   FOREIGN KEY monthly_goals_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: opportunities
//   FOREIGN KEY opportunities_accountId_fkey: FOREIGN KEY ("accountId") REFERENCES accounts(id) ON DELETE CASCADE
//   FOREIGN KEY opportunities_loja_id_fkey: FOREIGN KEY (loja_id) REFERENCES lojas(id)
//   PRIMARY KEY opportunities_pkey: PRIMARY KEY (id)
// Table: profiles
//   FOREIGN KEY profiles_id_fkey: FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
//   FOREIGN KEY profiles_loja_id_fkey: FOREIGN KEY (loja_id) REFERENCES lojas(id)
//   PRIMARY KEY profiles_pkey: PRIMARY KEY (id)
//   CHECK profiles_role_check: CHECK ((role = ANY (ARRAY['admin'::text, 'gerente'::text, 'vendedor'::text])))
// Table: user_integrations
//   PRIMARY KEY user_integrations_pkey: PRIMARY KEY (id)
//   FOREIGN KEY user_integrations_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
//   UNIQUE user_integrations_user_id_provider_key: UNIQUE (user_id, provider)

// --- ROW LEVEL SECURITY POLICIES ---
// Table: accounts
//   Policy "accounts_all" (ALL, PERMISSIVE) roles={public}
//     USING: ((get_user_role() = 'admin'::text) OR (loja_id = get_user_loja()))
// Table: activities
//   Policy "activities_all" (ALL, PERMISSIVE) roles={public}
//     USING: ((get_user_role() = 'admin'::text) OR (loja_id = get_user_loja()))
// Table: audit_logs
//   Policy "audit_logs_read" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: ((loja_id = get_user_loja()) OR (get_user_role() = 'admin'::text))
// Table: company_settings
//   Policy "company_settings_all" (ALL, PERMISSIVE) roles={public}
//     USING: ((loja_id = get_user_loja()) OR (get_user_role() = 'admin'::text))
// Table: contacts
//   Policy "contacts_all" (ALL, PERMISSIVE) roles={public}
//     USING: ((get_user_role() = 'admin'::text) OR (loja_id = get_user_loja()))
// Table: lojas
//   Policy "lojas_read" (SELECT, PERMISSIVE) roles={public}
//     USING: true
// Table: monthly_goals
//   Policy "monthly_goals_all" (ALL, PERMISSIVE) roles={public}
//     USING: ((get_user_role() = 'admin'::text) OR (loja_id = get_user_loja()))
// Table: opportunities
//   Policy "opportunities_all" (ALL, PERMISSIVE) roles={public}
//     USING: ((get_user_role() = 'admin'::text) OR (loja_id = get_user_loja()))
// Table: profiles
//   Policy "profiles_read" (SELECT, PERMISSIVE) roles={public}
//     USING: ((auth.uid() = id) OR (get_user_role() = 'admin'::text))
//   Policy "profiles_update" (UPDATE, PERMISSIVE) roles={public}
//     USING: ((auth.uid() = id) OR (get_user_role() = 'admin'::text))
// Table: user_integrations
//   Policy "Users can manage their own integrations" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)

// --- DATABASE FUNCTIONS ---
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
//     SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
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

// --- TRIGGERS ---
// Table: accounts
//   on_account_created_after_insert: CREATE TRIGGER on_account_created_after_insert AFTER INSERT ON public.accounts FOR EACH ROW EXECUTE FUNCTION handle_new_account_after_insert()
//   on_account_created_auto_pipeline: CREATE TRIGGER on_account_created_auto_pipeline BEFORE INSERT ON public.accounts FOR EACH ROW EXECUTE FUNCTION handle_new_account_auto_pipeline()
// Table: contacts
//   on_contact_change: CREATE TRIGGER on_contact_change AFTER INSERT OR DELETE OR UPDATE ON public.contacts FOR EACH ROW EXECUTE FUNCTION log_contact_changes()
//   on_contact_created_auto_pipeline: CREATE TRIGGER on_contact_created_auto_pipeline AFTER INSERT ON public.contacts FOR EACH ROW EXECUTE FUNCTION handle_new_contact_auto_pipeline()

// --- INDEXES ---
// Table: company_settings
//   CREATE UNIQUE INDEX company_settings_loja_id_key ON public.company_settings USING btree (loja_id)
// Table: monthly_goals
//   CREATE UNIQUE INDEX monthly_goals_month_loja_user_idx ON public.monthly_goals USING btree (month, COALESCE(loja_id, '00000000-0000-0000-0000-000000000000'::uuid), COALESCE(user_id, '00000000-0000-0000-0000-000000000000'::uuid))
// Table: user_integrations
//   CREATE UNIQUE INDEX user_integrations_user_id_provider_key ON public.user_integrations USING btree (user_id, provider)

