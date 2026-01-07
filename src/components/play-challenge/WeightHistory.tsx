import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS } from '../../theme';

interface WeightEntry {
  week: number;
  weight: number;
  loss: number;
}

interface WeightHistoryProps {
  weightHistory: WeightEntry[];
}

export const WeightHistory: React.FC<WeightHistoryProps> = ({
  weightHistory,
}) => {
  return (
    <View style={styles.historyCard}>
      <View style={styles.historyHeader}>
        <Text style={styles.historyHeaderText}>Weigh-In</Text>
        <Text style={styles.historyHeaderText}>Loss</Text>
      </View>

      {weightHistory.length === 0 ? (
        <View style={styles.emptyHistoryRow}>
          <Text style={styles.emptyHistoryText}>No weight entries yet</Text>
        </View>
      ) : (
        weightHistory.map((entry, index) => (
          <View key={index} style={styles.historyRow}>
            <Text style={styles.historyWeekText}>
              Week {entry.week} - {entry.weight} kg
            </Text>
            <Text style={styles.historyLossText}>{entry.loss}%</Text>
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  historyCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  historyHeaderText: {
    fontSize: 16,
    fontFamily: FONTS.family.poppinsBold,
    color: '#000000',
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  historyWeekText: {
    fontSize: 14,
    color: '#374151',
    fontFamily: FONTS.family.poppinsMedium,
  },
  historyLossText: {
    fontSize: 14,
    color: '#374151',
    fontFamily: FONTS.family.poppinsMedium,
  },
  emptyHistoryRow: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyHistoryText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    fontFamily: FONTS.family.poppinsRegular,
  },
});
