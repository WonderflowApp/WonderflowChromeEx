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
      playbooks: {
        Row: {
          id: string
          name: string
          description: string | null
          workspace_id: string
          created_by: string
          created_at: string
          updated_at: string
          is_public: boolean
          share_token: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          workspace_id: string
          created_by: string
          created_at?: string
          updated_at?: string
          is_public?: boolean
          share_token?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          workspace_id?: string
          created_by?: string
          created_at?: string
          updated_at?: string
          is_public?: boolean
          share_token?: string | null
        }
      }
      playbook_pages: {
        Row: {
          id: string
          playbook_id: string
          name: string
          order_index: number
          created_at: string
          updated_at: string
          description: string | null
        }
        Insert: {
          id?: string
          playbook_id: string
          name?: string
          order_index?: number
          created_at?: string
          updated_at?: string
          description?: string | null
        }
        Update: {
          id?: string
          playbook_id?: string
          name?: string
          order_index?: number
          created_at?: string
          updated_at?: string
          description?: string | null
        }
      }
      playbook_sections: {
        Row: {
          id: string
          playbook_id: string
          page_id: string
          name: string
          category: string
          type: string
          intent: string
          tone: string
          length: string
          order_index: number
          created_by: string
          created_at: string
          updated_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          playbook_id: string
          page_id: string
          name: string
          category: string
          type: string
          intent: string
          tone: string
          length: string
          order_index?: number
          created_by: string
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          playbook_id?: string
          page_id?: string
          name?: string
          category?: string
          type?: string
          intent?: string
          tone?: string
          length?: string
          order_index?: number
          created_by?: string
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
      }
      section_variants: {
        Row: {
          id: string
          section_id: string
          variant_label: string
          content: string
          character_count: number
          is_primary: boolean
          created_at: string
          updated_at: string
          rich_content: Json | null
        }
        Insert: {
          id?: string
          section_id: string
          variant_label: string
          content?: string
          character_count?: number
          is_primary?: boolean
          created_at?: string
          updated_at?: string
          rich_content?: Json | null
        }
        Update: {
          id?: string
          section_id?: string
          variant_label?: string
          content?: string
          character_count?: number
          is_primary?: boolean
          created_at?: string
          updated_at?: string
          rich_content?: Json | null
        }
      }
      creative_folders: {
        Row: {
          id: string
          workspace_id: string
          name: string
          parent_folder_id: string | null
          color: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          name: string
          parent_folder_id?: string | null
          color?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          name?: string
          parent_folder_id?: string | null
          color?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      creative_assets: {
        Row: {
          id: string
          workspace_id: string
          folder_id: string | null
          name: string
          file_name: string
          file_type: string
          file_size: number
          storage_path: string
          thumbnail_path: string | null
          tags: string[] | null
          description: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          folder_id?: string | null
          name: string
          file_name: string
          file_type: string
          file_size?: number
          storage_path: string
          thumbnail_path?: string | null
          tags?: string[] | null
          description?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          folder_id?: string | null
          name?: string
          file_name?: string
          file_type?: string
          file_size?: number
          storage_path?: string
          thumbnail_path?: string | null
          tags?: string[] | null
          description?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      tracking_links: {
        Row: {
          id: string
          workspace_id: string
          name: string
          base_url: string
          utm_source: string | null
          utm_medium: string | null
          utm_campaign: string | null
          utm_term: string | null
          utm_content: string | null
          full_url: string
          short_code: string | null
          tags: string[] | null
          click_count: number
          is_active: boolean
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          name: string
          base_url: string
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          utm_term?: string | null
          utm_content?: string | null
          full_url: string
          short_code?: string | null
          tags?: string[] | null
          click_count?: number
          is_active?: boolean
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          name?: string
          base_url?: string
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          utm_term?: string | null
          utm_content?: string | null
          full_url?: string
          short_code?: string | null
          tags?: string[] | null
          click_count?: number
          is_active?: boolean
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      utm_links: {
        Row: {
          id: string
          user_id: string
          flow_id: string | null
          name: string
          original_url: string
          utm_url: string
          shortened_url: string | null
          campaign_name: string
          source: string
          medium: string
          created_at: string | null
          updated_at: string | null
          folder_id: string | null
          workspace_id: string | null
          short_link_id: string | null
        }
        Insert: {
          id?: string
          user_id: string
          flow_id?: string | null
          name: string
          original_url: string
          utm_url: string
          shortened_url?: string | null
          campaign_name: string
          source: string
          medium: string
          created_at?: string | null
          updated_at?: string | null
          folder_id?: string | null
          workspace_id?: string | null
          short_link_id?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          flow_id?: string | null
          name?: string
          original_url?: string
          utm_url?: string
          shortened_url?: string | null
          campaign_name?: string
          source?: string
          medium?: string
          created_at?: string | null
          updated_at?: string | null
          folder_id?: string | null
          workspace_id?: string | null
          short_link_id?: string | null
        }
      }
      utm_folders: {
        Row: {
          id: string
          user_id: string
          name: string
          color: string | null
          created_at: string
          updated_at: string
          workspace_id: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          color?: string | null
          created_at?: string
          updated_at?: string
          workspace_id?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          color?: string | null
          created_at?: string
          updated_at?: string
          workspace_id?: string | null
        }
      }
      storage_assets: {
        Row: {
          id: string
          name: string
          file_url: string
          file_path: string
          mime_type: string
          size: number | null
          width: number | null
          height: number | null
          duration: number | null
          board_id: string | null
          sub_board_id: string | null
          workspace_id: string
          created_by: string
          created_at: string
          updated_at: string
          pipeline_status: string
          approved_at: string | null
          archived_at: string | null
          is_favorite: boolean
          thumbnail_url: string | null
          thumbnail_path: string | null
          parent_asset_id: string | null
          generation_prompt: string | null
          is_ai_generated: boolean | null
          description: string | null
        }
        Insert: {
          id?: string
          name: string
          file_url: string
          file_path: string
          mime_type: string
          size?: number | null
          width?: number | null
          height?: number | null
          duration?: number | null
          board_id?: string | null
          sub_board_id?: string | null
          workspace_id: string
          created_by: string
          created_at?: string
          updated_at?: string
          pipeline_status?: string
          approved_at?: string | null
          archived_at?: string | null
          is_favorite?: boolean
          thumbnail_url?: string | null
          thumbnail_path?: string | null
          parent_asset_id?: string | null
          generation_prompt?: string | null
          is_ai_generated?: boolean | null
          description?: string | null
        }
        Update: {
          id?: string
          name?: string
          file_url?: string
          file_path?: string
          mime_type?: string
          size?: number | null
          width?: number | null
          height?: number | null
          duration?: number | null
          board_id?: string | null
          sub_board_id?: string | null
          workspace_id?: string
          created_by?: string
          created_at?: string
          updated_at?: string
          pipeline_status?: string
          approved_at?: string | null
          archived_at?: string | null
          is_favorite?: boolean
          thumbnail_url?: string | null
          thumbnail_path?: string | null
          parent_asset_id?: string | null
          generation_prompt?: string | null
          is_ai_generated?: boolean | null
          description?: string | null
        }
      }
      short_links: {
        Row: {
          id: string
          short_code: string
          original_url: string
          utm_link_id: string | null
          workspace_id: string
          created_by: string | null
          custom_alias: string | null
          is_active: boolean | null
          expires_at: string | null
          click_count: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          short_code: string
          original_url: string
          utm_link_id?: string | null
          workspace_id: string
          created_by?: string | null
          custom_alias?: string | null
          is_active?: boolean | null
          expires_at?: string | null
          click_count?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          short_code?: string
          original_url?: string
          utm_link_id?: string | null
          workspace_id?: string
          created_by?: string | null
          custom_alias?: string | null
          is_active?: boolean | null
          expires_at?: string | null
          click_count?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
  }
}
