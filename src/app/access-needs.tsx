import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
    HokieColors,
    HokieRadius,
    HokieSpacing,
    HokieTypography,
} from '@/constants/theme';
import type { AccessNeed } from '../../services/types';

type IconName = keyof typeof Ionicons.glyphMap;

const accessNeeds: {
  id: AccessNeed;
  icon: IconName;
  label: string;
}[] = [
  {
    id: 'minimize_walking',
    icon: 'walk-outline',
    label: 'Minimize walking',
  },
  {
    id: 'no_stairs',
    icon: 'remove-circle-outline',
    label: 'Avoid stairs',
  },
  {
    id: 'minimize_standing',
    icon: 'body-outline',
    label: 'Minimize standing',
  },
  {
    id: 'seating',
    icon: 'accessibility-outline',
    label: 'Frequent seating',
  },
  {
    id: 'avoid_heat',
    icon: 'thermometer-outline',
    label: 'Avoid heat',
  },
  {
    id: 'indoor_route',
    icon: 'business-outline',
    label: 'Prefer indoors',
  },
  {
    id: 'low_stimulation',
    icon: 'volume-mute-outline',
    label: 'Low stimulation',
  },
  {
    id: 'restroom',
    icon: 'people-outline',
    label: 'Restrooms nearby',
  },
  {
    id: 'water',
    icon: 'water-outline',
    label: 'Water nearby',
  },
  {
    id: 'elevator',
    icon: 'swap-vertical-outline',
    label: 'Elevator required',
  },
];

