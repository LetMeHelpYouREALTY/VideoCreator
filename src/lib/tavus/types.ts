export type TavusPipelineMode = 'full' | 'echo'

export type CreatePalRequest = {
  pal_name: string
  system_prompt?: string
  pipeline_mode: TavusPipelineMode
  context?: string
  default_face_id: string
  layers?: {
    perception?: {
      perception_model: 'raven-1'
    }
    conversational_flow?: {
      turn_detection_model: 'sparrow-1'
      turn_taking_patience: 'high' | 'medium' | 'low'
      pal_interruptibility: 'high' | 'medium' | 'low'
    }
    transport?: {
      transport_type: 'livekit'
    }
  }
}

export type CreatePalResponse = {
  pal_id: string
  pal_name: string
}

export type CreateConversationRequest = {
  face_id?: string
  pal_id?: string
  conversation_name?: string
  conversational_context?: string
  custom_greeting?: string
  test_mode?: boolean
  properties?: {
    max_call_duration?: number
    participant_left_timeout?: number
    participant_absent_timeout?: number
    language?: string
  }
}

export type ConversationStatus = 'active' | 'ended' | 'error'

export type CreateConversationResponse = {
  conversation_id: string
  conversation_name: string
  conversation_url: string
  status: ConversationStatus
  callback_url?: string
  created_at: string
}

export type TavusApiError = {
  error: string
  message?: string
}

export type StudioScreen = 'welcome' | 'hairCheck' | 'call'
