import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, FONTS } from '../../theme';

interface PriceCardProps {
  title: string;
  description: string;
  features: string[];
  buttonText: string;
  bgColor: string;
  borderColor: string;
  price: number;
  titleColor: string;
  onPress: () => void;
}

export const PriceCard: React.FC<PriceCardProps> = ({
  title,
  description,
  features,
  buttonText,
  bgColor,
  borderColor,
  price,
  titleColor,
  onPress,
}) => {
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: bgColor, borderColor: borderColor },
      ]}
    >
      {/* Price in right-top corner */}
      <View style={styles.priceContainer}>
        <Text style={styles.price}>${price}</Text>
      </View>

      <Text style={[styles.title, { color: titleColor }]}>{title}</Text>

      <Text style={styles.description}>{description}</Text>

      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <Text key={index} style={styles.feature}>
            • {feature}
          </Text>
        ))}
      </View>

      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={onPress}
      >
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
  },
  title: {
    fontSize: 22,
    fontFamily: FONTS.family.poppinsBold,
    marginBottom: 10,
    textAlign: 'left',
  },
  description: {
    fontSize: 18,
    color: COLORS.gray.veryDark,
    marginBottom: 12,
    textAlign: 'left',
    lineHeight: 20,
  },
  featuresContainer: {
    marginBottom: 10,
  },
  feature: {
    fontSize: 16,
    color: COLORS.gray.dark,
    marginBottom: 8,
    textAlign: 'left',
    lineHeight: 20,
  },
  button: {
    backgroundColor: COLORS.primary.green.forest,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  priceContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  price: {
    color: COLORS.blue.oxford,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
