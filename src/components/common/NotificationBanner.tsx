import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../theme';

type NotificationBannerProps = {
  visible: boolean;
  message: string;
  onPress: () => void;
  onDismiss: () => void;
};

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  visible,
  message,
  onPress,
  onDismiss,
}) => {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -100,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, translateY, opacity]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
          paddingTop: insets.top,
        },
      ]}
    >
      <Pressable style={styles.banner} onPress={onPress} activeOpacity={0.85}>
        <View style={styles.leftAccent} />
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Icon name="chat-bubble-outline" size={20} color={COLORS.primary.green.sgbus} />
          </View>
          <View style={styles.messageContainer}>
            <Text style={styles.message} numberOfLines={2}>
              {message}
            </Text>
          </View>
          <Pressable
            onPress={onDismiss}
            style={styles.closeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.closeText}>×</Text>
          </Pressable>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  banner: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray.lightMedium,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  leftAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: COLORS.primary.green.sgbus,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary.green.nyanza_2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  messageContainer: {
    flex: 1,
    marginRight: 12,
  },
  message: {
    fontSize: 15,
    color: COLORS.gray.dark,
    fontWeight: '500',
    lineHeight: 20,
  },
  closeButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 22,
    color: COLORS.gray.medium,
    fontWeight: '300',
    lineHeight: 22,
  },
});

