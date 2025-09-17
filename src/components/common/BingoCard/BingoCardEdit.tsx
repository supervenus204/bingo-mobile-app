import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../../theme';

interface BingoCardEditProps {
  name: string;
  count: number;
  onIncrement?: () => void;
  onDecrement?: () => void;
}

export const BingoCardEdit: React.FC<BingoCardEditProps> = ({
  name,
  count,
}) => {
  return (
    <>
      <Text style={styles.text}>{name}</Text>

      <View
        style={[
          styles.badge,
          count > 0 ? styles.badgeActive : styles.badgeInactive,
        ]}
      >
        <Text
          style={[
            styles.badgeText,
            count > 0 ? styles.badgeTextActive : styles.badgeTextInactive,
          ]}
        >
          {count}
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
    lineHeight: 16,
  },
  badge: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  badgeActive: {
    width: 24,
    height: 24,
    backgroundColor: COLORS.green.mantis,
  },
  badgeInactive: {
    width: 18,
    height: 18,
    backgroundColor: COLORS.gray.lightMedium,
  },
  badgeText: {
    fontWeight: 'bold',
  },
  badgeTextActive: {
    color: COLORS.white,
    fontSize: 12,
  },
  badgeTextInactive: {
    color: COLORS.gray.darker,
    fontSize: 10,
  },
});
