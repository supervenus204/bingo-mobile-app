import { apiFetch } from '../utils';

export const fetchParticipants = async (challengeId: string) => {
  const data = await apiFetch(`/api/challenge/${challengeId}/participant`, 'GET', {});
  return data;
};

export const inviteParticipants = async (challengeId: string, emails: string[]) => {
  const data = await apiFetch(`/api/challenge/${challengeId}/participant`, 'POST', {
    emails,
  });
  return data;
};

export const removeParticipant = async (challengeId: string, participantId: string) => {
  const data = await apiFetch(`/api/challenge/${challengeId}/participant/${participantId}`, 'DELETE', {});
  return data;
};
