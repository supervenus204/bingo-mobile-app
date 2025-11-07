export const SCREEN_NAMES = {
  WELCOME: 'Welcome',
  AUTH: 'Auth',
  DASHBOARD: 'Dashboard',
  CREATE_CHALLENGE: 'CreateChallenge',
  JOIN_CHALLENGE: 'JoinChallenge',
  PLAY_CHALLENGE: 'PlayChallenge',

  _AUTH: {
    SIGN_IN: 'SignIn',
    SIGN_UP: 'SignUp',
    VERIFY_CODE: 'VerifyCode',
    FORGOT_PASSWORD: 'ForgotPassword',
  },
  _DASHBOARD: {
    CHALLENGES_LIST: 'ChallengesList',
    PROFILE: 'Profile',
  },
  _CREATE_CHALLENGE: {
    CHOOSE_PLAN: 'ChoosePlan',
    DEFINE_CHALLENGE: 'DefineChallenge',
    CARD_SETUP: 'CardSetup',
    INVITE_PARTICIPANTS: 'InviteParticipants',
    PAY_CHALLENGE: 'PayChallenge',
  },
  _JOIN_CHALLENGE: {
    INVITE_CODE: 'InviteCode',
    JOIN: 'Join',
    SCAN_QR_CODE: 'ScanQRCode',
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
