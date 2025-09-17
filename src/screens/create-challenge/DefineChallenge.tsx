import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LayoutCard } from '../../components/create-challenge/layout-card.component';
import { TypeButton } from '../../components/create-challenge/type-button.component';
import { Button, Input } from '../../components/ui';
import { CATEGORIES } from '../../constants/category';
import { SCREEN_NAMES } from '../../constants/screens';
import { plans } from '../../data/plans';
import { useCreateStore } from '../../store';
import { COLORS, FONTS } from '../../theme';

const layoutOptions = [
  { id: 16, size: '4x4', taskCount: 16 },
  { id: 20, size: '4x5', taskCount: 20 },
  { id: 24, size: '4x6', taskCount: 24 },
];

export const DefineChallenge: React.FC = () => {
  const {
    plan,
    title,
    setTitle,
    duration,
    setDuration,
    cardSize,
    setCardSize,
    categoryId,
    setCategoryId,
  } = useCreateStore();

  const navigation = useNavigation();

  const handleTypeSelect = (typeId: string) => {
    setCategoryId(typeId);
  };

  const handleDurationChange = (increment: boolean) => {
    const maxWeeks = plans[plan as keyof typeof plans]?.maxweek || 12;
    if (increment) {
      setDuration(Math.min(duration + 1, maxWeeks));
    } else {
      setDuration(Math.max(duration - 1, 1));
    }
  };

  const handleLayoutSelect = (layoutId: number) => {
    setCardSize(layoutId);
  };

  const handleNext = () => {
    navigation.navigate(SCREEN_NAMES._CREATE_CHALLENGE.CARD_SETUP as never);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Challenge Types</Text>
      <View style={styles.typeButtonsContainer}>
        {CATEGORIES.map(type => (
          <TypeButton
            key={type.id}
            label={type.name}
            isSelected={categoryId === type.id}
            onPress={() => handleTypeSelect(type.id)}
          />
        ))}
      </View>

      <Text style={styles.title}>Challenge name</Text>
      <Input
        placeholder="Enter your challenge name"
        value={title}
        onChangeText={setTitle}
        inputStyle={styles.challengeInput}
      />

      <Text style={styles.title}>Duration</Text>
      <View style={styles.durationContainer}>
        <TouchableOpacity
          style={styles.durationButton}
          onPress={() => handleDurationChange(false)}
        >
          <Text style={styles.durationButtonText}>-</Text>
        </TouchableOpacity>

        <View style={styles.durationDisplay}>
          <Text style={styles.durationValue}>{duration}</Text>
          <Text style={styles.durationUnit}>weeks</Text>
        </View>

        <TouchableOpacity
          style={styles.durationButton}
          onPress={() => handleDurationChange(true)}
        >
          <Text style={styles.durationButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Bingo Board Layout</Text>
      <View style={styles.layoutContainer}>
        {layoutOptions.map(layout => (
          <LayoutCard
            key={layout.id}
            size={layout.size}
            taskCount={layout.taskCount}
            isSelected={cardSize === layout.id}
            onPress={() => handleLayoutSelect(layout.id)}
          />
        ))}
      </View>

      <Button
        text="Next: Create Week 1 Card"
        onPress={handleNext}
        buttonStyle={styles.nextButton}
        textStyle={styles.nextButtonText}
        disabled={title.length === 0}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontFamily: FONTS.family.poppinsBold,
    color: COLORS.blue.indigo,
    fontSize: 20,
    lineHeight: 24,
    paddingVertical: 10,
  },
  typeButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  durationButton: {
    width: 30,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.gray.medium,
    borderRadius: 12,
  },
  durationButtonText: {
    fontSize: 24,
    color: COLORS.text.primary,
  },
  durationDisplay: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  durationValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  durationUnit: {
    fontSize: 16,
    color: COLORS.text.secondary,
  },
  layoutContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  nextButton: {
    backgroundColor: COLORS.green.forest,
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    marginTop: 24,
  },
  nextButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.family.poppinsMedium,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  challengeInput: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.gray.mediumDark,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: FONTS.family.poppinsMedium,
    backgroundColor: COLORS.white,
    fontSize: 14,
  },
});
