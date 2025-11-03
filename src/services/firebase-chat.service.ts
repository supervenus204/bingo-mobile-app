import database, {
  FirebaseDatabaseTypes,
} from '@react-native-firebase/database';
import { ChatMessage } from '../types/chat.type';

type MessageListener = (message: ChatMessage) => void;

const MESSAGES_PATH = 'challenges';

export const subscribeToChallengeMessages = (
  challengeId: string,
  onMessage: MessageListener
): (() => void) => {
  const messagesRef = database().ref(`${MESSAGES_PATH}/${challengeId}/messages`);

  const handleChildAdded = messagesRef.on(
    'child_added',
    (snapshot: FirebaseDatabaseTypes.DataSnapshot) => {
      if (snapshot.exists()) {
        const messageData = snapshot.val();
        onMessage(messageData);
      }
    }
  );

  return () => {
    messagesRef.off('child_added', handleChildAdded);
  };
};

export const subscribeToNewMessages = (
  challengeId: string,
  onNewMessage: (messageId: string) => void
): (() => void) => {
  const messagesRef = database().ref(`${MESSAGES_PATH}/${challengeId}/messages`);

  const handleChildAdded = messagesRef.on(
    'child_added',
    (snapshot: FirebaseDatabaseTypes.DataSnapshot) => {
      if (snapshot.exists()) {
        const messageId = snapshot.key;
        if (messageId) {
          onNewMessage(messageId);
        }
      }
    }
  );

  return () => {
    messagesRef.off('child_added', handleChildAdded);
  };
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
    const messagesRef = database().ref(
      `${MESSAGES_PATH}/${challengeId}/messages/${messageId}`
    );
    await messagesRef.set({
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