export default function AccessNeedsScreen() {
  const router = useRouter();
  const [selectedNeeds, setSelectedNeeds] = useState<AccessNeed[]>([]);

  function toggleNeed(id: AccessNeed) {
    setSelectedNeeds((currentNeeds) =>
      currentNeeds.includes(id)
        ? currentNeeds.filter((need) => need !== id)
        : [...currentNeeds, id],
    );
  }

  function continueWithoutPreferences() {
    router.push({
      pathname: '/events',
      params: {
        accessNeeds: JSON.stringify([]),
      },
    });
  }

  function continueWithPreferences() {
    router.push({
      pathname: '/events',
      params: {
        accessNeeds: JSON.stringify(selectedNeeds),
      },
    });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Return to home"
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.headerButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={HokieColors.text}
            />
          </Pressable>

          <View
            accessible
            accessibilityLabel="Step 1 of 4"
            style={styles.progress}
          >
            <View style={[styles.progressBar, styles.progressBarActive]} />
            <View style={styles.progressBar} />
            <View style={styles.progressBar} />
            <View style={styles.progressBar} />
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Skip access preferences"
            onPress={continueWithoutPreferences}
            style={({ pressed }) => [
              styles.skipHeaderButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.skipHeaderText}>Skip</Text>
          </Pressable>
        </View>

        <View style={styles.introduction}>
          <Text style={styles.title}>
            What would help{'\n'}today?
          </Text>

          <Text style={styles.description}>
            Select anything that applies—you can change this anytime.
          </Text>
        </View>

        <View style={styles.notice}>
          <Ionicons
            name="shield-checkmark-outline"
            size={20}
            color={HokieColors.burgundy}
          />

          <Text style={styles.noticeText}>
            Choose the support you want. No diagnosis required.
          </Text>
        </View>

        <View style={styles.selectionHeader}>
          <Text style={styles.selectionTitle}>Choose your needs</Text>

          <Text style={styles.selectionCount}>
            {selectedNeeds.length} selected
          </Text>
        </View>

        <View style={styles.grid}>
          {accessNeeds.map((need) => {
            const selected = selectedNeeds.includes(need.id);

            return (
              <Pressable
                key={need.id}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: selected }}
                accessibilityLabel={need.label}
                onPress={() => toggleNeed(need.id)}
                style={({ pressed }) => [
                  styles.needCard,
                  selected && styles.selectedCard,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons
                  name={need.icon}
                  size={24}
                  color={
                    selected
                      ? HokieColors.burgundy
                      : HokieColors.textSecondary
                  }
                />

                <Text
                  style={[
                    styles.needLabel,
                    selected && styles.selectedLabel,
                  ]}
                >
                  {need.label}
                </Text>

                <View
                  style={[
                    styles.checkbox,
                    selected && styles.selectedCheckbox,
                  ]}
                >
                  {selected && (
                    <Ionicons
                      name="checkmark"
                      size={15}
                      color={HokieColors.surface}
                    />
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            selectedNeeds.length > 0
              ? 'Continue to campus events'
              : 'Select at least one access need to continue'
          }
          accessibilityState={{
            disabled: selectedNeeds.length === 0,
          }}
          disabled={selectedNeeds.length === 0}
          onPress={continueWithPreferences}
          style={({ pressed }) => [
            styles.continueButton,
            selectedNeeds.length === 0 && styles.disabledButton,
            pressed && selectedNeeds.length > 0 && styles.pressed,
          ]}
        >
          <Text style={styles.continueText}>
            {selectedNeeds.length === 0
              ? 'Select at least one'
              : 'Continue'}
          </Text>

          <Ionicons
            name="arrow-forward"
            size={21}
            color={
              selectedNeeds.length === 0
                ? '#EEE9EB'
                : HokieColors.surface
            }
          />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Continue without access preferences"
          onPress={continueWithoutPreferences}
          style={({ pressed }) => [
            styles.skipButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.skipText}>
            I don’t need preferences today
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: HokieColors.background,
  },
  content: {
    paddingHorizontal: HokieSpacing.xl,
    paddingTop: HokieSpacing.sm,
    paddingBottom: HokieSpacing.section,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: HokieRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: HokieColors.surface,
    borderWidth: 1,
    borderColor: HokieColors.border,
  },
  progress: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    marginHorizontal: HokieSpacing.xl,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: HokieRadius.pill,
    backgroundColor: HokieColors.border,
  },
  progressBarActive: {
    backgroundColor: HokieColors.burgundy,
  },
  skipHeaderButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  skipHeaderText: {
    color: HokieColors.textSecondary,
    fontSize: HokieTypography.label,
    fontWeight: '600',
  },
  introduction: {
    marginTop: HokieSpacing.xxl,
  },
  title: {
    color: HokieColors.text,
    fontFamily: 'serif',
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 37,
    letterSpacing: -0.8,
  },
  description: {
    maxWidth: 315,
    color: HokieColors.textSecondary,
    fontSize: HokieTypography.label,
    lineHeight: 20,
    marginTop: HokieSpacing.md,
  },
  notice: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: HokieColors.burgundySoft,
    borderRadius: HokieRadius.medium,
    paddingHorizontal: HokieSpacing.lg,
    marginTop: HokieSpacing.xl,
  },
  noticeText: {
    flex: 1,
    color: HokieColors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginLeft: HokieSpacing.md,
  },
  selectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: HokieSpacing.xxl,
    marginBottom: HokieSpacing.md,
  },
  selectionTitle: {
    color: HokieColors.text,
    fontSize: HokieTypography.subheading,
    fontWeight: '800',
  },
  selectionCount: {
    color: HokieColors.burgundy,
    fontSize: 13,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: HokieSpacing.md,
  },
  needCard: {
    width: '48.5%',
    minHeight: 88,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: HokieRadius.medium,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: HokieSpacing.md,
    paddingVertical: HokieSpacing.md,
  },
  selectedCard: {
    backgroundColor: HokieColors.burgundySoft,
    borderColor: HokieColors.burgundy,
  },
  needLabel: {
    flex: 1,
    color: HokieColors.text,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
    marginHorizontal: 9,
  },
  selectedLabel: {
    color: HokieColors.burgundy,
    fontWeight: '700',
  },
  checkbox: {
    width: 23,
    height: 23,
    borderRadius: HokieRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#B9AFB3',
    backgroundColor: HokieColors.background,
  },
  selectedCheckbox: {
    borderColor: HokieColors.burgundy,
    backgroundColor: HokieColors.burgundy,
  },
  continueButton: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: HokieSpacing.sm,
    backgroundColor: HokieColors.burgundy,
    borderRadius: HokieRadius.pill,
    marginTop: HokieSpacing.xxl,
  },
  disabledButton: {
    backgroundColor: '#B8ADB1',
  },
  continueText: {
    color: HokieColors.surface,
    fontSize: HokieTypography.body,
    fontWeight: '800',
  },
  skipButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: HokieSpacing.sm,
  },
  skipText: {
    color: HokieColors.burgundy,
    fontSize: HokieTypography.label,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
});