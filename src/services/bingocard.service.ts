import { API_BASE_URL } from '../constants/config';
import { useAuthStore } from '../store/auth.store';
import { apiFetch, parseJsonSafe } from '../utils';

export const getBingoTasks = async (
  challengeId: string,
  weekNumber: number
) => {
  const data = await apiFetch(
    `/api/challenge/${challengeId}/bingo-task/${weekNumber}`,
    'GET',
    {}
  );

  return data;
};

export const updateBingoTasks = async (
  challengeId: string,
  weekNumber: number,
  defaultCards: string[],
  customCards: any[]
) => {
  const token = useAuthStore.getState().token;

  const response = await fetch(
    `${API_BASE_URL}/api/challenge/${challengeId}/bingo-task/${weekNumber}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        default_cards: defaultCards,
        custom_cards: customCards,
      }),
    }
  );

  if (!response.ok) {
    const body = await parseJsonSafe(response);
    const message =
      (body && (body.message as string)) || 'Failed to update bingocard';
    throw new Error(message);
  }

  const { data } = await parseJsonSafe(response);

  return data;
};
