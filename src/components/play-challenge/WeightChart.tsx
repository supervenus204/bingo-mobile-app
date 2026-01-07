import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface WeightEntry {
  week: number;
  weight: number;
  loss: number;
}

interface WeightChartProps {
  weightHistory: WeightEntry[];
}

export const WeightChart: React.FC<WeightChartProps> = ({ weightHistory }) => {
  if (weightHistory.length === 0) {
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartLabel}>No weight data yet</Text>
      </View>
    );
  }

  const maxWeight = Math.max(...weightHistory.map(entry => entry.weight));
  const minWeight = Math.min(...weightHistory.map(entry => entry.weight));
  const range = maxWeight - minWeight || 1;

  return (
    <View style={styles.chartContainer}>
      <View style={styles.chart}>
        {weightHistory.map((entry, index) => {
          const height = ((entry.weight - minWeight) / range) * 100;
          return (
            <View
              key={index}
              style={[styles.chartBar, { height: `${height}%` }]}
            />
          );
        })}
      </View>
      <Text style={styles.chartLabel}>Shows a chart as weight changes</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 120,
    width: '100%',
    justifyContent: 'space-around',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderRadius: 8,
    padding: 10,
  },
  chartBar: {
    width: 20,
    backgroundColor: '#000000',
    borderRadius: 2,
    minHeight: 10,
  },
  chartLabel: {
    fontSize: 12,
    color: '#EC4899',
    fontStyle: 'italic',
  },
});
