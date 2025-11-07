import { Challenge } from '.';
import { SCREEN_NAMES } from '../constants/screens';

export type RootStackParamList = {
  [SCREEN_NAMES.WELCOME]: undefined;
  [SCREEN_NAMES.AUTH]: undefined;
  [SCREEN_NAMES.DASHBOARD]: undefined;
  [SCREEN_NAMES.CREATE_CHALLENGE]: undefined;
  [SCREEN_NAMES.JOIN_CHALLENGE]: undefined;
  [SCREEN_NAMES.PLAY_CHALLENGE]: undefined;
};

export type AuthStackParamList = {
  [SCREEN_NAMES._AUTH.SIGN_IN]: undefined;
  [SCREEN_NAMES._AUTH.SIGN_UP]: undefined;
  [SCREEN_NAMES._AUTH.VERIFY_CODE]: {
    email: string;
    type: string;
    password?: string;
  };
  [SCREEN_NAMES._AUTH.FORGOT_PASSWORD]: undefined;
};

export type DashboardStackParamList = {
  [SCREEN_NAMES._DASHBOARD.CHALLENGES_LIST]: undefined;
  [SCREEN_NAMES._DASHBOARD.PROFILE]: undefined;
};

export type CreateChallengeStackParamList = {
  [SCREEN_NAMES._CREATE_CHALLENGE.CHOOSE_PLAN]: undefined;
  [SCREEN_NAMES._CREATE_CHALLENGE.DEFINE_CHALLENGE]: undefined;
  [SCREEN_NAMES._CREATE_CHALLENGE.CARD_SETUP]: undefined;
  [SCREEN_NAMES._CREATE_CHALLENGE.INVITE_PARTICIPANTS]: undefined;
  [SCREEN_NAMES._CREATE_CHALLENGE.PAY_CHALLENGE]: {
    challenge: Challenge;
  };
};

export type JoinChallengeStackParamList = {
  [SCREEN_NAMES._JOIN_CHALLENGE.INVITE_CODE]: undefined;
  [SCREEN_NAMES._JOIN_CHALLENGE.JOIN]: { challenge: Challenge };
  [SCREEN_NAMES._JOIN_CHALLENGE.SCAN_QR_CODE]: undefined;
};

export type ChallengeStackParamList = {
  [SCREEN_NAMES._PLAY_CHALLENGE.BINGO]: { challengeId?: string } | undefined;
  [SCREEN_NAMES._PLAY_CHALLENGE.CHAT]: undefined;
  [SCREEN_NAMES._PLAY_CHALLENGE.LEADERBOARD]: undefined;
  [SCREEN_NAMES._PLAY_CHALLENGE.PARTICIPANT_MANAGEMENT]: undefined;
  [SCREEN_NAMES._PLAY_CHALLENGE.SETTINGS]: undefined;
  [SCREEN_NAMES._PLAY_CHALLENGE.WEIGH_IN]: undefined;
};
