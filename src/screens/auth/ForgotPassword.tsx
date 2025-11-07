import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { AuthLogo } from '../../components/auth';
import { CustomButton, Input } from '../../components/common';
import { SCREEN_NAMES } from '../../constants';
import { useAuth, useToast } from '../../hooks';
import { COLORS, FONTS } from '../../theme';
import type { AuthStackParamList } from '../../types/navigation.type';

export const ForgotPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { sendVerificationCode, loading } = useAuth();
  const { showToast } = useToast();
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const isFormValid = useMemo(
    () => email && newPassword && confirmPassword,
    [email, newPassword, confirmPassword]
  );

  const handleSubmit = async () => {
    if (!isFormValid) {
      showToast('Please fill all fields', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    try {
      await sendVerificationCode(email, 'password_reset');

      navigation.navigate(SCREEN_NAMES._AUTH.VERIFY_CODE, {
        email: email,
        type: 'password_reset',
        password: newPassword,
      });
    } catch (err) {
      showToast(
        err instanceof Error
          ? err.message
          : 'Failed to send password reset code',
        'error'
      );
    }
  };

  const handleBackToSignIn = () => {
    navigation.navigate(SCREEN_NAMES._AUTH.SIGN_IN);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: 'height' })}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <AuthLogo />

        <View style={styles.header}>
          <Text style={styles.title}>RESET PASSWORD</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.instructionText}>
            Enter your email and new password. We'll send a verification code to
            your email to confirm the password reset.
          </Text>

          <Input
            placeholder="Enter your email ..."
            value={email}
            onChangeText={setEmail}
            inputStyle={styles.input}
            keyboardType="email-address"
          />

          <Input
            placeholder="Enter new password ..."
            value={newPassword}
            onChangeText={setNewPassword}
            inputStyle={styles.input}
            secureTextEntry
          />

          <Input
            placeholder="Confirm new password ..."
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            inputStyle={styles.input}
            secureTextEntry
          />

          <CustomButton
            text="Send Verification Code"
            onPress={handleSubmit}
            buttonStyle={styles.submitButton}
            textStyle={styles.submitButtonText}
            disabled={!isFormValid}
            loading={loading}
          />

          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Remember your password? </Text>
            <CustomButton
              text="Sign In"
              onPress={handleBackToSignIn}
              variant="default"
              buttonStyle={styles.signInButton}
              textStyle={styles.signInButtonText}
            />
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </KeyboardAvoidingView>
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
    justifyContent: 'center',
    paddingHorizontal: 24,
    padding: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: FONTS.family.poppinsBold,
    color: COLORS.blue.indigo,
    fontSize: 28,
  },
  form: {
    gap: 12,
  },
  instructionText: {
    fontSize: 14,
    color: COLORS.gray.dark,
    fontFamily: FONTS.family.poppinsRegular,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 20,
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
  signInButton: {
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  signInButtonText: {
    color: COLORS.blue.indigo,
    fontFamily: FONTS.family.poppinsBold,
    fontSize: 14,
  },
  bottomSpacing: {
    height: 48,
  },
});
