import React, { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Header } from '../../components/play-challenge/Header';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

interface Participant {
  id: string;
  user_id: string | null;
  email: string;
  status: 'joined' | 'pending';
  is_organizer: boolean;
  points: number;
  user: {
    first_name: string | null;
    last_name: string | null;
  } | null;
}

const mockParticipants: Participant[] = [
  {
    id: '4f261e4d-e461-4d92-9261-1170cad017d9',
    user_id: '18039a8d-6040-4650-83de-0025e99eb8d6',
    email: 'supervenus204@proton.me',
    status: 'joined',
    is_organizer: true,
    points: 0,
    user: {
      first_name: 'Jordan',
      last_name: 'chinn',
    },
  },
  {
    id: '0b6886e3-79e4-4e11-942d-319c3cc8a425',
    user_id: null,
    email: 'supervenus204@outlook.com',
    status: 'pending',
    is_organizer: false,
    points: 0,
    user: null,
  },
];

export const Profile: React.FC = () => {
  const [participants] = useState<Participant[]>(mockParticipants);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [emailList, setEmailList] = useState<string[]>([]);
  const isOrganizer = participants.some(p => p.is_organizer);

  const addEmail = () => {
    if (emailInput.trim() && !emailList.includes(emailInput.trim())) {
      setEmailList([...emailList, emailInput.trim()]);
      setEmailInput('');
    }
  };

  const removeEmail = (email: string) => {
    setEmailList(emailList.filter(e => e !== email));
  };

  const sendInvitations = () => {
    Alert.alert('Success', `Invitations sent to ${emailList.length} emails`);
    setEmailList([]);
    setShowInviteModal(false);
  };

  const renderParticipant = (participant: Participant) => {
    if (participant.status === 'joined') {
      return (
        <View key={participant.id} style={styles.participantCard}>
          <View style={styles.participantInfo}>
            <Text style={styles.participantName}>
              {participant.user?.first_name} {participant.user?.last_name}
            </Text>
            <Text style={styles.participantEmail}>{participant.email}</Text>
          </View>
          <View style={styles.participantStats}>
            <Text style={styles.pointsText}>{participant.points} pts</Text>
            {participant.is_organizer && (
              <Text style={styles.organizerBadge}>Organizer</Text>
            )}
          </View>
        </View>
      );
    } else {
      return (
        <View key={participant.id} style={styles.participantCard}>
          <View style={styles.participantInfo}>
            <Text style={styles.pendingEmail}>{participant.email}</Text>
            <Text style={styles.pendingStatus}>Pending</Text>
          </View>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Header title="PARTICIPANTS" current_week={1} />

      <ScrollView style={styles.scrollView}>
        {participants.map(renderParticipant)}
      </ScrollView>

      {isOrganizer && (
        <View style={styles.inviteButtonContainer}>
          <Button
            text="Invite More"
            onPress={() => setShowInviteModal(true)}
            variant="outline"
          />
        </View>
      )}

      <Modal visible={showInviteModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Invite Participants</Text>

            <View style={styles.emailInputContainer}>
              <Input
                placeholder="Enter email address"
                value={emailInput}
                onChangeText={setEmailInput}
              />
              <Button text="Add" onPress={addEmail} />
            </View>

            <ScrollView style={styles.emailListContainer}>
              {emailList.map((email, index) => (
                <View key={index} style={styles.emailItem}>
                  <Text style={styles.emailText}>{email}</Text>
                  <TouchableOpacity onPress={() => removeEmail(email)}>
                    <Text style={styles.removeButton}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>

            <View style={styles.modalButtons}>
              <Button
                text="Cancel"
                onPress={() => setShowInviteModal(false)}
                variant="outline"
              />
              <Button
                text="Send Invitations"
                onPress={sendInvitations}
                disabled={emailList.length === 0}
              />
            </View>
          </View>
        </View>
      </Modal>
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
    padding: 16,
  },
  participantCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  participantEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  pendingEmail: {
    fontSize: 16,
    color: '#333',
  },
  pendingStatus: {
    fontSize: 14,
    color: '#FF6B35',
    marginTop: 4,
  },
  participantStats: {
    alignItems: 'flex-end',
  },
  pointsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  organizerBadge: {
    fontSize: 12,
    color: '#1E3A8A',
    marginTop: 4,
  },
  inviteButtonContainer: {
    padding: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  emailInputContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  emailListContainer: {
    maxHeight: 200,
    marginBottom: 20,
  },
  emailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  emailText: {
    flex: 1,
    fontSize: 14,
  },
  removeButton: {
    fontSize: 18,
    color: '#FF6B35',
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
});
