// Gegenereerd via Supabase-MCP (generate_typescript_types). Niet handmatig aanpassen.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      chunks: {
        Row: {
          chunk_index: number
          content: string
          document_id: string
          embedding: string
          id: string
          user_id: string
        }
        Insert: {
          chunk_index: number
          content: string
          document_id: string
          embedding: string
          id?: string
          user_id: string
        }
        Update: {
          chunk_index?: number
          content?: string
          document_id?: string
          embedding?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chunks_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      clone_settings: {
        Row: {
          display_name: string | null
          chat_model: string
          embedding_model: string
          match_count: number
          system_prompt: string
          user_id: string
        }
        Insert: {
          display_name?: string | null
          chat_model?: string
          embedding_model?: string
          match_count?: number
          system_prompt?: string
          user_id: string
        }
        Update: {
          display_name?: string | null
          chat_model?: string
          embedding_model?: string
          match_count?: number
          system_prompt?: string
          user_id?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          status: string
          storage_bucket: string
          storage_path: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          status?: string
          storage_bucket?: string
          storage_path: string
          title: string
          user_id?: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          status?: string
          storage_bucket?: string
          storage_path?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      match_chunks: {
        Args: { match_count?: number; query_embedding: string }
        Returns: {
          content: string
          document_id: string
          id: string
          similarity: number
          title: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
