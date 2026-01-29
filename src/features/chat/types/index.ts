export interface ChatSession {
  id: string;
  visitor_name: string;
  created_at: string;
  is_active: boolean;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  sender_type: "visitor" | "owner";
  message: string;
  created_at: string;
}

export interface CreateSessionInput {
  visitor_name: string;
}

export interface SendMessageInput {
  session_id: string;
  sender_type: "visitor" | "owner";
  message: string;
}
