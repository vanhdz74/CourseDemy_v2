// --- Interface định nghĩa user lấy từ payload token ---
export interface User {
  id?: string;
  username?: string;
  email: string;
  avatar_url?: string;
  role?: string;
}

export interface UserProfile {
  username: string;
  email: string;
  phone_number?: string;
  avatar_url?: string;
}
