import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  Pressable as RNPressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { COLORS } from '../../theme';
import type { ToastOptions, ToastPosition } from '../../types';

type Props = {
  visible: boolean;
  options: ToastOptions | null;
  position?: ToastPosition;
  offset?: number; // distance from top/bottom
  maxWidth?: number; // constrain width on tablets
  onRequestClose?: () => void; // provider calls this to hide
  onHidden?: () => void; // called after fade-out ends
};

const TYPE_BG: Record<NonNullable<ToastOptions['type']>, string> = {
  success: COLORS.primary.green.mantis,
  error: COLORS.primary.pink.bright_1,
  info: COLORS.white,
};

const TYPE_TEXT: Record<NonNullable<ToastOptions['type']>, string> = {
  success: COLORS.white,
  error: COLORS.white,
  info: COLORS.gray.dark,
};

export function Toast({
  visible,
  options,
  position = 'top',
  offset = 16,
  maxWidth = 680,
  onRequestClose,
  onHidden,
}: Props) {
  console.log('options', options);

  const opacity = useRef(new Animated.Value(0)).current;
  const translate = useRef(
    new Animated.Value(position === 'top' ? -12 : 12)
  ).current;

  const bg = useMemo(() => {
    const base =
      TYPE_BG[(options?.type ?? 'info') as keyof typeof TYPE_BG] ??
      TYPE_BG.info;
    return Platform.select({ ios: base + 'F5', default: base }); // More opaque on iOS
  }, [options?.type]);

  const textColor = useMemo(() => {
    return (
      TYPE_TEXT[(options?.type ?? 'info') as keyof typeof TYPE_TEXT] ??
      TYPE_TEXT.info
    );
  }, [options?.type]);

  // Animate on visibility changes
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translate, {
          toValue: 0,
          duration: 180,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 140,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translate, {
          toValue: position === 'top' ? -12 : 12,
          duration: 140,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => finished && onHidden?.());
    }
  }, [visible, position, opacity, translate, onHidden]);

  // Nothing to render when hidden *and* no options
  if (!visible && !options) return null;

  return (
    <View
      pointerEvents="box-none"
      style={[
        StyleSheet.absoluteFillObject,
        position === 'top'
          ? { justifyContent: 'flex-start' }
          : { justifyContent: 'flex-end' },
      ]}
    >
      <View
        pointerEvents="box-none"
        style={{
          alignItems: 'center',
          paddingTop: position === 'top' ? offset : 0,
          paddingBottom: position === 'bottom' ? offset : 0,
        }}
      >
        {options && (
          <Animated.View
            accessibilityLiveRegion="polite"
            style={[
              styles.card,
              {
                backgroundColor: bg,
                transform: [{ translateY: translate }],
                opacity,
                maxWidth,
              },
            ]}
          >
            <View style={styles.contentRow}>
              <View style={styles.messageContainer}>
                <Text style={[styles.text, { color: textColor }]} numberOfLines={2}>
                  {options.message}
                </Text>
              </View>

              {!!options.action && (
                <Pressable
                  onPress={() => {
                    options.action?.onPress();
                    onRequestClose?.();
                  }}
                  style={({ pressed }) => [
                    styles.action,
                    {
                      backgroundColor:
                        options.type === 'info'
                          ? COLORS.primary.green.sgbus
                          : TYPE_BG[options.type || 'info'],
                    },
                    pressed && { opacity: 0.8 },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={options.action.label}
                >
                  <Text style={styles.actionLabel}>{options.action.label}</Text>
                </Pressable>
              )}

              <RNPressable
                onPress={onRequestClose}
                accessibilityLabel="Close"
                style={({ pressed }) => [
                  styles.closeBtn,
                  pressed && { opacity: 0.6 },
                ]}
              >
                <Text style={[styles.closeLabel, { color: textColor }]}>×</Text>
              </RNPressable>
            </View>
          </Animated.View>
        )}
      </View>
    </View >
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 16,
    minHeight: 56,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.gray.lightMedium,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  messageContainer: {
    flex: 1,
    marginRight: 12,
  },
  text: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500',
  },
  action: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  closeBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeLabel: {
    fontSize: 22,
    lineHeight: 22,
    fontWeight: '300',
  },
});
