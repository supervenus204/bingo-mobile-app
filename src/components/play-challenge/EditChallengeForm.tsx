import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { StartingDaySelector, TitleInput } from '../challenge';
import { BoardLayout } from '../challenge/BoardLayout';
import { usePlans } from '../../hooks';
import { COLORS, FONTS } from '../../theme';
import { ChallengeField } from './ChallengeField';
import { DurationSelector } from './DurationSelector';
import { PlanSelector } from './PlanSelector';

interface EditChallengeFormProps {
  formData: {
    title: string;
    plan: string;
    cardSize: number;
    duration: number;
    startingDayOfWeek: string | null;
  };
  categoryName?: string;
  onTitleChange: (title: string) => void;
  onPlanChange: (plan: string) => void;
  onCardSizeChange: (cardSize: number) => void;
  onDurationChange: (increment: boolean) => void;
  onStartingDayChange: (day: string | null) => void;
}

export const EditChallengeForm: React.FC<EditChallengeFormProps> = ({
  formData,
  categoryName,
  onTitleChange,
  onPlanChange,
  onCardSizeChange,
  onDurationChange,
  onStartingDayChange,
}) => {
  const { getPlanById } = usePlans();
  const maxWeeks = getPlanById(formData.plan)?.maxWeek || 12;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Edit Challenge Settings</Text>
      <TitleInput
        title={formData.title}
        isEditable={true}
        setTitle={onTitleChange}
      />
      <ChallengeField label="Category" value={categoryName || ''} />
      <PlanSelector
        selectedPlan={formData.plan}
        onPlanChange={onPlanChange}
      />
      <DurationSelector
        duration={formData.duration}
        maxWeeks={maxWeeks}
        onChange={onDurationChange}
      />
      <View style={styles.fieldContainer}>
        <StartingDaySelector
          startingDayOfWeek={formData.startingDayOfWeek}
          onChange={onStartingDayChange}
        />
      </View>
      <View style={styles.fieldContainer}>
        <BoardLayout cardSize={formData.cardSize} onPress={onCardSizeChange} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: COLORS.primary.white,
    borderRadius: 12,
    padding: 20,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.family.poppinsBold,
    color: COLORS.text.primary,
  },
  fieldContainer: {
    marginBottom: 16,
  },
});

