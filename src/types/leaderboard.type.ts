import { User } from '.';

export interface LeaderboardEntry {
  id: string;
  points: number;
  user: User;
  loss?: number;
  awards?: string[];
}
