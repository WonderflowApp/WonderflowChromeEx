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
      audience_pain_points: {
        Row: {
          id: string
          audience_id: string
          title: string
          description: string
          severity: string
          awareness_level: string
          emotional_driver: string
          sort_order: number | null
          created_at: string
          updated_at: string
          is_primary: boolean | null
          ai_reasoning: string | null
        }
        Insert: {
          id?: string
          audience_id: string
          title: string
          description: string
          severity: string
          awareness_level: string
          emotional_driver: string
          sort_order?: number | null
          created_at?: string
          updated_at?: string
          is_primary?: boolean | null
          ai_reasoning?: string | null
        }
        Update: {
          id?: string
          audience_id?: string
          title?: string
          description?: string
          severity?: string
          awareness_level?: string
          emotional_driver?: string
          sort_order?: number | null
          created_at?: string
          updated_at?: string
          is_primary?: boolean | null
          ai_reasoning?: string | null
        }
      }
      audience_content_pillars: {
        Row: {
          id: string
          audience_id: string
          name: string
          core_promise: string
          proof_type: string
          funnel_usage: string[] | null
          sort_order: number | null
          created_at: string
          updated_at: string
          ai_reasoning: string | null
        }
        Insert: {
          id?: string
          audience_id: string
          name: string
          core_promise: string
          proof_type: string
          funnel_usage?: string[] | null
          sort_order?: number | null
          created_at?: string
          updated_at?: string
          ai_reasoning?: string | null
        }
        Update: {
          id?: string
          audience_id?: string
          name?: string
          core_promise?: string
          proof_type?: string
          funnel_usage?: string[] | null
          sort_order?: number | null
          created_at?: string
          updated_at?: string
          ai_reasoning?: string | null
        }
      }
      audience_content_blocks: {
        Row: {
          id: string
          workspace_id: string
          canvas_id: string | null
          content_pillar_id: string | null
          title: string | null
          description: string | null
          block_type: string
          platform: string | null
          status: string
          notes: string | null
          position: number
          created_at: string
          updated_at: string
          created_by: string
          audience_id: string | null
          messaging: string | null
          intent: string | null
          tone_emotion: string | null
          parent_block_id: string | null
          objection: string | null
          reframe: string | null
        }
        Insert: {
          id?: string
          workspace_id: string
          canvas_id?: string | null
          content_pillar_id?: string | null
          title?: string | null
          description?: string | null
          block_type: string
          platform?: string | null
          status: string
          notes?: string | null
          position: number
          created_at?: string
          updated_at?: string
          created_by: string
          audience_id?: string | null
          messaging?: string | null
          intent?: string | null
          tone_emotion?: string | null
          parent_block_id?: string | null
          objection?: string | null
          reframe?: string | null
        }
        Update: {
          id?: string
          workspace_id?: string
          canvas_id?: string | null
          content_pillar_id?: string | null
          title?: string | null
          description?: string | null
          block_type?: string
          platform?: string | null
          status?: string
          notes?: string | null
          position?: number
          created_at?: string
          updated_at?: string
          created_by?: string
          audience_id?: string | null
          messaging?: string | null
          intent?: string | null
          tone_emotion?: string | null
          parent_block_id?: string | null
          objection?: string | null
          reframe?: string | null
        }
      }
      audience_targeting_layers: {
        Row: {
          id: string
          workspace_id: string
          audience_id: string
          name: string
          platform: string
          status: string
          audience_type: string
          filters: Json | null
          estimated_reach_min: number | null
          estimated_reach_max: number | null
          sort_order: number | null
          created_at: string
          updated_at: string
          created_by: string
          ai_targeting_report: Json | null
          ai_reasoning: string | null
          is_ai_generated: boolean | null
        }
        Insert: {
          id?: string
          workspace_id: string
          audience_id: string
          name: string
          platform: string
          status: string
          audience_type: string
          filters?: Json | null
          estimated_reach_min?: number | null
          estimated_reach_max?: number | null
          sort_order?: number | null
          created_at?: string
          updated_at?: string
          created_by: string
          ai_targeting_report?: Json | null
          ai_reasoning?: string | null
          is_ai_generated?: boolean | null
        }
        Update: {
          id?: string
          workspace_id?: string
          audience_id?: string
          name?: string
          platform?: string
          status?: string
          audience_type?: string
          filters?: Json | null
          estimated_reach_min?: number | null
          estimated_reach_max?: number | null
          sort_order?: number | null
          created_at?: string
          updated_at?: string
          created_by?: string
          ai_targeting_report?: Json | null
          ai_reasoning?: string | null
          is_ai_generated?: boolean | null
        }
      }
    }
  }
}
