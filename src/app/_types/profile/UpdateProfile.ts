export interface UpdateProfileRequest {
  userId: string;
  name: string;
  walletAddress?: string;
  iconKey?: string;
}

export interface UpdateProfileResponse {
  id: number;
  message: string;
}
