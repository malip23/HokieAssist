import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
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
    HokieShadow,
    HokieSpacing,
    HokieTypography,
} from '@/constants/theme';

function getParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default function EventsScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    accessNeeds?: string | string[];
  }>();

  const serializedAccessNeeds =
    getParamValue(params.accessNeeds) ?? JSON.stringify([]);

  const preferenceCount = useMemo(() => {
    try {
      return JSON.parse(serializedAccessNeeds).length;
    } catch {
      return 0;
    }
  }, [serializedAccessNeeds]);

  function openAccessPlan() {
    router.push({
      pathname: '/access-plan',
      params: {
        accessNeeds: serializedAccessNeeds,
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
            accessibilityLabel="Return to access preferences"
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backButton,
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
            accessibilityLabel="Step 2 of 4"
            style={styles.progress}
          >
            <View style={[styles.progressBar, styles.progressBarActive]} />
            <View style={[styles.progressBar, styles.progressBarActive]} />
            <View style={styles.progressBar} />
            <View style={styles.progressBar} />
          </View>

          <Text style={styles.step}>2 OF 4</Text>
        </View>

        <View style={styles.introduction}>
          <Text style={styles.eyebrow}>CAMPUS DESTINATION</Text>

          <Text style={styles.title}>
            Where are you{'\n'}going today?
          </Text>

          <Text style={styles.description}>
            Choose a destination and we’ll create a route around your
            preferences.
          </Text>
        </View>

        <View style={styles.preferenceNotice}>
          <View style={styles.preferenceIcon}>
            <Ionicons
              name={
                preferenceCount > 0
                  ? 'checkmark-circle-outline'
                  : 'options-outline'
              }
              size={21}
              color={HokieColors.burgundy}
            />
          </View>

          <View style={styles.preferenceContent}>
            <Text style={styles.preferenceTitle}>
              {preferenceCount > 0
                ? `${preferenceCount} ${
                    preferenceCount === 1
                      ? 'preference'
                      : 'preferences'
                  } selected`
                : 'Standard route selected'}
            </Text>

            <Text style={styles.preferenceText}>
              {preferenceCount > 0
                ? 'Your route will prioritize your selected support.'
                : 'You can add access preferences at any time.'}
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured event</Text>

          <Text style={styles.todayLabel}>TODAY</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Create an accessible route to Hokie Career Connections at Squires Student Center"
          onPress={openAccessPlan}
          style={({ pressed }) => [
            styles.eventCard,
            pressed && styles.pressed,
          ]}
        >
          <View style={styles.eventTop}>
            <View style={styles.eventIcon}>
              <Ionicons
                name="briefcase-outline"
                size={27}
                color={HokieColors.surface}
              />
            </View>

            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>HAPPENING TODAY</Text>
            </View>
          </View>

          <View style={styles.eventContent}>
            <View style={styles.eventHeading}>
              <View style={styles.eventHeadingText}>
                <Text style={styles.eventType}>
                  CAREER & PROFESSIONAL
                </Text>

                <Text style={styles.eventTitle}>
                  Hokie Career Connections
                </Text>
              </View>

              <View style={styles.arrowCircle}>
                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color={HokieColors.burgundy}
                />
              </View>
            </View>

            <View style={styles.eventDetails}>
              <View style={styles.detailRow}>
                <Ionicons
                  name="location-outline"
                  size={18}
                  color={HokieColors.textSecondary}
                />
                <Text style={styles.detailText}>
                  Squires Student Center
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Ionicons
                  name="time-outline"
                  size={18}
                  color={HokieColors.textSecondary}
                />
                <Text style={styles.detailText}>
                  1:00 PM–4:00 PM
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Ionicons
                  name="navigate-outline"
                  size={18}
                  color={HokieColors.textSecondary}
                />
                <Text style={styles.detailText}>
                  Starting from Newman Library
                </Text>
              </View>
            </View>

            <View style={styles.accessibilityTags}>
              <View style={styles.tag}>
                <Ionicons
                  name="accessibility-outline"
                  size={14}
                  color={HokieColors.burgundy}
                />
                <Text style={styles.tagText}>Accessible route</Text>
              </View>

              <View style={styles.tag}>
                <Ionicons
                  name="radio-outline"
                  size={14}
                  color={HokieColors.burgundy}
                />
                <Text style={styles.tagText}>Live updates</Text>
              </View>
            </View>

            <View style={styles.createPlanButton}>
              <Text style={styles.createPlanText}>
                Build my access plan
              </Text>

              <Ionicons
                name="arrow-forward"
                size={20}
                color={HokieColors.surface}
              />
            </View>
          </View>
        </Pressable>

        <View style={styles.comingSoonCard}>
          <View style={styles.comingSoonIcon}>
            <Ionicons
              name="school-outline"
              size={22}
              color={HokieColors.burgundy}
            />
          </View>

          <View style={styles.comingSoonContent}>
            <Text style={styles.comingSoonTitle}>
              More campus locations coming soon
            </Text>

            <Text style={styles.comingSoonText}>
              Classrooms, club meetings, dining halls, and more.
            </Text>
          </View>
        </View>
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
  backButton: {
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
  step: {
    color: HokieColors.burgundy,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  introduction: {
    marginTop: HokieSpacing.xxl,
  },
  eyebrow: {
    color: HokieColors.burgundy,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  title: {
    color: HokieColors.text,
    fontFamily: 'serif',
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 37,
    letterSpacing: -0.8,
    marginTop: HokieSpacing.sm,
  },
  description: {
    maxWidth: 320,
    color: HokieColors.textSecondary,
    fontSize: HokieTypography.label,
    lineHeight: 20,
    marginTop: HokieSpacing.md,
  },
  preferenceNotice: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: HokieColors.burgundySoft,
    borderRadius: HokieRadius.medium,
    padding: HokieSpacing.md,
    marginTop: HokieSpacing.xl,
  },
  preferenceIcon: {
    width: 38,
    height: 38,
    borderRadius: HokieRadius.small,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: HokieColors.surface,
    marginRight: HokieSpacing.md,
  },
  preferenceContent: {
    flex: 1,
  },
  preferenceTitle: {
    color: HokieColors.text,
    fontSize: HokieTypography.label,
    fontWeight: '700',
  },
  preferenceText: {
    color: HokieColors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: HokieSpacing.xxl,
    marginBottom: HokieSpacing.md,
  },
  sectionTitle: {
    color: HokieColors.text,
    fontSize: HokieTypography.subheading,
    fontWeight: '800',
  },
  todayLabel: {
    color: HokieColors.burgundy,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  eventCard: {
    overflow: 'hidden',
    backgroundColor: HokieColors.surface,
    borderRadius: HokieRadius.large,
    borderWidth: 1,
    borderColor: HokieColors.border,
    ...HokieShadow,
  },
  eventTop: {
    minHeight: 78,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: HokieColors.burgundy,
    paddingHorizontal: HokieSpacing.lg,
  },
  eventIcon: {
    width: 44,
    height: 44,
    borderRadius: HokieRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: HokieColors.surface,
    borderRadius: HokieRadius.pill,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: HokieRadius.pill,
    backgroundColor: HokieColors.orange,
    marginRight: 7,
  },
  liveText: {
    color: HokieColors.burgundy,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  eventContent: {
    padding: HokieSpacing.lg,
  },
  eventHeading: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  eventHeadingText: {
    flex: 1,
    paddingRight: HokieSpacing.md,
  },
  eventType: {
    color: HokieColors.orange,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  eventTitle: {
    color: HokieColors.text,
    fontSize: 21,
    fontWeight: '800',
    lineHeight: 26,
    marginTop: 5,
  },
  arrowCircle: {
    width: 40,
    height: 40,
    borderRadius: HokieRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: HokieColors.burgundySoft,
  },
  eventDetails: {
    gap: 9,
    marginTop: HokieSpacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    flex: 1,
    color: HokieColors.textSecondary,
    fontSize: HokieTypography.label,
    lineHeight: 19,
    marginLeft: 9,
  },
  accessibilityTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: HokieSpacing.sm,
    marginTop: HokieSpacing.lg,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: HokieColors.background,
    borderRadius: HokieRadius.pill,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  tagText: {
    color: HokieColors.burgundy,
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 5,
  },
  createPlanButton: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: HokieSpacing.sm,
    backgroundColor: HokieColors.burgundy,
    borderRadius: HokieRadius.pill,
    marginTop: HokieSpacing.xl,
  },
  createPlanText: {
    color: HokieColors.surface,
    fontSize: HokieTypography.label,
    fontWeight: '800',
  },
  comingSoonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: HokieColors.surface,
    borderRadius: HokieRadius.medium,
    borderWidth: 1,
    borderColor: HokieColors.border,
    padding: HokieSpacing.lg,
    marginTop: HokieSpacing.lg,
  },
  comingSoonIcon: {
    width: 42,
    height: 42,
    borderRadius: HokieRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: HokieColors.burgundySoft,
    marginRight: HokieSpacing.md,
  },
  comingSoonContent: {
    flex: 1,
  },
  comingSoonTitle: {
    color: HokieColors.text,
    fontSize: HokieTypography.label,
    fontWeight: '700',
  },
  comingSoonText: {
    color: HokieColors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.98 }],
  },
});