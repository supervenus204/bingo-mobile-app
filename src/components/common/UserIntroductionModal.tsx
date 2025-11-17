import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS } from '../../theme';
import { ChatSender } from '../../types/chat.type';
import { CustomButton } from './Button';
import { Modal } from './Modal';
import { ProfileIcon } from './ProfileIcon';

interface UserIntroductionModalProps {
  visible: boolean;
  user: ChatSender | null;
  onClose: () => void;
}

export const UserIntroductionModal: React.FC<UserIntroductionModalProps> = ({
  visible,
  user,
  onClose,
}) => {
  if (!user) return null;

  const initials = (user?.first_name?.[0] || '') + (user?.last_name?.[0] || '');
  const fullName =
    user.first_name && user.last_name
      ? `${user.first_name} ${user.last_name}`
      : user.display_name || 'User';

  return (
    <Modal visible={visible} onClose={onClose} widthPercentage={80}>
      <View style={styles.profileSection}>
        <ProfileIcon
          image={user.image ?? null}
          initialsText={initials || fullName}
          size={80}
        />
        <Text style={styles.userName}>{fullName}</Text>
      </View>

      <View style={styles.detailSection}>
        {user.display_name && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Display Name:</Text>
            <Text
              style={styles.detailValue}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {user.display_name}
            </Text>
          </View>
        )}

        {user.country && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Country:</Text>
            <Text
              style={styles.detailValue}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {user.country}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.modalButtons}>
        <CustomButton
          text="Close"
          onPress={onClose}
          buttonStyle={styles.closeButton}
          textStyle={styles.closeButtonText}
          variant="primary"
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary.blue,
    fontFamily: FONTS.family.poppinsBold,
    marginTop: 12,
    textAlign: 'center',
  },
  detailSection: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray.lightMedium,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary.blue,
    fontFamily: FONTS.family.poppinsSemiBold,
    flexShrink: 0,
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.gray.mediumDark,
    fontFamily: FONTS.family.poppinsRegular,
    flex: 1,
    textAlign: 'right',
    marginLeft: 12,
    flexShrink: 1,
  },
  modalButtons: {
    marginTop: 8,
  },
  closeButton: {
    borderRadius: 999,
    paddingVertical: 14,
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: FONTS.family.poppinsSemiBold,
  },
});
