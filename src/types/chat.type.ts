export interface ChatSender {
  id: string;
  email?: string;
  first_name?: string | null;
  last_name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  display_name?: string | null;
  image?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sent_by: string;
  challenge_id: string;
  sent_time?: string;
  createdAt?: string;
  updatedAt?: string;
  sender?: ChatSender;
}

export type GetMessagesParams = {
  limit?: number;
  page?: number;
};
