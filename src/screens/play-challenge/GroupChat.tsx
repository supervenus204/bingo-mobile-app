import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
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
import { Avatar } from '../../components/common';
import { Header } from '../../components/play-challenge/Header';
import { useMessages } from '../../hooks';
import { useAuthStore, useChallengesStore } from '../../store';
import { COLORS, FONTS } from '../../theme';
import { supabase } from '../../utils/supabase';

export const GroupChat: React.FC = () => {
  const { currentChallenge } = useChallengesStore();
  const { user } = useAuthStore();
  const challengeId = currentChallenge?.id;
  const { messages, loading, hasMore, fetchMore, send, sending } = useMessages({
    challengeId,
    pageSize: 20,
    auto: true,
  });
  const [text, setText] = useState('');
  const listRef = useRef<FlatList>(null);

  const myId = user?.id;

  // Set up real-time channel for this challenge
  useEffect(() => {
    if (!challengeId) return;

    const channelName = `chat-${challengeId}`;
    const channel = supabase.channel(channelName);

    // Listen for new messages from other users
    channel
      .on('broadcast', { event: 'new_message' }, payload => {
        const { message } = payload.payload;
        // Trigger a refresh of messages to get the latest from backend
        fetchMore();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [challengeId, fetchMore]);

  const keyExtractor = useCallback((item: any) => item.id, []);

  const renderItem = useCallback(
    ({ item }: any) => {
      const isMe = item.sent_by === myId;
      const sender = item.sender;

      const first = sender?.first_name ?? sender?.firstName ?? '';
      const last = sender?.last_name ?? sender?.lastName ?? '';
      const image = sender?.image ?? null;

      const time = item.sent_time || item.createdAt;
      const timeText = time
        ? new Date(time).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })
        : '';

      return (
        <View style={styles.messageContainer}>
          <View
            style={[styles.messageRow, isMe ? styles.rowMe : styles.rowOther]}
          >
            {!isMe && (
              <View style={styles.avatarContainer}>
                <Avatar
                  firstName={first}
                  lastName={last}
                  image={image}
                  size={40}
                />
              </View>
            )}
            <View
              style={[
                styles.bubble,
                isMe ? styles.bubbleMe : styles.bubbleOther,
              ]}
            >
              {!isMe && (
                <Text style={styles.senderName} numberOfLines={1}>
                  {first || last ? `${first} ${last}`.trim() : 'Member'}
                </Text>
              )}
              <Text style={[styles.messageText, isMe && styles.messageTextMe]}>
                {item.content}
              </Text>
            </View>
            {isMe && (
              <View style={styles.avatarContainer}>
                <Avatar
                  firstName={first}
                  lastName={last}
                  image={image}
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
              {timeText}
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
      // Send message to backend first
      await send(toSend);

      // After successful send, broadcast to other users
      const channelName = `chat-${challengeId}`;
      const channel = supabase.channel(channelName);
      channel.send({
        type: 'broadcast',
        event: 'new_message',
        payload: {
          message: toSend,
          userId: myId,
          challengeId: challengeId,
        },
      });

      // Scroll to top to show new message
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    } catch (error) {
      // Handle error - maybe show toast or restore text
      console.error('Failed to send message:', error);
    }
  }, [canSend, challengeId, text, send, myId]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <Header
        title={currentChallenge?.title || 'BINGO CARD'}
        current_week={currentChallenge?.current_week || 1}
      />
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
