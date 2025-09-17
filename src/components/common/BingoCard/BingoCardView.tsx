import React from 'react';
import { StyleSheet, Text } from 'react-native';

interface BingoCardViewProps {
  name: string;
}

export const BingoCardView: React.FC<BingoCardViewProps> = ({ name }) => {
  return <Text style={styles.text}>{name}</Text>;
};

const styles = StyleSheet.create({
  text: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
    lineHeight: 16,
  },
});
