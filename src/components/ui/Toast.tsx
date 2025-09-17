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
  success: '#16A34A',
  error: '#DC2626',
  info: '#1F2937',
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
  const opacity = useRef(new Animated.Value(0)).current;
  const translate = useRef(
    new Animated.Value(position === 'top' ? -12 : 12)
  ).current;

  const bg = useMemo(() => {
    const base =
      TYPE_BG[(options?.type ?? 'info') as keyof typeof TYPE_BG] ??
      TYPE_BG.info;
    return Platform.select({ ios: base + 'E6', default: base }); // ~90% on iOS
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
              <Text style={styles.text} numberOfLines={3}>
                {options.message}
              </Text>

              <RNPressable
                onPress={onRequestClose}
                accessibilityLabel="Close"
                style={({ pressed }) => [
                  styles.closeBtn,
                  pressed && { opacity: 0.8 },
                ]}
              >
                <Text style={styles.closeLabel}>×</Text>
              </RNPressable>
            </View>

            {!!options.action && (
              <Pressable
                onPress={() => {
                  options.action?.onPress();
                  onRequestClose?.();
                }}
                style={({ pressed }) => [
                  styles.action,
                  pressed && { opacity: 0.7 },
                ]}
                accessibilityRole="button"
                accessibilityLabel={options.action.label}
              >
                <Text style={styles.actionLabel}>{options.action.label}</Text>
              </Pressable>
            )}
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 15,
    flexShrink: 1,
    flexGrow: 1,
  },
  action: {
    marginLeft: 14,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  actionLabel: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  closeLabel: {
    color: 'white',
    fontSize: 20,
    lineHeight: 20,
    fontWeight: '700',
  },
});
