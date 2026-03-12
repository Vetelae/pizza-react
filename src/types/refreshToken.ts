import type { ApplicationUser } from './applicationUser'

export interface RefreshToken {
    id: string;
    token: string;
    userId: string;
    createdOnUtc: string;
    expiresOnUtc: string;
    isRevoked: boolean;
    revokedOnUtc: string | null;
    user: ApplicationUser;
}