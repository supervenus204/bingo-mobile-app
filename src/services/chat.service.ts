import { ChatMessage, GetMessagesParams } from '../types/chat.type';
import { apiFetch } from '../utils';

export const getMessages = async (
  challengeId: string,
  params?: GetMessagesParams
): Promise<ChatMessage[]> => {
  const query = new URLSearchParams();
  if (params?.limit) query.append('limit', String(params.limit));
  if (params?.page) query.append('page', String(params.page));
  const qs = query.toString();
  const url = `/api/challenge/${challengeId}/message${qs ? `?${qs}` : ''}`;
  const data = await apiFetch(url, 'GET', {});
  return data as ChatMessage[];
};

export const addMessage = async (
  challengeId: string,
  content: string
): Promise<ChatMessage> => {
  const url = `/api/challenge/${challengeId}/message`;
  const data = await apiFetch(url, 'POST', { content });
  return data as ChatMessage;
};
