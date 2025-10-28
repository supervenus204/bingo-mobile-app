import { apiFetch } from '../utils';

export const createMeasure = async (
  challengeId: string,
  type: string,
  value: number
) => {
  const response = await apiFetch(
    `/api/challenge/${challengeId}/measure`,
    'POST',
    {
      type,
      value,
    }
  );
  return response;
};

export const getCurrentWeekMeasures = async (challengeId: string) => {
  const response = await apiFetch(
    `/api/challenge/${challengeId}/measure`,
    'GET',
    {}
  );
  return response;
};

export const getMeasureHistory = async (challengeId: string) => {
  const response = await apiFetch(
    `/api/challenge/${challengeId}/measure/history`,
    'GET',
    {}
  );
  return response;
};
