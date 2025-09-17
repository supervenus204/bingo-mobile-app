import React, { useState } from 'react';
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

export const SignInScreen: React.FC = () => {
  const [email, setEmail] = useState('seniordev55@gmail.com');
  const [password, setPassword] = useState('password');

  const { signIn, loading, error, token, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const navigation = useNavigation();

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigation.navigate(SCREEN_NAMES.DASHBOARD as never);
  //   }
  // }, [isAuthenticated]);

  const handleSubmit = async () => {
    try {
      await signIn(email, password);

      navigation.navigate(SCREEN_NAMES.DASHBOARD as never);
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Something went wrong',
        'error'
      );
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      showToast('Google Sign In functionality will be implemented', 'info');
    } catch (err) {
      showToast('Google Sign In failed', 'error');
    }
  };

  const handleForgotPassword = () => {
    showToast('Password reset link will be sent to your email', 'info');
  };

  const handleCreateAccount = () => {
    navigation.navigate(SCREEN_NAMES._AUTH.SIGN_UP as never);
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
          <Text style={styles.title}>SIGN IN</Text>
        </View>

        <View style={styles.form}>
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

          {/* Forgot Password */}
          {/* <TouchableOpacity
            style={styles.forgotPasswordContainer}
            onPress={handleForgotPassword}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity> */}

          <Button
            text="Sign In"
            onPress={handleSubmit}
            buttonStyle={styles.submitButton}
            textStyle={styles.submitButtonText}
            disabled={!email || !password}
            loading={loading}
          />

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google Sign In */}
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleSignIn}
          >
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          {/* Create Account Section */}
          <View style={styles.createAccountContainer}>
            <Text style={styles.createAccountText}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={handleCreateAccount}>
              <Text style={styles.createAccountLink}>Create one</Text>
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
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: -8,
    marginBottom: 8,
  },
  forgotPasswordText: {
    color: COLORS.blue.indigo,
    fontFamily: FONTS.family.poppinsMedium,
    fontSize: 14,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.gray.mediumDark,
  },
  dividerText: {
    marginHorizontal: 6,
    color: COLORS.gray.mediumDark,
    fontFamily: FONTS.family.poppinsMedium,
    fontSize: 12,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray.mediumDark,
    borderRadius: 999,
    paddingVertical: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4285F4',
    marginRight: 12,
  },
  googleButtonText: {
    color: COLORS.gray.dark,
    fontFamily: FONTS.family.poppinsMedium,
    fontSize: 14,
  },
  createAccountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createAccountText: {
    color: COLORS.gray.mediumDark,
    fontFamily: FONTS.family.poppinsRegular,
    fontSize: 14,
  },
  createAccountLink: {
    color: COLORS.blue.indigo,
    fontFamily: FONTS.family.poppinsBold,
    fontSize: 14,
  },
  bottomSpacing: {
    height: 24,
  },
});
