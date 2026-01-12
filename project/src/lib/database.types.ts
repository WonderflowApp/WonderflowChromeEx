export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      audiences: {
        Row: {
          id: string
          workspace_id: string
          name: string
          platform: string | null
          estimated_reach_min: number | null
          estimated_reach_max: number | null
          notes: string | null
          tags: string[] | null
          created_by: string
          created_at: string
          updated_at: string
          funnel_stage: string | null
          funnel_type: string | null
          goal: string | null
          platforms: string[] | null
          mode: string | null
          is_public: boolean
          share_token: string | null
        }
        Insert: {
          id?: string
          workspace_id: string
          name: string
          platform?: string | null
          estimated_reach_min?: number | null
          estimated_reach_max?: number | null
          notes?: string | null
          tags?: string[] | null
          created_by: string
          created_at?: string
          updated_at?: string
          funnel_stage?: string | null
          funnel_type?: string | null
          goal?: string | null
          platforms?: string[] | null
          mode?: string | null
          is_public?: boolean
          share_token?: string | null
        }
        Update: {
          id?: string
          workspace_id?: string
          name?: string
          platform?: string | null
          estimated_reach_min?: number | null
          estimated_reach_max?: number | null
          notes?: string | null
          tags?: string[] | null
          created_by?: string
          created_at?: string
          updated_at?: string
          funnel_stage?: string | null
          funnel_type?: string | null
          goal?: string | null
          platforms?: string[] | null
          mode?: string | null
          is_public?: boolean
          share_token?: string | null
        }
      }
      workspaces: {
        Row: {
          id: string
          name: string
          url: string | null
          created_by: string
          created_at: string
          updated_at: string
          subscription_tier: string | null
          subscription_status: string | null
          subscription_end_date: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          billing_interval: string | null
        }
        Insert: {
          id?: string
          name: string
          url?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
          subscription_tier?: string | null
          subscription_status?: string | null
          subscription_end_date?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          billing_interval?: string | null
        }
        Update: {
          id?: string
          name?: string
          url?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
          subscription_tier?: string | null
          subscription_status?: string | null
          subscription_end_date?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          billing_interval?: string | null
        }
      }
      workspace_members: {
        Row: {
          id: string
          user_id: string
          workspace_id: string
          role: string
          joined_at: string
        }
        Insert: {
          id?: string
          user_id: string
          workspace_id: string
          role: string
          joined_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          workspace_id?: string
          role?: string
          joined_at?: string
        }
      }
      copy_blocks: {
        Row: {
          id: string
          workspace_id: string
          project_id: string | null
          name: string
          category: string | null
          type: string | null
          intent: string | null
          tone: string | null
          status: string | null
          notes: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          project_id?: string | null
          name: string
          category?: string | null
          type?: string | null
          intent?: string | null
          tone?: string | null
          status?: string | null
          notes?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          project_id?: string | null
          name?: string
          category?: string | null
          type?: string | null
          intent?: string | null
          tone?: string | null
          status?: string | null
          notes?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      copy_projects: {
        Row: {
          id: string
          workspace_id: string
          name: string
          description: string | null
          color: string | null
          status: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          name: string
          description?: string | null
          color?: string | null
          status?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          name?: string
          description?: string | null
          color?: string | null
          status?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
