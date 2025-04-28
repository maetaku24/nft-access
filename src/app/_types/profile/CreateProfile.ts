export interface CreateProfileRequest {
  supabaseUserId: string;
  userId: string;
  email: string;
}

export interface CreateProfileResponse {
  id: number;
  message: string;
}
