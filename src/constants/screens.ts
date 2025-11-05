export const SCREEN_NAMES = {
  WELCOME: 'Welcome',
  AUTH: 'Auth',
  DASHBOARD: 'Dashboard',
  CREATE_CHALLENGE: 'CreateChallenge',
  PLAY_CHALLENGE: 'PlayChallenge',

  _AUTH: {
    SIGN_IN: 'SignIn',
    SIGN_UP: 'SignUp',
    PROFILE_SETUP: 'ProfileSetup',
  },
  _DASHBOARD: {
    ONGOING_CHALLENGE: 'OngoingChallenge',
    ARCHIVED_CHALLENGE: 'ArchivedChallenge',
    ENTER_CODE: 'EnterCode',
    JOIN_CHALLENGE: 'JoinChallenge',
    SCAN_QR_CODE: 'ScanQRCode',
    PROFILE: 'Profile',
  },
  _CREATE_CHALLENGE: {
    CHOOSE_PLAN: 'ChoosePlan',
    DEFINE_CHALLENGE: 'DefineChallenge',
    CARD_SETUP: 'CardSetup',
    INVITE_PARTICIPANTS: 'InviteParticipants',
    CHALLENGE_PUBLISHED: 'ChallengePublished',
  },
  _PLAY_CHALLENGE: {
    BINGO: 'Bingo',
    CHAT: 'Chat',
    LEADERBOARD: 'Leaderboard',
    PARTICIPANT_MANAGEMENT: 'ParticipantManagement',
    SETTINGS: 'Settings',
    WEIGH_IN: 'WeighIn',
  },
} as const;
