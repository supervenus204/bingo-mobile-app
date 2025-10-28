import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  createMeasure,
  getCurrentWeekMeasures,
  getMeasureHistory,
} from '../../services';
import { useChallengesStore } from '../../store';
import { COLORS, FONTS } from '../../theme';

interface WeightEntry {
  week: number;
  weight: number;
  loss: number;
}

interface MeasureData {
  week_number: number;
  value: number;
  createdAt?: string;
}

export const WeighInScreen: React.FC = () => {
  const { selectedChallenge } = useChallengesStore();
  const [weight, setWeight] = useState('100');
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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

  const transformMeasuresToWeightHistory = (measures: MeasureData[]): WeightEntry[] => {
    const sortedMeasures = [...measures].sort(
      (a, b) => a.week_number - b.week_number
    );

    return sortedMeasures.map((measure, index) => {
      const previousMeasure = index > 0 ? sortedMeasures[index - 1] : null;
      const previousWeight = previousMeasure?.value || measure.value;
      const loss =
        previousWeight > 0
          ? ((previousWeight - measure.value) / previousWeight) * 100
          : 0;

      return {
        week: measure.week_number,
        weight: measure.value,
        loss: Math.round(loss * 10) / 10,
      };
    });
  };

  useEffect(() => {
    const fetchWeightData = async () => {
      if (!selectedChallenge?.id) return;

      try {
        setIsLoading(true);
        const [historyResponse, currentResponse] = await Promise.all([
          getMeasureHistory(selectedChallenge.id),
          getCurrentWeekMeasures(selectedChallenge.id),
        ]);

        const historyData = transformMeasuresToWeightHistory(historyResponse);
        setWeightHistory(historyData);

        if (currentResponse && currentResponse.length > 0) {
          setWeight(String(currentResponse[0].value));
        }
      } catch (error) {
        console.error('Failed to fetch weight data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeightData();
  }, [selectedChallenge?.id]);

  const handleSave = async () => {
    if (!selectedChallenge?.id) return;

    const newWeight = parseFloat(weight);
    if (newWeight <= 0) return;

    try {
      setIsSaving(true);
      await createMeasure(selectedChallenge.id, 'weight', newWeight);

      const updatedHistory = await getMeasureHistory(selectedChallenge.id);
      const transformedHistory = transformMeasuresToWeightHistory(updatedHistory);
      setWeightHistory(transformedHistory);
    } catch (error) {
      console.error('Failed to save weight:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderChart = () => {
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

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary.main} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.weightCard}>
          <Text style={styles.weekTitle}>
            Week {selectedChallenge?.current_week || 1} Weight
          </Text>
          <Text style={styles.subtitle}>
            Enter your Week {selectedChallenge?.current_week || 1} Weight
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

          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>SAVE WEIGHT</Text>
            )}
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

          {weightHistory.length === 0 ? (
            <View style={styles.emptyHistoryRow}>
              <Text style={styles.emptyHistoryText}>
                No weight entries yet
              </Text>
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
  emptyHistoryRow: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyHistoryText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    fontFamily: FONTS.family.poppinsRegular,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
});
