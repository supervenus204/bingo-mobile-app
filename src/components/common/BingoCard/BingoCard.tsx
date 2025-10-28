import React, { useEffect, useRef } from 'react';
import { Animated, TouchableOpacity } from 'react-native';
import { COLORS } from '../../../theme';
import { BingoCardBase } from './BingoCardBase';
import { BingoCardEdit } from './BingoCardEdit';
import { BingoCardPlay } from './BingoCardPlay';
import { BingoCardView } from './BingoCardView';

interface BingoCardProps {
  color: string;
  name: string;
  count: number;
  editable?: boolean;
  onIncrement?: () => void;
  onDecrement?: () => void;
  onStatusChange?: (status: string) => void;
  status?: 'mark' | 'unmark' | 'check' | null;
  mode?: 'view' | 'edit' | 'play';
}

export const BingoCard: React.FC<BingoCardProps> = ({
  color,
  name,
  count,
  onIncrement,
  onDecrement,
  onStatusChange,
  status,
  mode,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  // Animation for mark status in play mode
  useEffect(() => {
    if (mode === 'play' && status === 'mark') {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );

      const glowAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 0.6,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.2,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      );

      pulseAnimation.start();
      glowAnimation.start();

      return () => {
        pulseAnimation.stop();
        glowAnimation.stop();
      };
    } else {
      pulseAnim.setValue(1);
      glowAnim.setValue(0);
    }
  }, [mode, status, pulseAnim, glowAnim]);

  const renderContent = () => {
    switch (mode) {
      case 'edit':
        return (
          <BingoCardEdit
            name={name}
            count={count}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
          />
        );
      case 'play':
        return (
          <BingoCardPlay
            name={name}
            status={status}
            onStatusChange={onStatusChange}
          />
        );
      case 'view':
      default:
        return <BingoCardView name={name} />;
    }
  };

  const CardWrapper = mode === 'edit' ? TouchableOpacity : Animated.View;
  const cardWrapperProps =
    mode === 'edit'
      ? { onPress: onIncrement, activeOpacity: 0.7 }
      : {
        style: [
          mode === 'play' &&
          status === 'mark' && {
            transform: [{ scale: pulseAnim }],
          },
        ],
      };

  return (
    <>
      {mode === 'play' && status === 'mark' && (
        <Animated.View
          style={{
            position: 'absolute',
            width: 80,
            height: 80,
            borderRadius: 20,
            backgroundColor: COLORS.blue.oxford,
            opacity: glowAnim,
            top: -10,
            left: -10,
            zIndex: -1,
          }}
        />
      )}
      <CardWrapper {...cardWrapperProps}>
        <BingoCardBase color={color} name={name} status={status}>
          {renderContent()}
        </BingoCardBase>
      </CardWrapper>
    </>
  );
};
