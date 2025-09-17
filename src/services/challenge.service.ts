import { API_BASE_URL } from '../constants/config';
import { useAuthStore } from '../store/auth.store';
import { apiFetch, parseJsonSafe } from '../utils';

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
  const token = useAuthStore.getState().token;

  const response = await fetch(`${API_BASE_URL}/api/challenge/join/${code}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const body = await parseJsonSafe(response);
    const message =
      (body && (body.message as string)) || 'Failed to join challenge';
    throw new Error(message);
  }

  const { data } = await parseJsonSafe(response);
  return data;
};

export const joinChallenge = async (invitationCode: string) => {
  const token = useAuthStore.getState().token;

  const response = await fetch(`${API_BASE_URL}/api/challenge/join`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ invitation_code: invitationCode }),
  });

  if (!response.ok) {
    const body = await parseJsonSafe(response);
    const message =
      (body && (body.message as string)) || 'Failed to join challenge';
    throw new Error(message);
  }

  const { data } = await parseJsonSafe(response);
  return data;
};

export const getAllBingoCards = async (categoryId: string) => {
  const token = useAuthStore.getState().token;

  const response = await fetch(
    `${API_BASE_URL}/api/bingo-card?category_id=${categoryId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const body = await parseJsonSafe(response);
    const message =
      (body && (body.message as string)) || 'Failed to get bingo cards';
    throw new Error(message);
  }

  const { data } = await parseJsonSafe(response);
  return data;
};
