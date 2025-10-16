import React, { useMemo, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, Input } from '../../components/ui';
import { COLORS, FONTS } from '../../theme';

import { useNavigation } from '@react-navigation/native';
import { SCREEN_NAMES } from '../../constants';
import { useAuth } from '../../hooks';
import { useToast } from '../../hooks/useToast';

export const SignUpScreen: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const { signUp, loading } = useAuth();
  const { showToast } = useToast();
  const navigation = useNavigation();

  const isFormValid = useMemo(() => firstName && lastName && email && password && confirmPassword && agreeTerms, [firstName, lastName, email, password, confirmPassword, agreeTerms]);

  const handleSubmit = async () => {
    if (!isFormValid) {
      showToast('Please fill all fields and agree to terms', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    try {
      await signUp(firstName, lastName, email, password);
      showToast('Account created successfully!', 'success');
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Something went wrong',
        'error'
      );
    }
  };

  const handleSignInNavigation = () => {
    navigation.navigate(SCREEN_NAMES._AUTH.SIGN_IN as never);
  };

  const toggleTermsAgreement = () => {
    setAgreeTerms(!agreeTerms);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Image
            source={require('../../assets/images/auth/signin-logo.png')}
            style={styles.logo}
          />
          <Text style={styles.title}>SIGN UP</Text>
        </View>

        <View style={styles.form}>
          <Input
            placeholder="Enter your first name ..."
            value={firstName}
            onChangeText={setFirstName}
            inputStyle={styles.input}
          />

          <Input
            placeholder="Enter your last name ..."
            value={lastName}
            onChangeText={setLastName}
            inputStyle={styles.input}
          />

          <Input
            placeholder="Enter your email ..."
            value={email}
            onChangeText={setEmail}
            inputStyle={styles.input}
          />

          <Input
            placeholder="Enter your password ..."
            value={password}
            onChangeText={setPassword}
            inputStyle={styles.input}
            secureTextEntry
          />

          <Input
            placeholder="Confirm your password ..."
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            inputStyle={styles.input}
            secureTextEntry
          />

          {/* Terms and Policy Agreement */}
          <TouchableOpacity
            style={styles.termsContainer}
            onPress={toggleTermsAgreement}
          >
            <View
              style={[styles.checkbox, agreeTerms && styles.checkboxChecked]}
            >
              {agreeTerms && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.termsText}>
              I agree to the{' '}
              <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>

          <Button
            text="Sign Up"
            onPress={handleSubmit}
            buttonStyle={styles.submitButton}
            textStyle={styles.submitButtonText}
            disabled={!isFormValid}
            loading={loading}
          />

          {/* Sign In Section */}
          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Already have an account? </Text>
            <TouchableOpacity onPress={handleSignInNavigation}>
              <Text style={styles.signInLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 12,
    marginBottom: 8,
  },
  title: {
    fontFamily: FONTS.family.poppinsBold,
    color: COLORS.blue.indigo,
    fontSize: 28,
  },
  form: {
    gap: 12,
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
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 6,
    paddingHorizontal: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: COLORS.gray.mediumDark,
    borderRadius: 4,
    marginRight: 12,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.green.forest,
    borderColor: COLORS.green.forest,
  },
  checkmark: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.gray.dark,
    fontFamily: FONTS.family.poppinsRegular,
    lineHeight: 20,
  },
  termsLink: {
    color: COLORS.blue.indigo,
    fontFamily: FONTS.family.poppinsMedium,
  },
  submitButton: {
    backgroundColor: COLORS.green.forest,
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  submitButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.family.poppinsMedium,
    fontSize: 14,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  signInText: {
    color: COLORS.gray.mediumDark,
    fontFamily: FONTS.family.poppinsRegular,
    fontSize: 14,
  },
  signInLink: {
    color: COLORS.blue.indigo,
    fontFamily: FONTS.family.poppinsBold,
    fontSize: 14,
  },
  bottomSpacing: {
    height: 24,
  },
});
