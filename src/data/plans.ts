export const plans = {
  free: {
    id: 'free',
    title: 'Free Plan',
    price: 0,
    features: [
      'Up to 3 players, 2-week max',
      'Limited Bingo Card Size',
      'No custom challenges',
    ],
    maxweek: 2,
    maxParticipants: 3,
  },
  premium: {
    id: 'premium',
    title: 'Premium Plan',
    price: 12.99,
    features: ['Up to 10 players, 12-week max', 'Group chat', 'Custom cards'],
    maxweek: 12,
    maxParticipants: 10,
  },
  pro: {
    id: 'pro',
    title: 'Pro Plan',
    price: 24.99,
    features: [
      'Up to 20 players, 16-week max',
      'Group Chat',
      'Weighloss tracker',
    ],
    maxweek: 16,
    maxParticipants: 20,
  },
};
