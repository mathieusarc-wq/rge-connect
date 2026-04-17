import type { Database } from "./types";

// Re-exports des enums pour import direct côté app
export type UserRole = Database["public"]["Enums"]["user_role"];
export type SubcontractorPlan = Database["public"]["Enums"]["subcontractor_plan"];
export type InstallerPlan = Database["public"]["Enums"]["installer_plan"];
export type MissionStatus = Database["public"]["Enums"]["mission_status"];
export type MissionType = Database["public"]["Enums"]["mission_type"];
export type DocumentStatus = Database["public"]["Enums"]["document_status"];
export type DocumentKind = Database["public"]["Enums"]["document_kind"];
export type PaymentStatus = Database["public"]["Enums"]["payment_status"];
export type PaymentDirection = Database["public"]["Enums"]["payment_direction"];
export type ReviewSource = Database["public"]["Enums"]["review_source"];

// Types Row des tables principales
export type Installer = Database["public"]["Tables"]["installers"]["Row"];
export type Subcontractor = Database["public"]["Tables"]["subcontractors"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Mission = Database["public"]["Tables"]["missions"]["Row"];
export type MissionOffer = Database["public"]["Tables"]["mission_offers"]["Row"];
export type MissionPhoto = Database["public"]["Tables"]["mission_photos"]["Row"];
export type MissionReview = Database["public"]["Tables"]["mission_reviews"]["Row"];
export type SubcontractorDocument = Database["public"]["Tables"]["subcontractor_documents"]["Row"];
export type ApiKey = Database["public"]["Tables"]["api_keys"]["Row"];
export type Payment = Database["public"]["Tables"]["payments"]["Row"];
export type MangopayWallet = Database["public"]["Tables"]["mangopay_wallets"]["Row"];
export type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];
export type SupplierCatalog = Database["public"]["Tables"]["supplier_catalog"]["Row"];
export type SupplierOrder = Database["public"]["Tables"]["supplier_orders"]["Row"];
export type OutboundWebhook = Database["public"]["Tables"]["outbound_webhooks"]["Row"];
