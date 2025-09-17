# Health Bingo App

A group wellness app that transforms habit-building into a fun and motivating game. Each challenge is structured around a Bingo board of health-related tasks, where players check off completed items weekly, weigh in, and earn points in a supportive, competitive group setting.

## 🎯 Product Overview

Health Bingo operates on a pay-per-challenge model with no subscriptions. Players join for free, while organizers pay once per challenge, choosing from flexible pricing tiers based on group size, challenge length, and premium features.

## 👥 User Roles

### Organizer
- Creates challenges and can choose to participate as a Player or just manage
- Can toggle participation on/off after creation
- Has full control over challenge settings and management

### Player
- Joins challenges via invite link or code
- Cannot manage or modify the challenge
- Focuses on completing tasks and earning points

### Role Flexibility
- Roles are scoped per challenge
- A user can be an Organizer in one challenge and a Player in another
- Dashboard clearly separates:
  - **Joined** – Challenges where user is a Player
  - **Hosted** – Challenges where user is an Organizer

## 🎮 Challenge Structure

### Bingo Cards
- Weekly Bingo cards (4x6, 4x5, or 4x4 grid)
- Tasks include categories like hydration, exercise, healthy eating, sleep, and lifestyle goals
- Players manually log daily task completions by marking off squares
- Premium players can track weekly weight and access exclusive card templates

### Challenge Categories

#### Weight Loss (Premium)
- Targeted actions to support fat loss, boost metabolism, and build healthy consistency
- Includes weekly weight tracking feature
- Premium category requiring Pro plan

#### Mental & Emotional Well-being
- Supports stress relief, emotional balance, focus, and restoration
- Tasks include gratitude journaling, mindfulness, random acts of kindness, digital detoxes, and sleep hygiene

#### Physical Health & Movement
- Designed to reduce sedentary behavior and increase energy
- Focuses on steps, stretching, strength, and playful movement

#### Eat Well, Feel Well
- Supports energy, digestion, and focus through improved food habits
- Tasks include eating more whole foods, trying a no-sugar day, adding fermented foods, staying hydrated

## 📅 Weekly Cycle

| Day | Action |
|-----|--------|
| Sunday | New Bingo cards auto-assigned |
| Monday | Push reminder to log weigh-in (for Weight Loss) |
| Weekdays | Players mark off tasks; system tracks progress |
| Friday | Motivation nudges sent to inactive users |
| Saturday | Points awarded, leaderboard updated, Wild Cards sent |

## 🏆 Points & Rewards

| Player Action | Points Earned |
|---------------|---------------|
| First to complete Bingo | +2 |
| Completed entire card | +1 |
| Logged weight loss | +1 |
| Weekly top % weight loser | +2 |
| Top % weight loser overall | +3 |

### Wild Cards
- Awarded to: weekly top loser (Weight Loss) & first to complete Bingo
- Can be used to mark off one missed task

## 💰 Pricing & Monetization

One-Time Payment Per Challenge (No Subscription)

| Plan | Price | Challenges | Custom Cards | Max Members | Duration Limit |
|------|-------|------------|--------------|-------------|----------------|
| Free | $0 | 1 | No | 3 | Up to 2 weeks |
| Premium | $31.99 | 1 | Yes | 10 | 2–12 Weeks |
| Pro | $49.90 | 1 | Yes | 20 | Up to 16 Weeks |
| Pro Lifetime | $89.99 | Unlimited | Yes | Unlimited | Unlimited |

**Note:** A Free challenge cannot exceed 3 players or 2 weeks. Upgrade required to expand.

## 🔒 Archived Challenge Access

- When a challenge ends, it becomes locked to Players
- Organizers can always access any challenges they created
- Players can unlock access to past challenges for $1.99

**What's unlocked:**
- Completed Bingo cards
- Leaderboard
- Weigh-in history

## 🚀 User Flows

### A. Creating a Challenge (Organizer)
1. Tap "Create Challenge"
2. Select plan (Free / Premium / Pro)
3. Choose: "Participate as Player?" Yes / No
4. Complete one-time payment (if required)
5. Select challenge duration
6. Select challenge category
7. Choose pre-built Bingo template or customize (if Premium/Pro)
8. Share invite code or link

### B. Joining a Challenge (Player)
1. Open invite link or enter code
2. Join as Player (no payment required)
3. Access dashboard, start participating

### C. After Completion
1. Archived challenge is locked to Players
2. Option to unlock for $1.99

## 🎨 Design & UX

### Role Management & Navigation
- Dashboard displays two clear sections:
  - **Joined** – for challenges where the user is a Player
  - **Hosted** – for challenges where the user is an Organizer
- Tapping "Create Challenge" always starts a new Organizer flow
- Tapping "Join Challenge" opens the Player flow

### Upgrade Prompting & Feature Unlocks

**Organizer Triggers:**
- Selecting more than 3 members on Free Plan → prompt upgrade
- Selecting Weight Loss category → prompt Pro upgrade
- Clicking "Customize Card" → prompt Premium/Pro upgrade with preview
- Extending duration beyond Free limit → upgrade prompt

**Player Triggers:**
- Clicking "Track Weight" on a non-Pro challenge → show Pro feature message
- Clicking "Archived Challenge" → unlock prompt with $1.99
- After completing first challenge → prompt to host one with optional discount

### Feature Visibility & Locking
- Use blurred overlays or lock icons to show unavailable features
- Show weight tracking as a grayed-out feature with tooltip

## 🛠️ Technical Stack

- **Frontend:** React Native
- **State Management:** Zustand
- **Remote State Management:** React Query (TanStack Query)
- **Navigation:** React Navigation
- **Type Safety:** TypeScript

## 📱 Getting Started

### Prerequisites
- Node.js >= 18
- React Native development environment
- Android Studio / Xcode

### Installation
```bash
# Install dependencies
yarn install

# iOS
cd ios && pod install && cd ..
yarn ios

# Android
yarn android
```

## 🧪 Testing

```bash
yarn test
```

## 📊 Analytics & Event Tracking

- Track conversion from prompt views to upgrade
- Track engagement drop-off points (e.g., days of inactivity)
- Track popular challenge categories and feature usage

## 🎁 Optional Enhancements

### Gamified Upsell
- Offer milestone-based rewards or discount coupons (e.g., after completing first challenge)

## 📄 License

This project is proprietary software. All rights reserved.

---

**Health Bingo App** - Transforming wellness into a game, one Bingo card at a time! 🎯✨
