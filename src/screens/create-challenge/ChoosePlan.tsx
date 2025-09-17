import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { PriceCard } from '../../components/create-challenge/price-card.component';
import { SCREEN_NAMES } from '../../constants/screens';
import { plans } from '../../data/plans';
import { useCreateStore } from '../../store';

const pricingPlans = Object.values(plans).map(plan => ({
  ...plan,
  buttonText: plan.id === 'free' ? 'Start Free' : 'Select Plan',
  bgColor:
    plan.id === 'free'
      ? '#FFFFFF'
      : plan.id === 'premium'
      ? '#E8F5E8'
      : '#F3E8FF',
  borderColor:
    plan.id === 'free'
      ? '#E0F2FE'
      : plan.id === 'premium'
      ? '#C8E6C9'
      : '#E9D5FF',
  titleColor:
    plan.id === 'free'
      ? '#374151'
      : plan.id === 'premium'
      ? '#166534'
      : '#7C3AED',
}));

export const ChoosePlan: React.FC = () => {
  const navigation = useNavigation();
  const { setPlan } = useCreateStore();
  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.priceCardsContainer}>
          {pricingPlans.map(plan => (
            <PriceCard
              key={plan.id}
              title={plan.title}
              price={plan.price}
              features={plan.features}
              buttonText={plan.buttonText}
              bgColor={plan.bgColor}
              borderColor={plan.borderColor}
              titleColor={plan.titleColor}
              onPress={() => {
                setPlan(plan.id);
                navigation.navigate(
                  SCREEN_NAMES._CREATE_CHALLENGE.DEFINE_CHALLENGE as never
                );
              }}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  priceCardsContainer: {
    gap: 10,
  },
});
