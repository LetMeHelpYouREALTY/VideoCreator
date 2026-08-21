export type ConversationStatus = "active" | "ended" | "error";

export type TavusConversation = {
  conversation_id: string;
  conversation_name?: string;
  conversation_url: string;
  status: ConversationStatus;
  callback_url?: string;
  created_at?: string;
  pal_id?: string | null;
  persona_id?: string | null;
  face_id?: string | null;
  replica_id?: string | null;
};

export type CreateConversationInput = {
  pal_id?: string;
  face_id?: string;
  conversation_name?: string;
  conversational_context?: string;
  custom_greeting?: string;
  test_mode?: boolean;
};

export type VideoStatus = "queued" | "generating" | "ready" | "deleted" | "error";

export type TavusVideo = {
  video_id: string;
  video_name?: string;
  status: VideoStatus;
  hosted_url?: string | null;
  download_url?: string | null;
  stream_url?: string | null;
  replica_id?: string;
  created_at?: string;
  generation_progress?: string;
  status_details?: string;
};

export type CreateVideoInput = {
  replica_id: string;
  script: string;
  video_name?: string;
};

export type TavusFace = {
  face_id: string;
  face_name?: string;
  status?: string;
  face_type?: string;
  thumbnail_video_url?: string;
};

export type TavusPal = {
  pal_id: string;
  pal_name?: string;
  default_face_id?: string | null;
};
