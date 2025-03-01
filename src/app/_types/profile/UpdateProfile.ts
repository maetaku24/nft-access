export interface UpdateProfileRequest {
  name: string;
  walletAddress?: string;
  iconKey?: string;
}

export interface UpdateProfileResponse {
  id: number;
  message: string;
}
