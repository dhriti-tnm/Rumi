export interface Journal {
  id: number;
  user_id: number;
  title: string;
  content: string;
  mood?: string;
  created_at: string;
  updated_at?: string;
}

export interface JournalCreateRequest {
  title: string;
  content: string;
  mood?: string;
}

export interface JournalUpdateRequest {
  title?: string;
  content?: string;
  mood?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error: string[];
}
