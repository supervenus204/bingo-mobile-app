import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Header } from '../../components/play-challenge/Header';
import { useChallengesStore } from '../../store';
import { COLORS, FONTS } from '../../theme';

export const EnterWeight: React.FC = () => {
  const { currentChallenge } = useChallengesStore();
  const [weight, setWeight] = useState('88');
  const [note, setNote] = useState('');

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
    // TODO: Implement save weight functionality
    console.log('Save weight:', weight, 'Note:', note);
  };

  return (
    <View style={styles.container}>
      <Header
        title={currentChallenge?.title || 'Enter Weight'}
        current_week={currentChallenge?.current_week || 1}
      />

      <View style={styles.content}>
        <Text style={styles.weekTitle}>
          WEEK {currentChallenge?.current_week || 1} WEIGHT
        </Text>

        <Text style={styles.subtitle}>
          Enter your starting weight for Week{' '}
          {currentChallenge?.current_week || 1}.
        </Text>

        <View style={styles.weightInputContainer}>
          <TextInput
            style={styles.weightInput}
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
            placeholder="0"
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

        <View style={styles.incrementContainer}>
          <TouchableOpacity
            onPress={handleDecrement}
            style={styles.incrementButton}
          >
            <Text style={styles.incrementText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.zeroText}>0</Text>
          <TouchableOpacity
            onPress={handleIncrement}
            style={styles.incrementButton}
          >
            <Text style={styles.incrementText}>+</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.noteInput}
          value={note}
          onChangeText={setNote}
          placeholder="Add a note (optional)"
          placeholderTextColor="#9CA3AF"
          multiline
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>SAVE WEIGHT</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          You can log Week 1 any time. Subsequent weeks must be recorded by
          Sunday to avoid defaulting to your last entry.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    alignItems: 'center',
  },
  weekTitle: {
    fontSize: 18,
    fontFamily: FONTS.family.poppinsBold,
    color: COLORS.blue.oxford,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 40,
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
    paddingVertical: 16,
    marginBottom: 20,
    minWidth: 300,
  },
  weightInput: {
    flex: 1,
    fontSize: 24,
    color: '#374151',
    textAlign: 'left',
    paddingRight: 10,
  },
  controlsContainer: {
    alignItems: 'center',
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
  incrementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 40,
  },
  incrementButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  incrementText: {
    fontSize: 20,
    color: '#374151',
    fontWeight: '500',
  },
  zeroText: {
    fontSize: 24,
    color: '#374151',
    fontFamily: FONTS.family.poppinsMedium,
  },
  noteInput: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 14,
    color: '#374151',
    marginBottom: 30,
    minHeight: 50,
  },
  saveButton: {
    width: '100%',
    backgroundColor: COLORS.green.forest,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: FONTS.family.poppinsBold,
    letterSpacing: 0.5,
  },
  disclaimer: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 10,
  },
});
