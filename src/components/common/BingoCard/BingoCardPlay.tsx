import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../../theme';

interface BingoCardPlayProps {
  name: string;
  status?: 'mark' | 'check' | 'unmark' | null;
  onLongPress?: () => void;
  onStatusChange?: (status: string) => void;
  onShowActions?: (cardId: string) => void;
  cardId?: string;
  isActionActive?: boolean;
}

export const BingoCardPlay: React.FC<BingoCardPlayProps> = ({
  name,
  status,
  onLongPress,
  onStatusChange,
  onShowActions,
  cardId,
  isActionActive = false,
}) => {
  // Auto-hide after 5 seconds
  useEffect(() => {
    if (isActionActive) {
      const timer = setTimeout(() => {
        onShowActions?.('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isActionActive, onShowActions]);

  const handleAction = (newStatus: string) => {
    onStatusChange?.(newStatus);
    onShowActions?.('');
  };

  const getActionButtons = () => {
    if (status === 'unmark') {
      return [
        {
          status: 'mark',
          icon: 'radio-button-unchecked',
          color: COLORS.blue.oxford,
        },
        { status: 'check', icon: 'check-circle', color: COLORS.green.forest },
      ];
    } else if (status === 'mark') {
      return [
        { status: 'unmark', icon: 'undo', color: COLORS.gray.darker },
        { status: 'check', icon: 'check-circle', color: COLORS.green.forest },
      ];
    } else if (status === 'check') {
      return [{ status: 'unmark', icon: 'undo', color: COLORS.gray.darker }];
    }
    return [];
  };

  return (
    <>
      <TouchableOpacity
        style={styles.touchableArea}
        onLongPress={onLongPress}
        delayLongPress={500}
      >
        {status === 'check' ? (
          <Image
            source={require('../../../assets/images/bingocard/mark.png')}
            style={styles.markImage}
          />
        ) : (
          <Text style={styles.text}>{name}</Text>
        )}
      </TouchableOpacity>

      {isActionActive && (
        <View style={styles.actionButtonsContainer}>
          {getActionButtons().map((button, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.actionButton, { backgroundColor: button.color }]}
              onPress={() => handleAction(button.status)}
            >
              <MaterialIcons
                name={button.icon as any}
                size={16}
                color="white"
              />
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[styles.actionButton, styles.closeButton]}
            onPress={() => onShowActions?.('')}
          >
            <MaterialIcons name="close" size={16} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  touchableArea: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
    lineHeight: 16,
  },
  markImage: {
    width: '100%',
    height: '100%',
  },
  actionButtonsContainer: {
    position: 'absolute',
    top: -35,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    zIndex: 10,
  },
  actionButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  closeButton: {
    backgroundColor: COLORS.gray.darker,
  },
});
