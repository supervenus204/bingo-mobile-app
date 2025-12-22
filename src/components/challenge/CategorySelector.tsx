import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { ChallengeCategory } from '../../store';
import { COLORS, FONTS } from '../../theme';

interface Props {
  categories: ChallengeCategory[];
  categoryId: string;
  plan: string;
  handleTypeSelect: (categoryId: string) => void;
}

const CategoryButton: React.FC<{
  category: ChallengeCategory;
  isSelected: boolean;
  disabled: boolean;
  onPress: () => void;
}> = ({ category, isSelected, disabled, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const checkmarkScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(checkmarkScale, {
      toValue: isSelected ? 1 : 0,
      useNativeDriver: true,
      tension: 100,
      friction: 7,
    }).start();
  }, [isSelected, checkmarkScale]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 1.05,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.buttonWrapper,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.typeButton,
          { backgroundColor: category.color },
          isSelected && styles.typeButtonSelected,
          disabled && styles.typeButtonDisabled,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={1}
      >
        {disabled && (
          <View style={styles.lockIconContainer}>
            <Icon name="lock" size={24} color={COLORS.gray.medium} />
          </View>
        )}
        {isSelected && (
          <Animated.View
            style={[
              styles.checkmarkContainer,
              {
                transform: [{ scale: checkmarkScale }],
              },
            ]}
          >
            <Icon name="check-circle" size={24} color={COLORS.primary.white} />
          </Animated.View>
        )}
        <Text
          style={[
            styles.typeButtonText,
            isSelected && styles.typeButtonTextSelected,
            disabled && styles.typeButtonTextDisabled,
          ]}
        >
          {category.name}
        </Text>
        <Icon
          name={category.image}
          size={28}
          color={disabled ? COLORS.gray.medium : COLORS.primary.white}
          style={styles.categoryIcon}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

export const CategorySelector: React.FC<Props> = ({
  categories,
  categoryId,
  plan,
  handleTypeSelect,
}) => {
  return (
    <View>
      <Text style={styles.title}>Choose Your Focus:</Text>
      <Text style={styles.description}>
        Select your main focus area for this challenge.
      </Text>
      <View style={styles.typeButtonsContainer}>
        {categories?.map(category => {
          const isSelected = categoryId === category.id;
          const disabled =
            (plan === 'free' || plan === 'premium') && category.is_premium;
          return (
            <CategoryButton
              key={category.id}
              category={category}
              isSelected={isSelected}
              disabled={disabled}
              onPress={() => handleTypeSelect(category.id)}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: FONTS.family.poppinsBold,
    color: COLORS.primary.blue,
    fontSize: 18,
    fontWeight: FONTS.weight.bold,
    marginBottom: 8,
  },
  description: {
    fontFamily: FONTS.family.poppinsRegular,
    color: COLORS.text.secondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  typeButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    width: '100%',
  },
  buttonWrapper: {
    width: '48%',
    marginBottom: 12,
  },
  typeButton: {
    width: '100%',
    height: 100,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  typeButtonSelected: {
    opacity: 1,
    shadowColor: COLORS.primary.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: COLORS.primary.white,
  },
  typeButtonDisabled: {
    opacity: 0.6,
  },
  typeButtonText: {
    fontFamily: FONTS.family.poppinsMedium,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
    color: COLORS.primary.white,
    lineHeight: 18,
    marginBottom: 8,
  },
  typeButtonTextSelected: {
    color: COLORS.primary.white,
  },
  typeButtonTextDisabled: {
    color: COLORS.gray.medium,
  },
  categoryIcon: {
    marginTop: 4,
  },
  lockIconContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    opacity: 0.6,
  },
  checkmarkContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});
