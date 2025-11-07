import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import { CustomButton, Input, TimezonePicker } from '../../components/common';
import { SCREEN_NAMES } from '../../constants';
import { checkDisplayName, updateProfile } from '../../services';
import { useAuthStore } from '../../store';
import { COLORS, FONTS } from '../../theme';

export const ProfileSetupScreen: React.FC = () => {
  const { setUser } = useAuthStore();

  const [displayName, setDisplayName] = useState('');
  const [country, setCountry] = useState<string>('');
  const [timezone, setTimezone] = useState('');
  const [pushReminders, setPushReminders] = useState(true);
  // Validation states
  const [displayNameValid, setDisplayNameValid] = useState<boolean | undefined>(
    undefined
  );

  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const handleProfilePictureUpload = () => {
    Alert.alert(
      'Profile Picture',
      'Profile picture upload functionality would be implemented here'
    );
  };

  const changeDisplayName = useCallback((text: string) => {
    setDisplayName(text);
    if (text.trim().length === 0) {
      setDisplayNameValid(false);
      return;
    }
    if (text.trim() !== text) {
      setDisplayNameValid(false);
      return;
    }
    checkDisplayName(text.trim()).then(available => {
      setDisplayNameValid(available);
    });
  }, []);

  const handleCountrySelect = (selectedCountry: { cca2: string }) => {
    setCountry(selectedCountry.cca2);
  };

  const handleTimezoneSelect = (selectedTimezone: string) => {
    setTimezone(selectedTimezone);
  };

  const handleSave = () => {
    setLoading(true);
    updateProfile({
      display_name: displayName.trim(),
      country: country,
      timezone: timezone.trim(),
      push_reminders: pushReminders,
    })
      .then(data => {
        setLoading(false);
        setUser(data);
        navigation.navigate(SCREEN_NAMES.DASHBOARD as never);
      })
      .catch(error => {
        setLoading(false);
        Alert.alert('Error', error.message);
      });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.profilePictureContainer}>
        <TouchableOpacity
          style={styles.profilePicture}
          onPress={handleProfilePictureUpload}
        >
          <View style={styles.uploadIcon}>
            <Text style={styles.uploadIconText}>↑</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Profile set up</Text>

      <View style={styles.formContainer}>
        <Input
          placeholder="Display Name"
          value={displayName}
          onChangeText={changeDisplayName}
          inputStyle={styles.input}
          isValid={displayNameValid}
          showValidation={displayName.trim().length > 0}
        />

        <View style={styles.countryContainer}>
          <Text style={styles.countryLabel}>Country</Text>
          <CountryPicker
            {...{
              countryCode: country as any,
              withFilter: true,
              withFlag: true,
              withCountryNameButton: true,
              withAlphaFilter: false,
              withCallingCode: false,
              withEmoji: true,
              onSelect: handleCountrySelect,
            }}
          />
        </View>

        <View style={styles.timezoneContainer}>
          <Text style={styles.timezoneLabel}>Timezone</Text>
          <TimezonePicker
            value={timezone}
            onSelect={handleTimezoneSelect}
            placeholder="Select timezone"
          />
        </View>
      </View>

      <View style={styles.toggleContainer}>
        <Text style={styles.toggleLabel}>Push Reminders?</Text>
        <Switch
          value={pushReminders}
          onValueChange={setPushReminders}
          trackColor={{
            false: COLORS.gray.lightMedium,
            true: COLORS.primary.main,
          }}
          thumbColor={pushReminders ? COLORS.white : COLORS.gray.medium}
        />
      </View>

      <CustomButton
        text="SAVE"
        onPress={handleSave}
        buttonStyle={styles.saveButton}
        textStyle={styles.saveButtonText}
        disabled={loading || !displayNameValid || !country || !timezone}
        loading={loading}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.gray.lightMedium,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.gray.medium,
  },
  uploadIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.gray.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadIconText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  title: {
    fontSize: FONTS.size['2xl'],
    fontFamily: FONTS.family.poppinsBold,
    color: COLORS.primary.blue.oxford,
    textAlign: 'center',
    marginBottom: 32,
  },
  formContainer: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.gray.lightMedium,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
    fontSize: FONTS.size.base,
    fontFamily: FONTS.family.poppinsRegular,
    color: COLORS.text.primary,
  },
  countryContainer: {
    marginBottom: 16,
  },
  countryLabel: {
    fontSize: FONTS.size.sm,
    fontFamily: FONTS.family.poppinsMedium,
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  timezoneContainer: {
    marginBottom: 16,
  },
  timezoneLabel: {
    fontSize: FONTS.size.sm,
    fontFamily: FONTS.family.poppinsMedium,
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 4,
  },
  toggleLabel: {
    fontSize: FONTS.size.base,
    fontFamily: FONTS.family.poppinsMedium,
    color: COLORS.text.primary,
  },
  saveButton: {
    height: 48,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: FONTS.size.lg,
    fontFamily: FONTS.family.poppinsSemiBold,
    textTransform: 'uppercase',
  },
});
