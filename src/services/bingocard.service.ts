import { apiFetch } from '../utils';

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
  const response = await apiFetch(
    `/api/challenge/${challengeId}/bingo-task/${weekNumber}`,
    'POST',
    {
      default_cards: defaultCards,
      custom_cards: customCards,
    }
  );

  return response;
};
