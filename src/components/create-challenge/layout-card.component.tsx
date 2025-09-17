import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {COLORS, FONTS} from '../../theme';

interface LayoutCardProps {
  size: string;
  taskCount: number;
  isSelected: boolean;
  onPress: () => void;
}

export const LayoutCard: React.FC<LayoutCardProps> = ({
  size,
  taskCount,
  isSelected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.cardSelected]}
      onPress={onPress}>
      <Text style={[styles.sizeText, isSelected && styles.sizeTextSelected]}>
        {size}
      </Text>
      <Text
        style={[
          styles.taskCountText,
          isSelected && styles.taskCountTextSelected,
        ]}>
        ({taskCount} tasks)
      </Text>
      <Image
        source={require('../../assets/images/create-challenge/layout-card.png')}
        style={styles.layoutImage}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 100,
    height: 120,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: COLORS.blue.oxford,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  cardSelected: {
    borderColor: COLORS.primary.main,
    backgroundColor: COLORS.blue.oxford,
  },
  sizeText: {
    fontFamily: FONTS.family.poppinsMedium,
    fontSize: 24,
    color: COLORS.blue.oxford,
    marginBottom: 4,
  },
  sizeTextSelected: {
    color: COLORS.white,
  },
  taskCountText: {
    fontFamily: FONTS.family.poppinsRegular,
    fontSize: 12,
    color: COLORS.text.primary,
    marginBottom: 12,
  },
  taskCountTextSelected: {
    color: COLORS.white,
  },
  layoutImage: {
    width: 25,
    height: 25,
  },
});
