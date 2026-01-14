import {
  DataSnapshot,
  getDatabase,
  onChildAdded,
  onValue,
  orderByChild,
  query,
  Query,
  ref,
  set,
  startAt,
} from '@react-native-firebase/database';
import { ChatMessage } from '../types/chat.type';

type MessageListener = (message: ChatMessage) => void;

const MESSAGES_PATH = 'challenges';

export const subscribeToChallengeMessages = (
  challengeId: string,
  onMessage: MessageListener
): (() => void) => {
  const db = getDatabase();
  const messagesRef = ref(db, `${MESSAGES_PATH}/${challengeId}/messages`);

  const unsubscribe = onChildAdded(messagesRef, (snapshot: DataSnapshot) => {
    if (snapshot.exists()) {
      const messageData = snapshot.val();
      onMessage(messageData);
    }
  });

  return unsubscribe;
};

export const subscribeToNewMessages = (
  challengeId: string,
  onNewMessage: (messageId: string) => void
): (() => void) => {
  const db = getDatabase();
  const messagesRef = ref(db, `${MESSAGES_PATH}/${challengeId}/messages`);

  const unsubscribe = onChildAdded(messagesRef, (snapshot: DataSnapshot) => {
    if (snapshot.exists()) {
      const messageId = snapshot.key;
      if (messageId) {
        onNewMessage(messageId);
      }
    }
  });

  return unsubscribe;
};

export const writeMessageNotification = async (
  challengeId: string,
  messageId: string,
  messageData: {
    id: string;
    challenge_id: string;
    sent_by: string;
    sent_time: string;
  }
): Promise<void> => {
  try {
    const db = getDatabase();
    const messagesRef = ref(
      db,
      `${MESSAGES_PATH}/${challengeId}/messages/${messageId}`
    );
    await set(messagesRef, {
      ...messageData,
      timestamp: Date.now(),
    });
  } catch (error) {
    throw new Error(
      `Failed to write message notification to Firebase: ${error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
};

export const getUnreadMessageCount = (
  challengeId: string,
  lastSeenTimestamp: number | null,
  userId: string,
  onCountUpdate: (count: number) => void
): (() => void) => {
  const db = getDatabase();
  const messagesRef = ref(db, `${MESSAGES_PATH}/${challengeId}/messages`);

  let queryRef: ReturnType<typeof ref> | Query;

  // If we have a last seen timestamp, filter messages after that time
  if (lastSeenTimestamp !== null) {
    queryRef = query(messagesRef, orderByChild('timestamp'), startAt(lastSeenTimestamp + 1));
  } else {
    // If no last seen time, get all messages
    queryRef = query(messagesRef, orderByChild('timestamp'));
  }

  const unsubscribe = onValue(queryRef, (snapshot: DataSnapshot) => {
    if (!snapshot.exists()) {
      onCountUpdate(0);
      return;
    }

    const messages = snapshot.val();
    let unreadCount = 0;

    // Count messages that are not sent by current user
    if (messages && typeof messages === 'object') {
      Object.values(messages).forEach((message: any) => {
        if (message && message.sent_by && message.sent_by !== userId) {
          // If lastSeenTimestamp is null, count all messages
          // Otherwise, timestamp should already be filtered by the query
          if (lastSeenTimestamp === null || (message.timestamp && message.timestamp > lastSeenTimestamp)) {
            unreadCount++;
          }
        }
      });
    }

    onCountUpdate(unreadCount);
  }, (error) => {
    console.error('Error fetching unread message count:', error);
    onCountUpdate(0);
  });

  return unsubscribe;
};

export const subscribeToChallengeUpdate = (
  challengeId: string,
  onUpdate: (updateData: { timestamp?: number; updated_at?: string; challenge_id?: string }) => void
): (() => void) => {
  const db = getDatabase();
  const updateRef = ref(db, `${MESSAGES_PATH}/${challengeId}/update`);

  const unsubscribe = onValue(updateRef, (snapshot: DataSnapshot) => {
    if (snapshot.exists()) {
      const updateData = snapshot.val();
      onUpdate(updateData || {});
    }
  }, (error) => {
    // Continue even if there's an error
  });

  return unsubscribe;
};

