/**
 * Types Supabase pour RGE Connect
 *
 * Ce fichier sera regénéré automatiquement avec :
 *   npx supabase gen types typescript --project-id <id> > src/lib/supabase/types.ts
 *
 * En attendant, ces types reflètent manuellement le schema défini dans
 * supabase/migrations/20260417083216_initial_schema.sql
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "installer" | "subcontractor" | "admin";
export type SubcontractorPlan = "standard" | "pro";
export type InstallerPlan = "discovery" | "business" | "enterprise";
export type MissionStatus =
  | "draft"
  | "published"
  | "assigned"
  | "awaiting_client_validation"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled";
export type MissionType =
  | "pac_air_eau"
  | "pac_air_air"
  | "climatisation"
  | "pv"
  | "ite"
  | "isolation_combles"
  | "ssc";
export type DocumentStatus =
  | "pending"
  | "valid"
  | "expiring"
  | "expired"
  | "missing"
  | "rejected";
export type DocumentKind =
  | "kbis"
  | "rge_qualipac"
  | "rge_qualipv"
  | "rge_qualibois"
  | "rge_qualisol"
  | "decennale"
  | "urssaf"
  | "carte_btp"
  | "rib"
  | "other";
export type PaymentStatus = "pending" | "debited" | "transferred" | "failed" | "refunded";
export type PaymentDirection =
  | "debit_installer"
  | "credit_subcontractor"
  | "commission"
  | "factoring";
export type ReviewSource = "automatic" | "manual";

export interface Database {
  public: {
    Tables: {
      installers: {
        Row: {
          id: string;
          name: string;
          siret: string;
          address: string;
          city: string;
          postal_code: string;
          email: string;
          phone: string | null;
          plan: InstallerPlan;
          mangopay_user_id: string | null;
          mangopay_wallet_id: string | null;
          sepa_mandate_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          siret: string;
          address: string;
          city: string;
          postal_code: string;
          email: string;
          phone?: string | null;
          plan?: InstallerPlan;
          mangopay_user_id?: string | null;
          mangopay_wallet_id?: string | null;
          sepa_mandate_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["installers"]["Insert"]>;
      };
      subcontractors: {
        Row: {
          id: string;
          name: string;
          siret: string;
          address: string;
          city: string;
          postal_code: string;
          latitude: number | null;
          longitude: number | null;
          intervention_radius_km: number;
          email: string;
          phone: string | null;
          plan: SubcontractorPlan;
          qualifications: string[];
          mission_types: MissionType[];
          score: number | null;
          review_count: number;
          mangopay_user_id: string | null;
          mangopay_wallet_id: string | null;
          google_business_profile_url: string | null;
          factoring_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          siret: string;
          address: string;
          city: string;
          postal_code: string;
          latitude?: number | null;
          longitude?: number | null;
          intervention_radius_km?: number;
          email: string;
          phone?: string | null;
          plan?: SubcontractorPlan;
          qualifications?: string[];
          mission_types?: MissionType[];
          score?: number | null;
          review_count?: number;
          mangopay_user_id?: string | null;
          mangopay_wallet_id?: string | null;
          google_business_profile_url?: string | null;
          factoring_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["subcontractors"]["Insert"]>;
      };
      profiles: {
        Row: {
          id: string;
          installer_id: string | null;
          subcontractor_id: string | null;
          role: UserRole;
          is_super_admin: boolean;
          first_name: string | null;
          last_name: string | null;
          email: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          installer_id?: string | null;
          subcontractor_id?: string | null;
          role: UserRole;
          is_super_admin?: boolean;
          first_name?: string | null;
          last_name?: string | null;
          email: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      missions: {
        Row: {
          id: string;
          reference: string;
          installer_id: string;
          subcontractor_id: string | null;
          type: MissionType;
          status: MissionStatus;
          client_first_name: string;
          client_last_name: string;
          client_email: string | null;
          client_phone: string | null;
          address: string;
          city: string;
          postal_code: string;
          latitude: number | null;
          longitude: number | null;
          equipment: string | null;
          equipment_brand: string | null;
          notes: string | null;
          amount_ht: number;
          amount_ttc: number | null;
          commission_amount: number | null;
          preferred_start_date: string | null;
          preferred_end_date: string | null;
          scheduled_start_at: string | null;
          scheduled_end_at: string | null;
          completed_at: string | null;
          payment_delay_days: number;
          factoring_enabled: boolean;
          source: string;
          external_id: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["missions"]["Row"], "id" | "created_at" | "updated_at" | "status"> & {
          id?: string;
          status?: MissionStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["missions"]["Insert"]>;
      };
      subcontractor_documents: {
        Row: {
          id: string;
          subcontractor_id: string;
          kind: DocumentKind;
          file_path: string | null;
          file_name: string | null;
          issued_at: string | null;
          expires_at: string | null;
          status: DocumentStatus;
          extracted_data: Json | null;
          validated_by: string | null;
          validated_at: string | null;
          rejected_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["subcontractor_documents"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["subcontractor_documents"]["Insert"]>;
      };
      payments: {
        Row: {
          id: string;
          mission_id: string | null;
          installer_id: string | null;
          subcontractor_id: string | null;
          direction: PaymentDirection;
          amount_eur: number;
          status: PaymentStatus;
          mangopay_transaction_id: string | null;
          scheduled_at: string | null;
          executed_at: string | null;
          failed_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["payments"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["payments"]["Insert"]>;
      };
      mission_reviews: {
        Row: {
          id: string;
          mission_id: string;
          subcontractor_id: string;
          rating: number;
          comment: string | null;
          client_name: string | null;
          source: ReviewSource;
          published_on_google: boolean;
          published_on_google_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["mission_reviews"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["mission_reviews"]["Insert"]>;
      };
    };
    Functions: {
      is_super_admin: { Args: Record<string, never>; Returns: boolean };
      current_installer_id: { Args: Record<string, never>; Returns: string | null };
      current_subcontractor_id: { Args: Record<string, never>; Returns: string | null };
      is_installer_member: { Args: { target_installer_id: string }; Returns: boolean };
      is_subcontractor_member: { Args: { target_subcontractor_id: string }; Returns: boolean };
    };
    Enums: {
      user_role: UserRole;
      subcontractor_plan: SubcontractorPlan;
      installer_plan: InstallerPlan;
      mission_status: MissionStatus;
      mission_type: MissionType;
      document_status: DocumentStatus;
      document_kind: DocumentKind;
      payment_status: PaymentStatus;
      payment_direction: PaymentDirection;
      review_source: ReviewSource;
    };
  };
}
