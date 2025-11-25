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
  content: string,
  imageUri?: string
): Promise<ChatMessage> => {
  const url = `/api/challenge/${challengeId}/message`;

  if (imageUri) {
    const formData = new FormData();
    if (content) {
      formData.append('content', content);
    }
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'image.jpg',
    } as any);

    const data = await apiFetch(url, 'POST', formData, true);
    return data as ChatMessage;
  }

  const data = await apiFetch(url, 'POST', { content });
  return data as ChatMessage;
};
