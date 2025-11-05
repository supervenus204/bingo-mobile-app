import { Challenge } from '.';
import { SCREEN_NAMES } from '../constants/screens';

export type RootStackParamList = {
  [SCREEN_NAMES.WELCOME]: undefined;
  [SCREEN_NAMES.AUTH]: undefined;
  [SCREEN_NAMES.DASHBOARD]: undefined;
  [SCREEN_NAMES.CREATE_CHALLENGE]: undefined;
  [SCREEN_NAMES.PLAY_CHALLENGE]: undefined;
};

export type AuthStackParamList = {
  [SCREEN_NAMES._AUTH.SIGN_IN]: undefined;
  [SCREEN_NAMES._AUTH.SIGN_UP]: undefined;
  [SCREEN_NAMES._AUTH.PROFILE_SETUP]: undefined;
};

export type DashboardStackParamList = {
  [SCREEN_NAMES._DASHBOARD.ONGOING_CHALLENGE]: undefined;
  [SCREEN_NAMES._DASHBOARD.ARCHIVED_CHALLENGE]: undefined;
  [SCREEN_NAMES._DASHBOARD.ENTER_CODE]: undefined;
  [SCREEN_NAMES._DASHBOARD.JOIN_CHALLENGE]: { challenge: any };
  [SCREEN_NAMES._DASHBOARD.SCAN_QR_CODE]: undefined;
  [SCREEN_NAMES._DASHBOARD.PROFILE]: undefined;
};

export type CreateChallengeStackParamList = {
  [SCREEN_NAMES._CREATE_CHALLENGE.CHOOSE_PLAN]: undefined;
  [SCREEN_NAMES._CREATE_CHALLENGE.DEFINE_CHALLENGE]: undefined;
  [SCREEN_NAMES._CREATE_CHALLENGE.CARD_SETUP]: undefined;
  [SCREEN_NAMES._CREATE_CHALLENGE.INVITE_PARTICIPANTS]: undefined;
  [SCREEN_NAMES._CREATE_CHALLENGE.CHALLENGE_PUBLISHED]: {
    challenge: Challenge;
  };
};

export type ChallengeStackParamList = {
  [SCREEN_NAMES._PLAY_CHALLENGE.BINGO]: { challengeId?: string } | undefined;
  [SCREEN_NAMES._PLAY_CHALLENGE.CHAT]: undefined;
  [SCREEN_NAMES._PLAY_CHALLENGE.LEADERBOARD]: undefined;
  [SCREEN_NAMES._PLAY_CHALLENGE.PARTICIPANT_MANAGEMENT]: undefined;
  [SCREEN_NAMES._PLAY_CHALLENGE.SETTINGS]: undefined;
  [SCREEN_NAMES._PLAY_CHALLENGE.WEIGH_IN]: undefined;
};
