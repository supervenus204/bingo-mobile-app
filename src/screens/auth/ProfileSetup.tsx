import { useNavigation } from '@react-navigation/native';
import { getCode, getName } from 'country-list';
import isTimezone from 'is-timezone';
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
import { Button, Input } from '../../components/ui';
import { SCREEN_NAMES } from '../../constants';
import { checkDisplayName, updateProfile } from '../../services';
import { useAuthStore } from '../../store';
import { COLORS, FONTS } from '../../theme';


export const ProfileSetupScreen: React.FC = () => {
  const { setUser } = useAuthStore();

  const [displayName, setDisplayName] = useState('');
  const [country, setCountry] = useState('');
  const [timezone, setTimezone] = useState('');
  const [pushReminders, setPushReminders] = useState(true);
  // Validation states
  const [displayNameValid, setDisplayNameValid] = useState<boolean | undefined>(undefined);
  const [countryValid, setCountryValid] = useState<boolean | undefined>(undefined);
  const [timezoneValid, setTimezoneValid] = useState<boolean | undefined>(undefined);

  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const handleProfilePictureUpload = () => {
    Alert.alert('Profile Picture', 'Profile picture upload functionality would be implemented here');
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
    checkDisplayName(text.trim()).then((available) => {
      setDisplayNameValid(available);
    });
  }, []);

  const changeCountry = (text: string) => {
    const countryCode = getCode(text);
    if (countryCode) {
      const countryName = getName(countryCode) || '';
      setCountry(countryName);
      setCountryValid(true);
    } else {
      setCountry(text);
      setCountryValid(text.trim().length > 0 ? false : undefined);
    }
  };

  const changeTimezone = (text: string) => {
    setTimezone(text);
    if (isTimezone(text)) {
      setTimezoneValid(true);
    } else {
      setTimezoneValid(false);
    }
  };

  const handleSave = () => {
    setLoading(true);
    updateProfile({
      display_name: displayName.trim(),
      country: country.trim(),
      timezone: timezone.trim(),
      push_reminders: pushReminders,
    }).then((data) => {
      setLoading(false);
      setUser(data);
      navigation.navigate(SCREEN_NAMES.DASHBOARD as never);
    }).catch((error) => {
      setLoading(false);
      Alert.alert('Error', error.message);
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.profilePictureContainer}>
        <TouchableOpacity style={styles.profilePicture} onPress={handleProfilePictureUpload}>
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

        <Input
          placeholder="Country (e.g. Australia)"
          value={country}
          onChangeText={changeCountry}
          inputStyle={styles.input}
          isValid={countryValid}
          showValidation={country.trim().length > 0}
        />

        <Input
          placeholder="Timezone (e.g. Australia/Sydney)"
          value={timezone}
          onChangeText={changeTimezone}
          inputStyle={styles.input}
          isValid={timezoneValid}
          showValidation={timezone.trim().length > 0}
        />
      </View>

      <View style={styles.toggleContainer}>
        <Text style={styles.toggleLabel}>Push Reminders?</Text>
        <Switch
          value={pushReminders}
          onValueChange={setPushReminders}
          trackColor={{ false: COLORS.gray.lightMedium, true: COLORS.primary.main }}
          thumbColor={pushReminders ? COLORS.white : COLORS.gray.medium}
        />
      </View>

      <Button
        text="SAVE"
        onPress={handleSave}
        buttonStyle={styles.saveButton}
        textStyle={styles.saveButtonText}
        disabled={loading || !displayNameValid || !countryValid || !timezoneValid}
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
    backgroundColor: COLORS.primary.main,
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 24,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: FONTS.size.lg,
    fontFamily: FONTS.family.poppinsSemiBold,
    textTransform: 'uppercase',
  },
});
