import React, { useState } from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../../theme';

const MODAL_OVERLAY_BACKGROUND = `${COLORS.black}80`;

interface BingoCardPlayProps {
  name: string;
  status?: 'mark' | 'unmark' | 'check' | null;
  onStatusChange?: (status: string) => void;
}

export const BingoCardPlay: React.FC<BingoCardPlayProps> = ({
  name,
  status,
  onStatusChange,
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleAction = (newStatus: string) => {
    onStatusChange?.(newStatus);
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.touchableArea}
        onPress={() => {
          if (status === 'unmark') {
            onStatusChange?.('mark');
          } else if (status === 'mark') {
            onStatusChange?.('check');
          } else if (status === 'check') {
            setShowModal(true);
          }
        }}
        delayLongPress={500}
      >
        {status === 'check' ? (
          <Image
            source={require('../../../assets/images/bingocard/mark.png')}
            style={styles.markImage}
          />
        ) : (
          <Text style={styles.text}>{name}</Text>
        )}
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{name}</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCancel}
              >
                <MaterialIcons name="close" size={20} color={COLORS.gray.darker} />
                <Text style={[styles.modalButtonText, styles.cancelButtonText]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.unmarkButton]}
                onPress={() => handleAction('unmark')}
              >
                <MaterialIcons name="undo" size={20} color={COLORS.white} />
                <Text style={[styles.modalButtonText, styles.actionButtonText]}>Unmark</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.markButton]}
                onPress={() => handleAction('mark')}
              >
                <MaterialIcons name="radio-button-unchecked" size={20} color={COLORS.white} />
                <Text style={[styles.modalButtonText, styles.actionButtonText]}>Mark</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  touchableArea: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.blue.oxford,
    textAlign: 'center',
    lineHeight: 16,
  },
  markImage: {
    width: '100%',
    height: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: MODAL_OVERLAY_BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.blue.oxford,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    width: '100%',
    gap: 12,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 10,
    gap: 8,
  },
  cancelButton: {
    backgroundColor: COLORS.gray.light,
  },
  unmarkButton: {
    backgroundColor: COLORS.gray.darker,
  },
  markButton: {
    backgroundColor: COLORS.blue.oxford,
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: COLORS.gray.darker,
  },
  actionButtonText: {
    color: COLORS.white,
  },
});
