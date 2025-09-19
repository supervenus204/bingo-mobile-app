import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Footer } from '../../components/create-challenge/Footer';
import { Header } from '../../components/create-challenge/Header';
import { SCREEN_NAMES } from '../../constants';
import { plans } from '../../data/plans';
import { useToast } from '../../hooks/useToast';
import { CreateChallengeStackParamList } from '../../navigation/types';
import { createChallenge } from '../../services';
import { useCreateStore } from '../../store';
import { COLORS } from '../../theme';

type Participant = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
};

type NavigationProp = NativeStackNavigationProp<CreateChallengeStackParamList>;

export const InviteParticipants: React.FC = () => {
  const handleBack = () => {
    // Handle back navigation
  };
  const navigation = useNavigation<NavigationProp>();
  const { showToast } = useToast();
  const [emailInput, setEmailInput] = useState('');
  const {
    title,
    plan,
    duration,
    categoryId,
    cardSize,
    bingoCards,
    isOrganizerParticipant,
    participants,
    setParticipants,
  } = useCreateStore();

  const isValidEmail = (email: string) =>
    /[^@\s]+@[^@\s]+\.[^@\s]+/.test(email.trim());

  const existingEmails = useMemo(
    () => new Set(participants.map(p => (p || '').toLowerCase())),
    [participants]
  );

  const maxParticipants =
    plans[plan as keyof typeof plans]?.maxParticipants || 3;
  const isAtLimit = participants.length >= maxParticipants;

  const handleAddEmail = () => {
    const value = emailInput.trim();
    if (!isValidEmail(value)) return;
    if (existingEmails.has(value.toLowerCase())) return;
    setParticipants((prev: string[]) => [...prev, value]);
    setEmailInput('');
  };

  const handleRemove = (id: string) => {
    setParticipants((prev: string[]) => prev.filter(p => p !== id));
  };

  const handlePublish = async () => {
    // Custom bingo cards: only name, color, count
    const customBingoCards = bingoCards
      .filter(card => card.count > 0 && card.type === 'custom')
      .map(card => ({
        title: card.name,
        color: card.color,
        count: card.count,
      }));
    // Default bingo cards: array of IDs repeated by count
    const defaultBingoCardIds = bingoCards
      .filter(card => card.count > 0 && card.type !== 'custom')
      .flatMap(card => Array(card.count).fill(card.id));
    const challenge: any = {
      title,
      plan,
      duration,
      category_id: categoryId,
      card_size: cardSize,
      is_organizer_participant: isOrganizerParticipant,
      participants,
      custom_cards: customBingoCards,
      default_cards: defaultBingoCardIds,
    };
    try {
      const { data } = await createChallenge(challenge);

      navigation.navigate(SCREEN_NAMES._CREATE_CHALLENGE.CHALLENGE_PUBLISHED, {
        challenge: data,
      });
    } catch (error) {}
  };

  return (
    <View style={styles.container}>
      <Header
        title="Invite Participants"
        step={3}
        totalSteps={3}
        onBack={handleBack}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.participantInfo}>
          <Text style={styles.participantCount}>
            Participants ({participants.length}/{maxParticipants})
          </Text>
          <Text style={styles.planInfo}>{plan} Plan</Text>
        </View>

        <View style={styles.list}>
          {participants.map((item, index) => (
            <View key={item} style={styles.row}>
              <Image
                source={require('../../assets/images/create-challenge/default-avatar.png')}
                style={styles.avatar}
              />
              <Text style={styles.rowText}>{item}</Text>
              <TouchableOpacity
                onPress={() => handleRemove(item)}
                style={styles.deleteBtn}
              >
                <Text style={styles.deleteBtnText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Add email address"
            placeholderTextColor={COLORS.gray.mediumDark}
            value={emailInput}
            onChangeText={setEmailInput}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={handleAddEmail}
          />
          <TouchableOpacity
            style={[
              styles.addButton,
              (!isValidEmail(emailInput) || isAtLimit) &&
                styles.addButtonDisabled,
            ]}
            onPress={handleAddEmail}
            disabled={!isValidEmail(emailInput) || isAtLimit}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Footer>
        <TouchableOpacity style={styles.publishButton} onPress={handlePublish}>
          <Text style={styles.publishButtonText}>Publish & Send Invites</Text>
        </TouchableOpacity>
      </Footer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  participantInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  participantCount: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  planInfo: {
    fontSize: 14,
    color: COLORS.text.secondary,
    textTransform: 'capitalize',
  },
  list: {
    gap: 12,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  rowText: {
    flex: 1,
    color: COLORS.blue.oxford,
  },
  deleteBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtnText: {
    color: COLORS.secondary.purple.mauve_1,
    fontSize: 16,
    lineHeight: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.green.mantis,
    borderRadius: 28,
    paddingLeft: 16,
    paddingRight: 8,
    height: 48,
  },
  input: {
    flex: 1,
    color: COLORS.text.primary,
  },
  addButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.green.mantis,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  addButtonDisabled: {
    opacity: 0.6,
  },
  addButtonText: {
    color: COLORS.green.mantis,
    fontSize: 14,
  },
  publishButton: {
    flex: 1,
    backgroundColor: COLORS.green.forest,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
  },
  publishButtonText: {
    color: COLORS.white,
    fontSize: 14,
  },
});
