import { Image, StyleSheet, View } from 'react-native';

export const AuthLogo = () => {
  return (
    <View style={styles.logoContainer}>
      <Image
        source={require('../../assets/images/auth/logo.png')}
        style={styles.logo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },
});
