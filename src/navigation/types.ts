import { SCREEN_NAMES } from '../constants/screens';
import { Challenge } from '../types';

export type RootStackParamList = {
  [SCREEN_NAMES.WELCOME]: undefined;
  [SCREEN_NAMES.ONBOARDING]: undefined;
  [SCREEN_NAMES.AUTH]: undefined;
  [SCREEN_NAMES.PLAY_CHALLENGE]: undefined;
  [SCREEN_NAMES.CREATE_CHALLENGE]: undefined;
  [SCREEN_NAMES.DASHBOARD]: undefined;
};

export type WelcomeStackParamList = {
  [SCREEN_NAMES.WELCOME]: undefined;
  [SCREEN_NAMES.ONBOARDING]: undefined;
};

export type AuthStackParamList = {
  [SCREEN_NAMES._AUTH.SIGN_IN]: undefined;
  [SCREEN_NAMES._AUTH.SIGN_UP]: undefined;
};

export type ChallengeStackParamList = {
  [SCREEN_NAMES._PLAY_CHALLENGE.HOME]: { challengeId?: string } | undefined;
  [SCREEN_NAMES._PLAY_CHALLENGE.ENTER_WEIGHT]: undefined;
  [SCREEN_NAMES._PLAY_CHALLENGE.PROFILE]: undefined;
  [SCREEN_NAMES._PLAY_CHALLENGE.GROUP_CHAT]: undefined;
  [SCREEN_NAMES._PLAY_CHALLENGE.LEADERBOARD]: undefined;
  [SCREEN_NAMES._PLAY_CHALLENGE.MANAGE]: undefined;
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

export type DashboardStackParamList = {
  [SCREEN_NAMES._DASHBOARD.ACTIVE_CHALLENGE]: undefined;
  [SCREEN_NAMES._DASHBOARD.ARCHIVED_CHALLENGE]: undefined;
  [SCREEN_NAMES._DASHBOARD.ENTER_CODE]: undefined;
  [SCREEN_NAMES._DASHBOARD.JOIN_CHALLENGE]: { challenge: any };
  [SCREEN_NAMES._DASHBOARD.PROFILE]: undefined;
};
