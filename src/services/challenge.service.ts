import { API_BASE_URL } from '../constants/config';
import { useAuthStore } from '../store/auth.store';
import { apiFetch, parseJsonSafe } from '../utils';

export const getChallengeCategories = async () => {
  const data = await apiFetch('/api/challenge-category', 'GET', {});
  return data;
};

export const fetchAllChallenges = async () => {
  const data = await apiFetch('/api/challenge/me', 'GET', {});
  return data;
};

export const createChallenge = async (challenge: any) => {
  const token = useAuthStore.getState().token;

  const response = await fetch(`${API_BASE_URL}/api/challenge`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(challenge),
  });

  if (!response.ok) {
    const body = await parseJsonSafe(response);
    const message =
      (body && (body.message as string)) || 'Failed to create challenge';
    throw new Error(message);
  }

  const { data, message } = await parseJsonSafe(response);

  return { data, message };
};

export const getChallengeByCode = async (code: string) => {
  const response = await apiFetch(`/api/challenge/invitation/${code}`, 'GET', {});
  return response;
};

export const joinChallenge = async (invitationCode: string) => {
  const response = await apiFetch(`/api/challenge/invitation/join`, 'POST', { invitation_code: invitationCode });
  return response;
};

export const rejectChallenge = async (invitationCode: string) => {
  const response = await apiFetch(`/api/challenge/invitation/reject`, 'POST', { invitation_code: invitationCode });
  return response;
};

export const getAllBingoCards = async (categoryId: string) => {
  const response = await apiFetch(
    `/api/bingo-card?category_id=${categoryId}`,
    'GET',
    {}
  );

  return response;
};

export const updateChallenge = async (challengeId: string, updateData: any) => {
  const response = await apiFetch(`/api/challenge/${challengeId}`, 'PATCH', updateData);
  return response;
};
