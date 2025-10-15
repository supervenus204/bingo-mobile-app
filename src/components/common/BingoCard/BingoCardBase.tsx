import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '../../../theme';

interface BingoCardBaseProps {
  color: string;
  name: string;
  status?: 'mark' | 'check' | 'unmark' | null;
  children: React.ReactNode;
}

export const BingoCardBase: React.FC<BingoCardBaseProps> = ({
  color,
  name,
  status,
  children,
}) => {
  return (
    <View style={styles.cardWrapper}>
      <View
        style={[
          styles.container,
          { backgroundColor: status === 'check' ? COLORS.green.forest : color },
          (status === 'mark' || status === 'check') && styles.markedContainer,
        ]}
      >
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    position: 'relative',
  },
  container: {
    width: 80,
    height: 80,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  markedContainer: {
    borderWidth: 2,
    borderColor: COLORS.green.forest,
  },
});
