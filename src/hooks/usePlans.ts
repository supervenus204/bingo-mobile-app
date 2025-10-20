import { useCallback, useEffect, useMemo } from 'react';
import { SubscriptionPlan, usePlansStore } from '../store/plans.store';

export const usePlans = () => {
  const {
    plans,
    loading,
    error,
    fetchPlans,
    clearError,
  } = usePlansStore();

  const loadPlans = useCallback(async () => {
    await fetchPlans();
  }, [fetchPlans]);

  const getPlanById = useCallback((planId: string): SubscriptionPlan | undefined => {
    return plans?.find(plan => plan.id === planId);
  }, [plans]);

  const formatPrices = useMemo(() => {
    const formattedPlans = plans?.map(plan => ({
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
    return formattedPlans;
  }, [plans]);

  useEffect(() => {
    if (plans === null) {
      loadPlans();
    }
  }, [plans, loadPlans]);

  return {
    // Data
    plans,
    formatPrices,
    loading,
    error,

    // Actions
    loadPlans,
    clearError,

    // Getters
    getPlanById,
  };
};
