import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { TitleInput } from '../../components/challenge';
import { BoardLayout } from '../../components/challenge/BoardLayout';
import { CustomButton, Input, LoadingCard } from '../../components/common';
import { PlanButton } from '../../components/play-challenge/PlanButton';
import { boardLayoutOptions } from '../../constants';
import { useCategories, usePlans } from '../../hooks';
import { updateChallenge } from '../../services';
import { useChallengesStore } from '../../store';
import { COLORS, FONTS } from '../../theme';

export const SettingsScreen: React.FC = () => {
  const { selectedChallenge, selectChallenge } = useChallengesStore();
  const { plans, getPlanById } = usePlans();
  const { categories } = useCategories();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: selectedChallenge?.title || '',
    plan: selectedChallenge?.plan || '',
    cardSize: selectedChallenge?.card_size || 16,
    duration: selectedChallenge?.duration || 12,
  });

  const isOrganizer = selectedChallenge?.is_organizer;
  const category = categories?.find(
    cat => cat.id === selectedChallenge?.category_id
  );

  useEffect(() => {
    if (selectedChallenge) {
      setFormData({
        title: selectedChallenge.title,
        plan: selectedChallenge.plan,
        cardSize: selectedChallenge.card_size,
        duration: selectedChallenge.duration,
      });
    }
  }, [selectedChallenge]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await updateChallenge(selectedChallenge?.id as string, {
        ...(formData.title !== selectedChallenge?.title && {
          title: formData.title,
        }),
        ...(formData.plan !== selectedChallenge?.plan && {
          plan: formData.plan,
        }),
        ...(formData.cardSize !== selectedChallenge?.card_size && {
          card_size: formData.cardSize,
        }),
        ...(formData.duration !== selectedChallenge?.duration && {
          duration: formData.duration,
        }),
      });

      selectChallenge(selectedChallenge?.id as string);

      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update challenge settings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      title: selectedChallenge?.title || '',
      plan: selectedChallenge?.plan || '',
      cardSize: selectedChallenge?.card_size || 16,
      duration: selectedChallenge?.duration || 12,
    });
    setIsEditing(false);
  };

  const handleDurationChange = (increment: boolean) => {
    const maxWeeks = getPlanById(formData.plan)?.maxWeek || 12;
    if (increment) {
      setFormData(prev => ({
        ...prev,
        duration: Math.min(prev.duration + 1, maxWeeks),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        duration: Math.max(prev.duration - 1, 1),
      }));
    }
  };

  const handleLayoutSelect = (layoutId: number) => {
    setFormData(prev => ({
      ...prev,
      cardSize: layoutId,
    }));
  };

  const renderField = (label: string, value: string | number) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  );

  const renderEditableField = (
    label: string,
    value: string,
    onChange: (value: string) => void
  ) => (
    <View style={styles.fieldContainer}>
      <Input
        label={label}
        value={value}
        onChangeText={onChange}
        inputStyle={styles.input}
      />
    </View>
  );

  const renderPlanSelector = () => {
    const currentPlan = getPlanById(formData.plan);
    const isCurrentPlanFree = currentPlan?.price === 0;

    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Plan</Text>
        <View style={styles.planContainer}>
          {plans?.map(plan => (
            <PlanButton
              key={plan.id}
              label={plan.name}
              isSelected={formData.plan === plan.id}
              isCurrentPlanFree={isCurrentPlanFree}
              onPress={() => setFormData(prev => ({ ...prev, plan: plan.id }))}
            />
          ))}
        </View>
      </View>
    );
  };

  const renderDurationSelector = () => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>Duration</Text>
      <View style={styles.durationContainer}>
        <TouchableOpacity
          style={styles.durationButton}
          onPress={() => handleDurationChange(false)}
        >
          <Text
            style={[
              styles.durationButtonText,
              {
                color:
                  formData.duration === 1
                    ? COLORS.gray.medium
                    : COLORS.text.primary,
              },
            ]}
          >
            -
          </Text>
        </TouchableOpacity>

        <View style={styles.durationDisplay}>
          <Text style={styles.durationValue}>{formData.duration}</Text>
          <Text style={styles.durationUnit}>weeks</Text>
        </View>

        <TouchableOpacity
          style={styles.durationButton}
          onPress={() => handleDurationChange(true)}
        >
          <Text
            style={[
              styles.durationButtonText,
              {
                color:
                  formData.duration ===
                  (getPlanById(formData.plan)?.maxWeek || 12)
                    ? COLORS.gray.medium
                    : COLORS.text.primary,
              },
            ]}
          >
            +
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCardSizeSelector = () => (
    <BoardLayout cardSize={formData.cardSize} onPress={handleLayoutSelect} />
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {isEditing ? (
          <>
            {/* Edit Mode */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Edit Challenge Settings</Text>
              <TitleInput
                title={formData.title}
                isEditable={true}
                setTitle={value =>
                  setFormData(prev => ({ ...prev, title: value }))
                }
              />
              {renderField('Category', category?.name || '')}
              {renderPlanSelector()}
              {renderDurationSelector()}
              {renderCardSizeSelector()}
            </View>

            <View style={styles.buttonGroup}>
              <CustomButton
                text="Cancel"
                onPress={handleCancel}
                variant="outline"
                buttonStyle={styles.cancelButton}
              />
              <CustomButton
                text="Save Changes"
                onPress={handleSave}
                variant="primary"
                buttonStyle={styles.saveButton}
                loading={loading}
              />
            </View>
          </>
        ) : (
          <>
            {/* View Mode */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Challenge Details</Text>
              {renderField('Title', selectedChallenge?.title || '')}
              {renderField('Category', category?.name || '')}
              {renderField(
                'Plan',
                getPlanById(selectedChallenge?.plan || '')?.name || ''
              )}
              {renderField(
                'Duration',
                `${selectedChallenge?.duration || 0} weeks`
              )}
              {renderField(
                'Card Size',
                boardLayoutOptions.find(
                  l => l.id === selectedChallenge?.card_size
                )?.size || ''
              )}
            </View>

            {isOrganizer && (
              <View style={styles.buttonGroup}>
                <CustomButton
                  text="Edit Settings"
                  onPress={() => setIsEditing(true)}
                  variant="primary"
                  buttonStyle={styles.editButton}
                />
              </View>
            )}
          </>
        )}
      </ScrollView>

      <LoadingCard
        visible={loading}
        message="Updating challenge settings..."
        subMessage="Please wait a moment"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  section: {
    backgroundColor: COLORS.primary.white,
    borderRadius: 12,
    padding: 20,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.family.poppinsBold,
    color: COLORS.text.primary,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontFamily: FONTS.family.poppinsMedium,
    color: COLORS.text.secondary,
    marginBottom: 8,
  },
  fieldValue: {
    fontSize: 16,
    fontFamily: FONTS.family.poppinsRegular,
    color: COLORS.text.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.gray.light,
    borderRadius: 8,
  },
  input: {
    backgroundColor: COLORS.primary.white,
    borderWidth: 1,
    borderColor: COLORS.gray.lightMedium,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: FONTS.family.poppinsRegular,
  },
  planContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  durationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationButtonText: {
    fontSize: 20,
    fontFamily: FONTS.family.poppinsBold,
  },
  durationDisplay: {
    alignItems: 'center',
  },
  durationValue: {
    fontSize: 24,
    fontFamily: FONTS.family.poppinsBold,
    color: COLORS.text.primary,
  },
  durationUnit: {
    fontSize: 12,
    fontFamily: FONTS.family.poppinsRegular,
    color: COLORS.text.secondary,
  },
  layoutContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  layoutCard: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray.lightMedium,
    backgroundColor: COLORS.primary.white,
    alignItems: 'center',
  },
  layoutCardSelected: {
    backgroundColor: COLORS.primary.green,
    borderColor: COLORS.primary.green,
  },
  layoutText: {
    fontSize: 16,
    fontFamily: FONTS.family.poppinsBold,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  layoutTextSelected: {
    color: COLORS.primary.white,
  },
  layoutSubtext: {
    fontSize: 12,
    fontFamily: FONTS.family.poppinsRegular,
    color: COLORS.text.secondary,
  },
  layoutSubtextSelected: {
    color: COLORS.primary.white,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  editButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
  },
  saveButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
  },
});
