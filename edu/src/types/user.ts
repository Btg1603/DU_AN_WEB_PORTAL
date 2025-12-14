export type UserRole = "user" | "admin";

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  password?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phone?: string;
  studentCode?: string;
  birthday?: string;
  avatar?: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface UpdateProfilePayload extends Partial<UserProfile> {
  password?: string;
}

