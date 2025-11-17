import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS, FONTS } from '../../theme';

interface Props {
  label: string;
  isSelected: boolean;
  isCurrentPlanFree: boolean;
  onPress: () => void;
}

export const PlanButton: React.FC<Props> = ({
  label,
  isSelected,
  isCurrentPlanFree,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.planButton,
        isSelected && styles.planButtonSelected,
        !isCurrentPlanFree && styles.planButtonDisabled,
      ]}
      onPress={onPress}
      disabled={!isCurrentPlanFree}
    >
      <Text
        style={[
          styles.planButtonText,
          isSelected && styles.planButtonTextSelected,
          !isCurrentPlanFree && styles.planButtonTextDisabled,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  planButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray.lightMedium,
    backgroundColor: COLORS.primary.white,
    alignItems: 'center',
  },
  planButtonSelected: {
    backgroundColor: COLORS.primary.green,
    borderColor: COLORS.primary.green,
  },
  planButtonDisabled: {
    backgroundColor: COLORS.gray.light,
    borderColor: COLORS.gray.lightMedium,
    opacity: 0.6,
  },
  planButtonText: {
    fontSize: 14,
    fontFamily: FONTS.family.poppinsMedium,
    color: COLORS.text.primary,
  },
  planButtonTextSelected: {
    color: COLORS.primary.white,
  },
  planButtonTextDisabled: {
    color: COLORS.gray.medium,
  },
});
