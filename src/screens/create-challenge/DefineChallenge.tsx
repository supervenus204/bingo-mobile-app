import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CustomButton, Input } from '../../components/common';
import { Header } from '../../components/create-challenge/Header';
import { LayoutCard } from '../../components/create-challenge/LayoutCard';
import { TypeButton } from '../../components/create-challenge/TypeButton';
import { DashboardHeader } from '../../components/dashboard';
import { SCREEN_NAMES } from '../../constants/screens';
import { useCategories, usePlans } from '../../hooks';
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
  const { getPlanById } = usePlans();
  const { categories, loading } = useCategories();

  const handleTypeSelect = (typeId: string) => {
    setCategoryId(typeId);
  };

  const handleDurationChange = (increment: boolean) => {
    const maxWeeks = getPlanById(plan as string)?.maxWeek || 12;
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

  const handleBack = () => {
    navigation.navigate(SCREEN_NAMES._CREATE_CHALLENGE.CHOOSE_PLAN as never);
  };

  const handleCancel = () => {
    navigation.navigate(SCREEN_NAMES.DASHBOARD as never);
  }

  return (
    <>
      <DashboardHeader
        title="Create Challenge"
        action={
          <TouchableOpacity onPress={handleCancel}>
            <Text style={{ color: COLORS.green.forest, marginRight: 4 }}>Cancel</Text>
          </TouchableOpacity>
        }
        showProfileIcon={false}
      />
      <Header
        title="Define Challenge"
        step={1}
        totalSteps={3}
        onBack={handleBack}
        bgColor={COLORS.gray.veryLight}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.section}>
          <Text style={styles.subTitle}>Challenge Category</Text>
          <View style={styles.typeButtonsContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.green.forest} />
              </View>
            ) : (
              categories?.map(category => (
                <TypeButton
                  key={category.id}
                  label={category.name}
                  isSelected={categoryId === category.id}
                  disabled={plan === 'free' && category.is_premium}
                  onPress={() => handleTypeSelect(category.id)}
                />
              ))
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.subTitle}>Challenge Name</Text>
          <Input
            placeholder="Enter your challenge name"
            value={title}
            onChangeText={setTitle}
            inputStyle={styles.challengeInput}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.subTitle}>Duration</Text>
          <View style={styles.durationContainer}>
            <TouchableOpacity
              style={styles.durationButton}
              onPress={() => handleDurationChange(false)}
            >
              <Text style={[styles.durationButtonText, { color: duration === 1 ? COLORS.gray.medium : COLORS.text.primary }]}>-</Text>
            </TouchableOpacity>

            <View style={styles.durationDisplay}>
              <Text style={styles.durationValue}>{duration}</Text>
              <Text style={styles.durationUnit}>weeks</Text>
            </View>

            <TouchableOpacity
              style={styles.durationButton}
              onPress={() => handleDurationChange(true)}
            >
              <Text style={[styles.durationButtonText, { color: duration === getPlanById(plan as string)?.maxWeek ? COLORS.gray.medium : COLORS.text.primary }]}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.subTitle}>Bingo Board Layout</Text>
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
        </View>

        <CustomButton
          text="Next: Create Week 1 Card"
          onPress={handleNext}
          buttonStyle={styles.nextButton}
          textStyle={styles.nextButtonText}
          disabled={title.length === 0 || categoryId === null}
        />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: FONTS.family.poppinsBold,
    color: COLORS.blue.indigo,
    fontSize: FONTS.size['2xl'],
    fontWeight: FONTS.weight.bold,
    textAlign: 'center',
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  subTitle: {
    fontFamily: FONTS.family.poppinsBold,
    color: COLORS.blue.indigo,
    fontSize: 18,
    fontWeight: FONTS.weight.bold,
    marginBottom: 16,
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
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  durationButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.gray.medium,
    borderRadius: 20,
  },
  durationButtonText: {
    fontSize: 24,
    color: COLORS.text.primary,
  },
  durationDisplay: {
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 20,
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
  backButton: {
    padding: 8,
    position: 'absolute',
    left: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
