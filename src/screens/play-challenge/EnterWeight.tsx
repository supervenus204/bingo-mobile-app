import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Header } from '../../components/play-challenge/Header';
import { useChallengesStore } from '../../store';
import { COLORS, FONTS } from '../../theme';

interface WeightEntry {
  week: number;
  weight: number;
  loss: number;
}

export const EnterWeight: React.FC = () => {
  const { currentChallenge } = useChallengesStore();
  const [weight, setWeight] = useState('100');
  const [note, setNote] = useState('');

  // Mock data for weight history
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([
    { week: 1, weight: 90.0, loss: 0 },
    { week: 2, weight: 89.0, loss: 1.1 },
  ]);

  const handleIncrement = () => {
    const currentValue = parseFloat(weight) || 0;
    setWeight(String(currentValue + 1));
  };

  const handleDecrement = () => {
    const currentValue = parseFloat(weight) || 0;
    if (currentValue > 0) {
      setWeight(String(currentValue - 1));
    }
  };

  const handleSave = () => {
    const currentWeek = currentChallenge?.current_week || 1;
    const newWeight = parseFloat(weight);

    if (newWeight > 0) {
      const previousWeight =
        weightHistory[weightHistory.length - 1]?.weight || newWeight;
      const loss =
        previousWeight > 0
          ? ((previousWeight - newWeight) / previousWeight) * 100
          : 0;

      const newEntry: WeightEntry = {
        week: currentWeek,
        weight: newWeight,
        loss: Math.round(loss * 10) / 10,
      };

      setWeightHistory(prev => [...prev, newEntry]);
    }
  };

  const renderChart = () => {
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

  return (
    <View style={styles.container}>
      <Header
        title={currentChallenge?.title || 'Enter Weight'}
        current_week={currentChallenge?.current_week || 1}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Current Week Weight Input */}
        <View style={styles.weightCard}>
          <Text style={styles.weekTitle}>
            Week {currentChallenge?.current_week || 1} Weight
          </Text>
          <Text style={styles.subtitle}>
            Enter your Week {currentChallenge?.current_week || 1} Weight
          </Text>

          <View style={styles.weightInputContainer}>
            <TextInput
              style={styles.weightInput}
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
              placeholder="0"
              selectTextOnFocus={true}
              returnKeyType="done"
              underlineColorAndroid="transparent"
              autoCorrect={false}
              autoCapitalize="none"
              multiline={false}
              numberOfLines={1}
            />
            <View style={styles.controlsContainer}>
              <TouchableOpacity
                onPress={handleIncrement}
                style={styles.controlButton}
              >
                <Text style={styles.controlText}>▲</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDecrement}
                style={styles.controlButton}
              >
                <Text style={styles.controlText}>▼</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.unitText}>kg</Text>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>SAVE WEIGHT</Text>
          </TouchableOpacity>
        </View>

        {/* Chart Section */}
        {renderChart()}

        {/* Weight History List */}
        <View style={styles.historyCard}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyHeaderText}>Weigh-In</Text>
            <Text style={styles.historyHeaderText}>Loss</Text>
          </View>

          {weightHistory.map((entry, index) => (
            <View key={index} style={styles.historyRow}>
              <Text style={styles.historyWeekText}>
                Week {entry.week} - {entry.weight} kg
              </Text>
              <Text style={styles.historyLossText}>{entry.loss}%</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
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
  weightCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  weekTitle: {
    fontSize: 18,
    fontFamily: FONTS.family.poppinsBold,
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  weightInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 20,
    minWidth: 280,
    height: 70,
    justifyContent: 'space-between',
  },
  weightInput: {
    flex: 1,
    fontSize: 28,
    color: '#374151',
    textAlign: 'left',
    paddingRight: 10,
    height: 50,
    lineHeight: 50,
    fontWeight: '500',
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingVertical: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  controlsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
  controlButton: {
    width: 20,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlText: {
    fontSize: 12,
    color: '#6B7280',
  },
  unitText: {
    fontSize: 16,
    color: '#374151',
    fontFamily: FONTS.family.poppinsMedium,
  },
  saveButton: {
    width: '100%',
    backgroundColor: COLORS.green.forest,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: FONTS.family.poppinsBold,
    letterSpacing: 0.5,
  },
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
});
