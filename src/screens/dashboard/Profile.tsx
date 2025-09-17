import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import { Avatar } from '../../components/common';
import { Button, Input } from '../../components/ui';
import { useUser } from '../../hooks';
import { COLORS, FONTS } from '../../theme';

export const Profile: React.FC = () => {
  const { user, updateProfile, loading, error, clearError } = useUser();
  const [country, setCountry] = useState<string>('');
  const [isEditMode, setIsEditMode] = useState(false);

  // Form states
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setCountry(user.country || '');
    }
  }, [user]);

  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        firstName,
        lastName,
        country,
      });
    } catch (err) {
      // Error is handled in useUser hook
    }
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    if (isEditMode) {
      // Reset form values when canceling edit
      setFirstName(user?.firstName || '');
      setLastName(user?.lastName || '');
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No user data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <Avatar
          firstName={user.firstName as string}
          lastName={user.lastName as string}
          image={user.image as string}
          size={80}
        />

        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {user.firstName || ''} {user.lastName || ''}
          </Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
      </View>

      {isEditMode ? (
        <>
          <View style={styles.inputContainer}>
            <Text style={styles.sectionTitle}>First Name</Text>
            <Input
              inputStyle={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter your first name"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.sectionTitle}>Last Name</Text>
            <Input
              inputStyle={styles.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Enter your last name"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.sectionTitle}>Country</Text>
            <CountryPicker
              {...{
                countryCode: country as any,
                withFilter: true,
                withFlag: true,
                withCountryNameButton: true,
                withAlphaFilter: false,
                withCallingCode: false,
                withEmoji: true,
                onSelect: country => setCountry(country.cca2),
              }}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button
              text="Cancel"
              onPress={toggleEditMode}
              buttonStyle={styles.cancelButton}
              textStyle={styles.cancelButtonText}
              variant="outline"
            />
            <Button
              text={loading ? 'Saving...' : 'Save'}
              onPress={handleSaveProfile}
              buttonStyle={styles.saveButton}
              textStyle={styles.saveButtonText}
              disabled={loading}
            />
          </View>
        </>
      ) : (
        <View style={styles.viewMode}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>First Name</Text>
            <Text style={styles.infoValue}>{user.firstName || 'Not set'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Last Name</Text>
            <Text style={styles.infoValue}>{user.lastName || 'Not set'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Country</Text>
            <Text style={styles.infoValue}>
              {country ? `${country}` : 'Not selected'}
            </Text>
          </View>

          <Button
            text="Edit Profile"
            onPress={toggleEditMode}
            buttonStyle={styles.editButton}
            textStyle={styles.editButtonText}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  userInfo: {
    alignItems: 'center',
    marginTop: 16,
  },
  userName: {
    fontSize: FONTS.size['2xl'],
    fontFamily: FONTS.family.poppinsBold,
    color: COLORS.black,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: FONTS.size.base,
    fontFamily: FONTS.family.poppinsRegular,
    color: COLORS.text.secondary,
  },
  countrySection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: FONTS.size.sm,
    fontFamily: FONTS.family.poppinsMedium,
    color: COLORS.black,
  },
  errorText: {
    fontSize: FONTS.size.base,
    fontFamily: FONTS.family.poppinsRegular,
    color: COLORS.red.bright,
    textAlign: 'center',
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.gray.mediumDark,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontFamily: FONTS.family.poppinsMedium,
    backgroundColor: COLORS.white,
    fontSize: 14,
  },
  inputContainer: {
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.green.forest,
    borderRadius: 8,
    paddingVertical: 12,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: FONTS.size.base,
    fontFamily: FONTS.family.poppinsSemiBold,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.gray.medium,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingVertical: 12,
  },
  cancelButtonText: {
    color: COLORS.gray.darker,
    fontSize: FONTS.size.base,
    fontFamily: FONTS.family.poppinsSemiBold,
  },
  editButton: {
    backgroundColor: COLORS.green.forest,
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 20,
  },
  editButtonText: {
    color: COLORS.white,
    fontSize: FONTS.size.base,
    fontFamily: FONTS.family.poppinsSemiBold,
  },
  viewMode: {
    marginTop: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray.light,
  },
  infoLabel: {
    fontSize: FONTS.size.base,
    fontFamily: FONTS.family.poppinsMedium,
    color: COLORS.text.primary,
  },
  infoValue: {
    fontSize: FONTS.size.base,
    fontFamily: FONTS.family.poppinsRegular,
    color: COLORS.text.secondary,
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
});
