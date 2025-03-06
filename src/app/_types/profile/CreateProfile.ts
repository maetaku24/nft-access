export interface CreateProfileRequest {
  supabaseUserId: string;
  name: string;
  email: string;
}

export interface CreateProfileResponse {
  id: number;
  message: string;
}