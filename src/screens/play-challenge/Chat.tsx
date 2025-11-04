import React, {
  useCallback,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ProfileIcon, UserIntroductionModal } from '../../components/common';
import { useMessages, useToast } from '../../hooks';
import { useAuthStore, useChallengesStore } from '../../store';
import { COLORS, FONTS } from '../../theme';
import { ChatSender } from '../../types/chat.type';

export const ChatScreen: React.FC = () => {
  const { selectedChallenge } = useChallengesStore();
  const { user } = useAuthStore();
  const { showToast } = useToast();
  const challengeId = selectedChallenge?.id;
  const { messages, loading, hasMore, fetchMore, send, sending } = useMessages({
    challengeId,
    pageSize: 20,
    auto: true,
  });
  const [text, setText] = useState('');
  const [selectedUser, setSelectedUser] = useState<ChatSender | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const listRef = useRef<FlatList>(null);

  const myId = user?.id;

  const keyExtractor = useCallback((item: any) => item.id, []);

  const renderItem = useCallback(
    ({ item }: any) => {
      const isMe = item.sent_by === myId;
      const sender = item.sender;

      const initials = (sender?.first_name?.[0] || '') + (sender?.last_name?.[0] || '');
      const image = sender?.image ?? null;

      const time = item.sent_time || item.createdAt;
      const dateTimeText = time
        ? new Date(time).toLocaleString([], {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })
        : '';

      const handleUserIconPress = () => {
        if (!isMe && sender) {
          setSelectedUser(sender);
          setIsModalVisible(true);
        }
      };

      return (
        <View style={styles.messageContainer}>
          <View
            style={[styles.messageRow, isMe ? styles.rowMe : styles.rowOther]}
          >
            {!isMe && (
              <TouchableOpacity
                style={styles.avatarContainer}
                onPress={handleUserIconPress}
                activeOpacity={0.7}
              >
                <ProfileIcon
                  image={image}
                  initialsText={initials || 'Player'}
                  size={40}
                />
              </TouchableOpacity>
            )}
            <View
              style={[
                styles.bubble,
                isMe ? styles.bubbleMe : styles.bubbleOther,
              ]}
            >
              <Text style={[styles.messageText, isMe && styles.messageTextMe]}>
                {item.content}
              </Text>
            </View>
            {isMe && (
              <View style={styles.avatarContainer}>
                <ProfileIcon
                  image={image}
                  initialsText={initials || 'Player'}
                  size={40}
                />
              </View>
            )}
          </View>
          <View
            style={[
              styles.timeContainer,
              isMe ? styles.timeContainerMe : styles.timeContainerOther,
            ]}
          >
            <Text style={[styles.timeText, isMe && styles.timeTextMe]}>
              {dateTimeText}
            </Text>
          </View>
        </View>
      );
    },
    [myId, user]
  );

  const onEndReached = useCallback(() => {
    if (hasMore && !loading) fetchMore();
  }, [hasMore, loading, fetchMore]);

  const canSend = useMemo(
    () => text.trim().length > 0 && !sending,
    [text, sending]
  );

  const handleSend = useCallback(async () => {
    if (!canSend || !challengeId) return;
    const toSend = text.trim();
    setText('');

    try {
      await send(toSend);
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    } catch (error) {
      setText(toSend);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to send message. Please try again.';
      showToast(errorMessage, 'error');
    }
  }, [canSend, challengeId, text, send, showToast]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <View style={styles.listContainer}>
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          inverted
          onEndReached={onEndReached}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            loading ? (
              <ActivityIndicator
                color={COLORS.green.forest}
                style={{ paddingVertical: 12 }}
              />
            ) : null
          }
          contentContainerStyle={styles.listContent}
        />
      </View>
      <View style={styles.inputBar}>
        <TextInput
          style={styles.textInput}
          placeholder="Type a message"
          placeholderTextColor={COLORS.gray.mediumDark}
          value={text}
          onChangeText={setText}
          multiline
        />
        <TouchableOpacity
          onPress={handleSend}
          activeOpacity={0.8}
          disabled={!canSend}
          style={[styles.sendButton, !canSend && styles.sendDisabled]}
        >
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
      <UserIntroductionModal
        visible={isModalVisible}
        user={selectedUser}
        onClose={() => {
          setIsModalVisible(false);
          setSelectedUser(null);
        }}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    marginBottom: 16,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  rowMe: {
    justifyContent: 'flex-end',
  },
  rowOther: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    marginHorizontal: 8,
  },
  bubble: {
    maxWidth: '75%',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bubbleMe: {
    backgroundColor: COLORS.green.forest,
    borderBottomRightRadius: 6,
  },
  bubbleOther: {
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.gray.lightMedium,
  },
  senderName: {
    fontSize: 13,
    color: COLORS.blue.oxford,
    fontFamily: FONTS.family.poppinsSemiBold,
    marginBottom: 4,
    fontWeight: '600',
  },
  messageText: {
    fontSize: 15,
    color: COLORS.blue.oxford,
    fontFamily: FONTS.family.poppinsRegular,
    lineHeight: 20,
  },
  messageTextMe: {
    color: COLORS.white,
  },
  timeContainer: {
    paddingHorizontal: 16,
    marginTop: 2,
  },
  timeContainerMe: {
    alignItems: 'flex-end',
    paddingRight: 56, // Account for avatar space
  },
  timeContainerOther: {
    alignItems: 'flex-start',
    paddingLeft: 56, // Account for avatar space
  },
  timeText: {
    fontSize: 10,
    color: COLORS.gray.mediumDark,
    fontFamily: FONTS.family.poppinsRegular,
    opacity: 0.7,
  },
  timeTextMe: {
    color: COLORS.gray.mediumDark,
    opacity: 0.7,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray.lightMedium,
    gap: 12,
  },
  textInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 22,
    backgroundColor: COLORS.gray.veryLight,
    color: COLORS.blue.oxford,
    fontSize: 16,
    fontFamily: FONTS.family.poppinsRegular,
    borderWidth: 1,
    borderColor: COLORS.gray.lightMedium,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.green.forest,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.green.forest,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  sendDisabled: {
    opacity: 0.5,
    shadowOpacity: 0.1,
  },
  sendText: {
    color: COLORS.white,
    fontFamily: FONTS.family.poppinsSemiBold,
    fontSize: 14,
    fontWeight: '600',
  },
});
