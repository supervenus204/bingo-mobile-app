import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LoadingCard } from '../../components/common';
import { Header } from '../../components/play-challenge/Header';
import { InviteModal } from '../../components/play-challenge/InviteModal';
import { ParticipantCard } from '../../components/play-challenge/ParticipantCard';
import { ParticipantDetailModal } from '../../components/play-challenge/ParticipantDetailModal';
import { fetchParticipants } from '../../services/participant.service';
import { useChallengesStore } from '../../store/challenges.store';

export interface Participant {
  id: string;
  user_id: string | null;
  email: string;
  status: 'joined' | 'pending';
  is_organizer: boolean;
  points: number;
  wild_cards: number;
  joined_at?: string;
  user: {
    first_name: string | null;
    last_name: string | null;
    display_name?: string | null;
    country?: string | null;
    timezone?: string | null;
    image?: string | null;
  } | null;
}

export const UserManagement: React.FC = () => {
  const { currentChallenge } = useChallengesStore();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    if (currentChallenge?.id) {
      loadParticipants();
    }
  }, [currentChallenge?.id]);

  const loadParticipants = async () => {
    try {
      setLoading(true);
      const data = await fetchParticipants(currentChallenge!.id);
      setParticipants(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load participants');
    } finally {
      setLoading(false);
    }
  };

  const handleParticipantPress = (participant: Participant) => {
    setSelectedParticipant(participant);
    setShowDetailModal(true);
  };

  const joinedParticipants = useMemo(() => participants.filter(p => p.status === 'joined'), [participants]);
  const pendingParticipants = useMemo(() => participants.filter(p => p.status === 'pending'), [participants]);

  return (
    <View style={styles.container}>
      <Header title="PARTICIPANTS" current_week={currentChallenge?.current_week || 1} />

      {loading && (
        <LoadingCard visible={loading} message="Loading participants..." />
      )}

      <ScrollView style={styles.scrollView}>
        {joinedParticipants.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Joined Participants</Text>
            {joinedParticipants.map(participant => (
              <ParticipantCard
                key={participant.id}
                participant={participant}
                onPress={() => handleParticipantPress(participant)}
              />
            ))}
          </>
        )}

        {pendingParticipants.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Pending Participants</Text>
            {pendingParticipants.map(participant => (
              <ParticipantCard
                key={participant.id}
                participant={participant}
                onPress={() => handleParticipantPress(participant)}
              />
            ))}
          </>
        )}
      </ScrollView>

      <View style={styles.inviteButtonContainer}>
        <TouchableOpacity
          style={styles.inviteMoreButton}
          onPress={() => setShowInviteModal(true)}
        >
          <Text style={styles.inviteMoreButtonText}>Invite More</Text>
        </TouchableOpacity>
      </View>

      <InviteModal
        participants={participants}
        visible={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onSuccess={loadParticipants}
      />

      <ParticipantDetailModal
        visible={showDetailModal}
        participant={selectedParticipant}
        onClose={() => setShowDetailModal(false)}
        onRemove={loadParticipants}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 12,
    marginLeft: 16,
  },
  inviteButtonContainer: {
    padding: 16,
  },
  inviteMoreButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
  },
  inviteMoreButtonText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
});
