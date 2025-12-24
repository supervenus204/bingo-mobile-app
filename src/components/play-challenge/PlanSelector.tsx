import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { usePlans } from '../../hooks';
import { COLORS, FONTS } from '../../theme';
import { PlanButton } from './PlanButton';

interface PlanSelectorProps {
  selectedPlan: string;
  onPlanChange: (plan: string) => void;
}

export const PlanSelector: React.FC<PlanSelectorProps> = ({
  selectedPlan,
  onPlanChange,
}) => {
  const { plans, getPlanById } = usePlans();
  const currentPlan = getPlanById(selectedPlan);
  const isCurrentPlanFree = currentPlan?.price === 0;

  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>Plan</Text>
      <View style={styles.planContainer}>
        {plans?.map(plan => (
          <PlanButton
            key={plan.id}
            label={plan.name}
            isSelected={selectedPlan === plan.id}
            isCurrentPlanFree={isCurrentPlanFree}
            onPress={() => onPlanChange(plan.id)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontFamily: FONTS.family.poppinsMedium,
    color: COLORS.text.secondary,
    marginBottom: 8,
  },
  planContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});

