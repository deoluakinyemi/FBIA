export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      answers: {
        Row: {
          id: string
          assessment_id: string
          question_id: string
          option_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          assessment_id: string
          question_id: string
          option_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          assessment_id?: string
          question_id?: string
          option_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      assessments: {
        Row: {
          id: string
          user_id: string
          overall_score: number | null
          completed_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          overall_score?: number | null
          completed_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          overall_score?: number | null
          completed_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      options: {
        Row: {
          id: string
          question_id: string
          option_text: string
          score: number
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          question_id: string
          option_text: string
          score: number
          display_order: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          question_id?: string
          option_text?: string
          score?: number
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      pillar_scores: {
        Row: {
          id: string
          assessment_id: string
          pillar_id: string
          score: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          assessment_id: string
          pillar_id: string
          score: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          assessment_id?: string
          pillar_id?: string
          score?: number
          created_at?: string
          updated_at?: string
        }
      }
      pillars: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          display_order: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      progress_goals: {
        Row: {
          id: string
          user_id: string
          pillar_id: string | null
          title: string
          target_score: number
          target_date: string | null
          completed: boolean
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          pillar_id?: string | null
          title: string
          target_score: number
          target_date?: string | null
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          pillar_id?: string | null
          title?: string
          target_score?: number
          target_date?: string | null
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          pillar_id: string
          question: string
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          pillar_id: string
          question: string
          display_order: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          pillar_id?: string
          question?: string
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      recommendations: {
        Row: {
          id: string
          pillar_id: string
          score_range_min: number
          score_range_max: number
          recommendation_text: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          pillar_id: string
          score_range_min: number
          score_range_max: number
          recommendation_text: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          pillar_id?: string
          score_range_min?: number
          score_range_max?: number
          recommendation_text?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_dashboard_settings: {
        Row: {
          id: string
          user_id: string
          show_progress_chart: boolean
          show_recommendations: boolean
          default_view: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          show_progress_chart?: boolean
          show_recommendations?: boolean
          default_view?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          show_progress_chart?: boolean
          show_recommendations?: boolean
          default_view?: string
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string | null
          name: string | null
          created_at: string
          updated_at: string
          phone: string | null
          marketing_consent: boolean | null
        }
        Insert: {
          id?: string
          email?: string | null
          name?: string | null
          created_at?: string
          updated_at?: string
          phone?: string | null
          marketing_consent?: boolean | null
        }
        Update: {
          id?: string
          email?: string | null
          name?: string | null
          created_at?: string
          updated_at?: string
          phone?: string | null
          marketing_consent?: boolean | null
        }
      }
    }
  }
}
