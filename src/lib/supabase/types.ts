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
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      api_keys: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          installer_id: string
          key_hash: string
          key_prefix: string
          last_used_at: string | null
          name: string
          revoked_at: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          installer_id: string
          key_hash: string
          key_prefix: string
          last_used_at?: string | null
          name: string
          revoked_at?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          installer_id?: string
          key_hash?: string
          key_prefix?: string
          last_used_at?: string | null
          name?: string
          revoked_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_installer_id_fkey"
            columns: ["installer_id"]
            isOneToOne: false
            referencedRelation: "installers"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: Database["public"]["Enums"]["audit_action"]
          actor_id: string | null
          actor_ip: unknown
          actor_user_agent: string | null
          created_at: string
          error_message: string | null
          id: string
          installer_id: string | null
          metadata: Json | null
          new_values: Json | null
          old_values: Json | null
          subcontractor_id: string | null
          success: boolean
          target_id: string | null
          target_table: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["audit_action"]
          actor_id?: string | null
          actor_ip?: unknown
          actor_user_agent?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          installer_id?: string | null
          metadata?: Json | null
          new_values?: Json | null
          old_values?: Json | null
          subcontractor_id?: string | null
          success?: boolean
          target_id?: string | null
          target_table?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["audit_action"]
          actor_id?: string | null
          actor_ip?: unknown
          actor_user_agent?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          installer_id?: string | null
          metadata?: Json | null
          new_values?: Json | null
          old_values?: Json | null
          subcontractor_id?: string | null
          success?: boolean
          target_id?: string | null
          target_table?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_installer_id_fkey"
            columns: ["installer_id"]
            isOneToOne: false
            referencedRelation: "installers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_subcontractor_id_fkey"
            columns: ["subcontractor_id"]
            isOneToOne: false
            referencedRelation: "subcontractors"
            referencedColumns: ["id"]
          },
        ]
      }
      installers: {
        Row: {
          address: string
          city: string
          created_at: string
          email: string
          id: string
          mangopay_user_id: string | null
          mangopay_wallet_id: string | null
          name: string
          phone: string | null
          plan: Database["public"]["Enums"]["installer_plan"]
          postal_code: string
          sepa_mandate_id: string | null
          siret: string
          updated_at: string
        }
        Insert: {
          address: string
          city: string
          created_at?: string
          email: string
          id?: string
          mangopay_user_id?: string | null
          mangopay_wallet_id?: string | null
          name: string
          phone?: string | null
          plan?: Database["public"]["Enums"]["installer_plan"]
          postal_code: string
          sepa_mandate_id?: string | null
          siret: string
          updated_at?: string
        }
        Update: {
          address?: string
          city?: string
          created_at?: string
          email?: string
          id?: string
          mangopay_user_id?: string | null
          mangopay_wallet_id?: string | null
          name?: string
          phone?: string | null
          plan?: Database["public"]["Enums"]["installer_plan"]
          postal_code?: string
          sepa_mandate_id?: string | null
          siret?: string
          updated_at?: string
        }
        Relationships: []
      }
      mangopay_wallets: {
        Row: {
          balance_eur: number
          created_at: string
          id: string
          kyc_status: string
          mangopay_user_id: string
          mangopay_wallet_id: string
          owner_id: string
          owner_type: string
          updated_at: string
        }
        Insert: {
          balance_eur?: number
          created_at?: string
          id?: string
          kyc_status?: string
          mangopay_user_id: string
          mangopay_wallet_id: string
          owner_id: string
          owner_type: string
          updated_at?: string
        }
        Update: {
          balance_eur?: number
          created_at?: string
          id?: string
          kyc_status?: string
          mangopay_user_id?: string
          mangopay_wallet_id?: string
          owner_id?: string
          owner_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      mission_offers: {
        Row: {
          accepted_at: string | null
          client_validated_at: string | null
          client_validation_token: string | null
          created_at: string
          id: string
          message: string | null
          mission_id: string
          proposed_slots: Json
          rejected_at: string | null
          rejection_reason: string | null
          selected_slot_index: number | null
          subcontractor_id: string
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          client_validated_at?: string | null
          client_validation_token?: string | null
          created_at?: string
          id?: string
          message?: string | null
          mission_id: string
          proposed_slots: Json
          rejected_at?: string | null
          rejection_reason?: string | null
          selected_slot_index?: number | null
          subcontractor_id: string
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          client_validated_at?: string | null
          client_validation_token?: string | null
          created_at?: string
          id?: string
          message?: string | null
          mission_id?: string
          proposed_slots?: Json
          rejected_at?: string | null
          rejection_reason?: string | null
          selected_slot_index?: number | null
          subcontractor_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mission_offers_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mission_offers_subcontractor_id_fkey"
            columns: ["subcontractor_id"]
            isOneToOne: false
            referencedRelation: "subcontractors"
            referencedColumns: ["id"]
          },
        ]
      }
      mission_photos: {
        Row: {
          created_at: string
          file_hash: string
          file_path: string
          id: string
          latitude: number | null
          longitude: number | null
          mission_id: string
          sha256: string
          stage: string
          subcontractor_id: string | null
          taken_at: string
          universign_timestamp: string | null
          universign_token: string | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          file_hash: string
          file_path: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          mission_id: string
          sha256: string
          stage: string
          subcontractor_id?: string | null
          taken_at: string
          universign_timestamp?: string | null
          universign_token?: string | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          file_hash?: string
          file_path?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          mission_id?: string
          sha256?: string
          stage?: string
          subcontractor_id?: string | null
          taken_at?: string
          universign_timestamp?: string | null
          universign_token?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mission_photos_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mission_photos_subcontractor_id_fkey"
            columns: ["subcontractor_id"]
            isOneToOne: false
            referencedRelation: "subcontractors"
            referencedColumns: ["id"]
          },
        ]
      }
      mission_reviews: {
        Row: {
          client_name: string | null
          comment: string | null
          created_at: string
          id: string
          mission_id: string
          published_on_google: boolean
          published_on_google_at: string | null
          rating: number
          source: Database["public"]["Enums"]["review_source"]
          subcontractor_id: string
        }
        Insert: {
          client_name?: string | null
          comment?: string | null
          created_at?: string
          id?: string
          mission_id: string
          published_on_google?: boolean
          published_on_google_at?: string | null
          rating: number
          source?: Database["public"]["Enums"]["review_source"]
          subcontractor_id: string
        }
        Update: {
          client_name?: string | null
          comment?: string | null
          created_at?: string
          id?: string
          mission_id?: string
          published_on_google?: boolean
          published_on_google_at?: string | null
          rating?: number
          source?: Database["public"]["Enums"]["review_source"]
          subcontractor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mission_reviews_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: true
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mission_reviews_subcontractor_id_fkey"
            columns: ["subcontractor_id"]
            isOneToOne: false
            referencedRelation: "subcontractors"
            referencedColumns: ["id"]
          },
        ]
      }
      missions: {
        Row: {
          address: string
          amount_ht: number
          amount_ttc: number | null
          city: string
          client_email: string | null
          client_first_name: string
          client_last_name: string
          client_phone: string | null
          commission_amount: number | null
          completed_at: string | null
          created_at: string
          created_by: string | null
          equipment: string | null
          equipment_brand: string | null
          external_id: string | null
          factoring_enabled: boolean
          id: string
          installer_id: string
          latitude: number | null
          longitude: number | null
          notes: string | null
          payment_delay_days: number
          postal_code: string
          preferred_end_date: string | null
          preferred_start_date: string | null
          reference: string
          scheduled_end_at: string | null
          scheduled_start_at: string | null
          source: string
          status: Database["public"]["Enums"]["mission_status"]
          subcontractor_id: string | null
          type: Database["public"]["Enums"]["mission_type"]
          updated_at: string
        }
        Insert: {
          address: string
          amount_ht: number
          amount_ttc?: number | null
          city: string
          client_email?: string | null
          client_first_name: string
          client_last_name: string
          client_phone?: string | null
          commission_amount?: number | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          equipment?: string | null
          equipment_brand?: string | null
          external_id?: string | null
          factoring_enabled?: boolean
          id?: string
          installer_id: string
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          payment_delay_days?: number
          postal_code: string
          preferred_end_date?: string | null
          preferred_start_date?: string | null
          reference: string
          scheduled_end_at?: string | null
          scheduled_start_at?: string | null
          source?: string
          status?: Database["public"]["Enums"]["mission_status"]
          subcontractor_id?: string | null
          type: Database["public"]["Enums"]["mission_type"]
          updated_at?: string
        }
        Update: {
          address?: string
          amount_ht?: number
          amount_ttc?: number | null
          city?: string
          client_email?: string | null
          client_first_name?: string
          client_last_name?: string
          client_phone?: string | null
          commission_amount?: number | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          equipment?: string | null
          equipment_brand?: string | null
          external_id?: string | null
          factoring_enabled?: boolean
          id?: string
          installer_id?: string
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          payment_delay_days?: number
          postal_code?: string
          preferred_end_date?: string | null
          preferred_start_date?: string | null
          reference?: string
          scheduled_end_at?: string | null
          scheduled_start_at?: string | null
          source?: string
          status?: Database["public"]["Enums"]["mission_status"]
          subcontractor_id?: string | null
          type?: Database["public"]["Enums"]["mission_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "missions_installer_id_fkey"
            columns: ["installer_id"]
            isOneToOne: false
            referencedRelation: "installers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "missions_subcontractor_id_fkey"
            columns: ["subcontractor_id"]
            isOneToOne: false
            referencedRelation: "subcontractors"
            referencedColumns: ["id"]
          },
        ]
      }
      outbound_webhooks: {
        Row: {
          attempt_count: number
          created_at: string
          delivered: boolean
          delivered_at: string | null
          event: string
          http_status: number | null
          id: string
          installer_id: string
          last_error: string | null
          next_retry_at: string | null
          payload: Json
          signature: string
          target_url: string
          updated_at: string
        }
        Insert: {
          attempt_count?: number
          created_at?: string
          delivered?: boolean
          delivered_at?: string | null
          event: string
          http_status?: number | null
          id?: string
          installer_id: string
          last_error?: string | null
          next_retry_at?: string | null
          payload: Json
          signature: string
          target_url: string
          updated_at?: string
        }
        Update: {
          attempt_count?: number
          created_at?: string
          delivered?: boolean
          delivered_at?: string | null
          event?: string
          http_status?: number | null
          id?: string
          installer_id?: string
          last_error?: string | null
          next_retry_at?: string | null
          payload?: Json
          signature?: string
          target_url?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "outbound_webhooks_installer_id_fkey"
            columns: ["installer_id"]
            isOneToOne: false
            referencedRelation: "installers"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount_eur: number
          created_at: string
          direction: Database["public"]["Enums"]["payment_direction"]
          executed_at: string | null
          failed_reason: string | null
          id: string
          installer_id: string | null
          mangopay_transaction_id: string | null
          mission_id: string | null
          scheduled_at: string | null
          status: Database["public"]["Enums"]["payment_status"]
          subcontractor_id: string | null
          updated_at: string
        }
        Insert: {
          amount_eur: number
          created_at?: string
          direction: Database["public"]["Enums"]["payment_direction"]
          executed_at?: string | null
          failed_reason?: string | null
          id?: string
          installer_id?: string | null
          mangopay_transaction_id?: string | null
          mission_id?: string | null
          scheduled_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          subcontractor_id?: string | null
          updated_at?: string
        }
        Update: {
          amount_eur?: number
          created_at?: string
          direction?: Database["public"]["Enums"]["payment_direction"]
          executed_at?: string | null
          failed_reason?: string | null
          id?: string
          installer_id?: string | null
          mangopay_transaction_id?: string | null
          mission_id?: string | null
          scheduled_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          subcontractor_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_installer_id_fkey"
            columns: ["installer_id"]
            isOneToOne: false
            referencedRelation: "installers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_subcontractor_id_fkey"
            columns: ["subcontractor_id"]
            isOneToOne: false
            referencedRelation: "subcontractors"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          first_name: string | null
          id: string
          installer_id: string | null
          is_super_admin: boolean
          last_name: string | null
          role: Database["public"]["Enums"]["user_role"]
          subcontractor_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name?: string | null
          id: string
          installer_id?: string | null
          is_super_admin?: boolean
          last_name?: string | null
          role: Database["public"]["Enums"]["user_role"]
          subcontractor_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          installer_id?: string | null
          is_super_admin?: boolean
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          subcontractor_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_installer_id_fkey"
            columns: ["installer_id"]
            isOneToOne: false
            referencedRelation: "installers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_subcontractor_id_fkey"
            columns: ["subcontractor_id"]
            isOneToOne: false
            referencedRelation: "subcontractors"
            referencedColumns: ["id"]
          },
        ]
      }
      service_credentials: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_sensitive: boolean
          key_name: string
          service: string
          updated_at: string
          updated_by: string | null
          value: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_sensitive?: boolean
          key_name: string
          service: string
          updated_at?: string
          updated_by?: string | null
          value?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_sensitive?: boolean
          key_name?: string
          service?: string
          updated_at?: string
          updated_by?: string | null
          value?: string | null
        }
        Relationships: []
      }
      subcontractor_documents: {
        Row: {
          created_at: string
          expires_at: string | null
          extracted_data: Json | null
          file_name: string | null
          file_path: string | null
          id: string
          issued_at: string | null
          kind: Database["public"]["Enums"]["document_kind"]
          rejected_reason: string | null
          status: Database["public"]["Enums"]["document_status"]
          subcontractor_id: string
          updated_at: string
          validated_at: string | null
          validated_by: string | null
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          extracted_data?: Json | null
          file_name?: string | null
          file_path?: string | null
          id?: string
          issued_at?: string | null
          kind: Database["public"]["Enums"]["document_kind"]
          rejected_reason?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          subcontractor_id: string
          updated_at?: string
          validated_at?: string | null
          validated_by?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          extracted_data?: Json | null
          file_name?: string | null
          file_path?: string | null
          id?: string
          issued_at?: string | null
          kind?: Database["public"]["Enums"]["document_kind"]
          rejected_reason?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          subcontractor_id?: string
          updated_at?: string
          validated_at?: string | null
          validated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subcontractor_documents_subcontractor_id_fkey"
            columns: ["subcontractor_id"]
            isOneToOne: false
            referencedRelation: "subcontractors"
            referencedColumns: ["id"]
          },
        ]
      }
      subcontractors: {
        Row: {
          address: string
          city: string
          created_at: string
          email: string
          factoring_enabled: boolean
          google_business_profile_url: string | null
          id: string
          intervention_radius_km: number
          latitude: number | null
          longitude: number | null
          mangopay_user_id: string | null
          mangopay_wallet_id: string | null
          mission_types: Database["public"]["Enums"]["mission_type"][]
          name: string
          phone: string | null
          plan: Database["public"]["Enums"]["subcontractor_plan"]
          postal_code: string
          qualifications: string[]
          review_count: number
          score: number | null
          siret: string
          updated_at: string
        }
        Insert: {
          address: string
          city: string
          created_at?: string
          email: string
          factoring_enabled?: boolean
          google_business_profile_url?: string | null
          id?: string
          intervention_radius_km?: number
          latitude?: number | null
          longitude?: number | null
          mangopay_user_id?: string | null
          mangopay_wallet_id?: string | null
          mission_types?: Database["public"]["Enums"]["mission_type"][]
          name: string
          phone?: string | null
          plan?: Database["public"]["Enums"]["subcontractor_plan"]
          postal_code: string
          qualifications?: string[]
          review_count?: number
          score?: number | null
          siret: string
          updated_at?: string
        }
        Update: {
          address?: string
          city?: string
          created_at?: string
          email?: string
          factoring_enabled?: boolean
          google_business_profile_url?: string | null
          id?: string
          intervention_radius_km?: number
          latitude?: number | null
          longitude?: number | null
          mangopay_user_id?: string | null
          mangopay_wallet_id?: string | null
          mission_types?: Database["public"]["Enums"]["mission_type"][]
          name?: string
          phone?: string | null
          plan?: Database["public"]["Enums"]["subcontractor_plan"]
          postal_code?: string
          qualifications?: string[]
          review_count?: number
          score?: number | null
          siret?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          amount_monthly: number
          cancelled_at: string | null
          created_at: string
          current_period_end: string
          id: string
          owner_id: string
          owner_type: string
          plan: string
          started_at: string
          status: string
          updated_at: string
        }
        Insert: {
          amount_monthly: number
          cancelled_at?: string | null
          created_at?: string
          current_period_end: string
          id?: string
          owner_id: string
          owner_type: string
          plan: string
          started_at?: string
          status?: string
          updated_at?: string
        }
        Update: {
          amount_monthly?: number
          cancelled_at?: string | null
          created_at?: string
          current_period_end?: string
          id?: string
          owner_id?: string
          owner_type?: string
          plan?: string
          started_at?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      super_admin_whitelist: {
        Row: {
          created_at: string
          email: string
          granted_by: string | null
          note: string | null
        }
        Insert: {
          created_at?: string
          email: string
          granted_by?: string | null
          note?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          granted_by?: string | null
          note?: string | null
        }
        Relationships: []
      }
      supplier_catalog: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          list_price_ht: number
          name: string
          negotiated_price_ht: number
          reference: string
          supplier: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          list_price_ht: number
          name: string
          negotiated_price_ht: number
          reference: string
          supplier: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          list_price_ht?: number
          name?: string
          negotiated_price_ht?: number
          reference?: string
          supplier?: string
          updated_at?: string
        }
        Relationships: []
      }
      supplier_orders: {
        Row: {
          amount_ht: number
          amount_ttc: number
          created_at: string
          delivered_at: string | null
          id: string
          items: Json
          mission_id: string | null
          placed_at: string | null
          status: string
          subcontractor_id: string
          supplier: string
          updated_at: string
        }
        Insert: {
          amount_ht: number
          amount_ttc: number
          created_at?: string
          delivered_at?: string | null
          id?: string
          items: Json
          mission_id?: string | null
          placed_at?: string | null
          status?: string
          subcontractor_id: string
          supplier: string
          updated_at?: string
        }
        Update: {
          amount_ht?: number
          amount_ttc?: number
          created_at?: string
          delivered_at?: string | null
          id?: string
          items?: Json
          mission_id?: string | null
          placed_at?: string | null
          status?: string
          subcontractor_id?: string
          supplier?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_orders_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_orders_subcontractor_id_fkey"
            columns: ["subcontractor_id"]
            isOneToOne: false
            referencedRelation: "subcontractors"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_installer_id: { Args: never; Returns: string }
      current_subcontractor_id: { Args: never; Returns: string }
      get_service_credential: {
        Args: { p_key_name: string; p_service: string }
        Returns: string
      }
      is_installer_member: {
        Args: { target_installer_id: string }
        Returns: boolean
      }
      is_subcontractor_member: {
        Args: { target_subcontractor_id: string }
        Returns: boolean
      }
      is_super_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      audit_action:
        | "insert"
        | "update"
        | "delete"
        | "login_success"
        | "login_failure"
        | "password_change"
        | "password_reset"
        | "api_key_created"
        | "api_key_revoked"
        | "document_uploaded"
        | "document_validated"
        | "document_rejected"
        | "mission_published"
        | "mission_assigned"
        | "mission_cancelled"
        | "payment_initiated"
        | "payment_executed"
        | "payment_failed"
        | "webhook_delivered"
        | "webhook_failed"
        | "rate_limit_triggered"
        | "unauthorized_access"
      document_kind:
        | "kbis"
        | "rge_qualipac"
        | "rge_qualipv"
        | "rge_qualibois"
        | "rge_qualisol"
        | "decennale"
        | "urssaf"
        | "carte_btp"
        | "rib"
        | "other"
      document_status:
        | "pending"
        | "valid"
        | "expiring"
        | "expired"
        | "missing"
        | "rejected"
      installer_plan: "discovery" | "business" | "enterprise"
      mission_status:
        | "draft"
        | "published"
        | "assigned"
        | "awaiting_client_validation"
        | "scheduled"
        | "in_progress"
        | "completed"
        | "cancelled"
      mission_type:
        | "pac_air_eau"
        | "pac_air_air"
        | "climatisation"
        | "pv"
        | "ite"
        | "isolation_combles"
        | "ssc"
      payment_direction:
        | "debit_installer"
        | "credit_subcontractor"
        | "commission"
        | "factoring"
      payment_status:
        | "pending"
        | "debited"
        | "transferred"
        | "failed"
        | "refunded"
      review_source: "automatic" | "manual"
      subcontractor_plan: "standard" | "pro"
      user_role: "installer" | "subcontractor" | "admin"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      audit_action: [
        "insert",
        "update",
        "delete",
        "login_success",
        "login_failure",
        "password_change",
        "password_reset",
        "api_key_created",
        "api_key_revoked",
        "document_uploaded",
        "document_validated",
        "document_rejected",
        "mission_published",
        "mission_assigned",
        "mission_cancelled",
        "payment_initiated",
        "payment_executed",
        "payment_failed",
        "webhook_delivered",
        "webhook_failed",
        "rate_limit_triggered",
        "unauthorized_access",
      ],
      document_kind: [
        "kbis",
        "rge_qualipac",
        "rge_qualipv",
        "rge_qualibois",
        "rge_qualisol",
        "decennale",
        "urssaf",
        "carte_btp",
        "rib",
        "other",
      ],
      document_status: [
        "pending",
        "valid",
        "expiring",
        "expired",
        "missing",
        "rejected",
      ],
      installer_plan: ["discovery", "business", "enterprise"],
      mission_status: [
        "draft",
        "published",
        "assigned",
        "awaiting_client_validation",
        "scheduled",
        "in_progress",
        "completed",
        "cancelled",
      ],
      mission_type: [
        "pac_air_eau",
        "pac_air_air",
        "climatisation",
        "pv",
        "ite",
        "isolation_combles",
        "ssc",
      ],
      payment_direction: [
        "debit_installer",
        "credit_subcontractor",
        "commission",
        "factoring",
      ],
      payment_status: [
        "pending",
        "debited",
        "transferred",
        "failed",
        "refunded",
      ],
      review_source: ["automatic", "manual"],
      subcontractor_plan: ["standard", "pro"],
      user_role: ["installer", "subcontractor", "admin"],
    },
  },
} as const
