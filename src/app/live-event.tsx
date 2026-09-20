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
    HokieShadow,
    HokieSpacing,
    HokieTypography,
} from '@/constants/theme';
import buildingsData from '../../data/buildings.json';
import conditionsData from '../../data/conditions.json';
import eventsData from '../../data/events.json';

type CampusEvent = {
  event_id: string;
  name: string;
  building: string;
  room: string;
  start_time: string;
  end_time: string;
  event_type: string;
  expected_crowd: 'low' | 'medium' | 'high';
  noise_level: 'low' | 'medium' | 'high';
};

type CampusCondition = {
  condition_id: string;
  location: string;
  timestamp: string;
  crowd_level: 'low' | 'medium' | 'high';
  noise_level: 'low' | 'medium' | 'high';
  temperature_f: number;
  construction: boolean;
  blocked_route: boolean;
  affected_feature?: string;
  message: string;
};

type CampusBuilding = {
  id: string;
  building: string;
  entrances: number;
  elevators: boolean;
  stairs: boolean;
  restrooms: boolean;
  seating: boolean;
  quiet_spaces: boolean;
  water: boolean;
  accessibility_features: string[];
};

function formatTime(time: string) {
  const [hoursString, minutes] = time.split(':');
  const hours = Number(hoursString);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;

  return `${displayHours}:${minutes} ${period}`;
}

export default function LiveEventScreen() {
  const router = useRouter();
  const [showMissedUpdates, setShowMissedUpdates] = useState(false);

  const events = eventsData as CampusEvent[];
  const conditions = conditionsData as CampusCondition[];
  const buildings = buildingsData as CampusBuilding[];

  const currentEvent = events.find(
    (event) => event.event_id === 'event_001',
  );

  const nextEvent = events.find(
    (event) => event.event_id === 'event_003',
  );

  const building = buildings.find(
    (item) => item.building === 'Squires Student Center',
  );

  const locationConditions = conditions.filter(
    (condition) => condition.location === 'Squires Student Center',
  );

  const latestCondition =
    locationConditions[locationConditions.length - 1];

  const blockedCondition = locationConditions.find(
    (condition) => condition.blocked_route,
  );

  if (!currentEvent || !nextEvent || !building || !latestCondition) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <View style={styles.errorIcon}>
            <Ionicons
              name="location-outline"
              size={28}
              color={HokieColors.burgundy}
            />
          </View>

          <Text style={styles.errorTitle}>Event data unavailable</Text>

          <Text style={styles.errorText}>
            HokieAssist could not load the current campus information.
          </Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.primaryButtonText}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
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
            accessibilityLabel="Return to access plan"
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

          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveIndicatorText}>LIVE</Text>
          </View>
        </View>

        <View style={styles.introduction}>
          <Text style={styles.eyebrow}>ACCESS LIVE</Text>
          <Text style={styles.title}>{currentEvent.name}</Text>

          <View style={styles.eventLocation}>
            <Ionicons
              name="location-outline"
              size={17}
              color={HokieColors.textSecondary}
            />

            <Text style={styles.description}>
              {currentEvent.building} · {currentEvent.room}
            </Text>
          </View>
        </View>

        <View style={styles.timelineCard}>
          <View style={styles.timelineSection}>
            <Text style={styles.timelineLabel}>NOW</Text>

            <Text style={styles.timelineTitle}>
              Employer introductions and networking
            </Text>

            <Text style={styles.timelineTime}>
              {formatTime(currentEvent.start_time)}–
              {formatTime(currentEvent.end_time)}
            </Text>
          </View>

          <View style={styles.timelineDivider} />

          <View style={styles.timelineSection}>
            <Text style={styles.nextLabel}>NEXT</Text>
            <Text style={styles.timelineTitle}>{nextEvent.name}</Text>

            <Text style={styles.timelineTime}>
              Room {nextEvent.room} · {formatTime(nextEvent.start_time)}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Current environment</Text>

        <View style={styles.environmentGrid}>
          <View style={styles.environmentCard}>
            <Ionicons
              name="people-outline"
              size={23}
              color={HokieColors.burgundy}
            />

            <Text style={styles.environmentLabel}>Crowd</Text>

            <Text style={styles.environmentValue}>
              {latestCondition.crowd_level}
            </Text>
          </View>

          <View style={styles.environmentCard}>
            <Ionicons
              name="volume-high-outline"
              size={23}
              color={HokieColors.burgundy}
            />

            <Text style={styles.environmentLabel}>Noise</Text>

            <Text style={styles.environmentValue}>
              {latestCondition.noise_level}
            </Text>
          </View>

          <View style={styles.environmentCard}>
            <Ionicons
              name="thermometer-outline"
              size={23}
              color={HokieColors.burgundy}
            />

            <Text style={styles.environmentLabel}>Temperature</Text>

            <Text style={styles.environmentValue}>
              {latestCondition.temperature_f}°F
            </Text>
          </View>
        </View>

        {blockedCondition && (
          <View style={styles.warningCard}>
            <View style={styles.warningIcon}>
              <Ionicons
                name="warning-outline"
                size={22}
                color={HokieColors.warning}
              />
            </View>

            <View style={styles.warningContent}>
              <Text style={styles.warningTitle}>Route update</Text>

              <Text style={styles.warningText}>
                {blockedCondition.message}
              </Text>

              <Text style={styles.warningAction}>
                Use the alternate elevator near the ballroom entrance.
              </Text>
            </View>
          </View>
        )}

        <View style={styles.accessCard}>
          <Text style={styles.accessTitle}>Available nearby</Text>

          <View style={styles.features}>
            {building.accessibility_features.map((feature) => (
              <View key={feature} style={styles.feature}>
                <Ionicons
                  name="checkmark"
                  size={14}
                  color={HokieColors.burgundy}
                />

                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}

            {building.quiet_spaces && (
              <View style={styles.feature}>
                <Ionicons
                  name="checkmark"
                  size={14}
                  color={HokieColors.burgundy}
                />

                <Text style={styles.featureText}>quiet spaces</Text>
              </View>
            )}
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Show what I missed"
          accessibilityState={{ expanded: showMissedUpdates }}
          onPress={() => setShowMissedUpdates((current) => !current)}
          style={({ pressed }) => [
            styles.missedButton,
            pressed && styles.pressed,
          ]}
        >
          <View style={styles.missedButtonIcon}>
            <Ionicons
              name="time-outline"
              size={23}
              color={HokieColors.burgundy}
            />
          </View>

          <View style={styles.missedButtonContent}>
            <Text style={styles.missedButtonTitle}>
              What did I miss?
            </Text>

            <Text style={styles.missedButtonText}>
              Get an accessible summary after taking a break.
            </Text>
          </View>

          <Ionicons
            name={
              showMissedUpdates
                ? 'chevron-up-outline'
                : 'chevron-down-outline'
            }
            size={21}
            color={HokieColors.orange}
          />
        </Pressable>

        {showMissedUpdates && (
          <View style={styles.missedCard}>
            <Text style={styles.missedEyebrow}>
              WHILE YOU WERE AWAY
            </Text>

            <View style={styles.updateRow}>
              <View style={styles.updateNumber}>
                <Text style={styles.updateNumberText}>1</Text>
              </View>

              <View style={styles.updateContent}>
                <Text style={styles.updateTitle}>
                  Networking has started
                </Text>

                <Text style={styles.updateText}>
                  Employer introductions are complete and open networking
                  is now underway.
                </Text>
              </View>
            </View>

            <View style={styles.updateRow}>
              <View style={styles.updateNumber}>
                <Text style={styles.updateNumberText}>2</Text>
              </View>

              <View style={styles.updateContent}>
                <Text style={styles.updateTitle}>
                  Elevator route changed
                </Text>

                <Text style={styles.updateText}>
                  The original elevator is unavailable. Use the alternate
                  elevator near the ballroom entrance.
                </Text>
              </View>
            </View>

            <View style={styles.updateRow}>
              <View style={styles.updateNumber}>
                <Text style={styles.updateNumberText}>3</Text>
              </View>

              <View style={styles.updateContent}>
                <Text style={styles.updateTitle}>
                  Résumé workshop begins soon
                </Text>

                <Text style={styles.updateText}>
                  The workshop starts at {formatTime(nextEvent.start_time)}
                  {' '}in Room {nextEvent.room}. Seating is available nearby.
                </Text>
              </View>
            </View>

            <View style={styles.nextAction}>
              <Text style={styles.nextActionLabel}>
                RECOMMENDED NEXT ACTION
              </Text>

              <Text style={styles.nextActionText}>
                Continue networking, then take a seated break before going
                to Room {nextEvent.room}.
              </Text>
            </View>
          </View>
        )}

        <View style={styles.dataNotice}>
          <View style={styles.dataNoticeIcon}>
            <Ionicons
              name="analytics-outline"
              size={21}
              color={HokieColors.burgundy}
            />
          </View>

          <View style={styles.dataNoticeContent}>
            <Text style={styles.dataNoticeTitle}>
              Powered by campus intelligence
            </Text>

            <Text style={styles.dataNoticeText}>
              Event schedules, building accessibility, and live campus
              conditions work together to adapt your experience.
            </Text>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Return to home"
          onPress={() => router.replace('/')}
          style={({ pressed }) => [
            styles.homeButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.homeButtonText}>Return home</Text>
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
    justifyContent: 'space-between',
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
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: HokieColors.burgundySoft,
    borderRadius: HokieRadius.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: HokieRadius.pill,
    backgroundColor: HokieColors.orange,
    marginRight: 7,
  },
  liveIndicatorText: {
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
    fontSize: 31,
    fontWeight: '700',
    lineHeight: 35,
    letterSpacing: -0.7,
    marginTop: HokieSpacing.sm,
  },
  eventLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: HokieSpacing.sm,
  },
  description: {
    color: HokieColors.textSecondary,
    fontSize: HokieTypography.label,
    lineHeight: 20,
    marginLeft: 5,
  },
  timelineCard: {
    backgroundColor: HokieColors.burgundy,
    borderRadius: HokieRadius.large,
    padding: HokieSpacing.lg,
    marginTop: HokieSpacing.xl,
    ...HokieShadow,
  },
  timelineSection: {
    paddingVertical: 2,
  },
  timelineLabel: {
    color: HokieColors.orange,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  nextLabel: {
    color: '#F5CDD9',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  timelineTitle: {
    color: HokieColors.surface,
    fontSize: HokieTypography.body,
    fontWeight: '700',
    lineHeight: 21,
    marginTop: 5,
  },
  timelineTime: {
    color: '#F5CDD9',
    fontSize: 12,
    marginTop: 4,
  },
  timelineDivider: {
    height: 1,
    backgroundColor: '#A94C6B',
    marginVertical: HokieSpacing.md,
  },
  sectionTitle: {
    color: HokieColors.text,
    fontSize: HokieTypography.subheading,
    fontWeight: '800',
    marginTop: HokieSpacing.xxl,
    marginBottom: HokieSpacing.md,
  },
  environmentGrid: {
    flexDirection: 'row',
    gap: HokieSpacing.sm,
  },
  environmentCard: {
    flex: 1,
    minHeight: 104,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: HokieColors.surface,
    borderRadius: HokieRadius.medium,
    borderWidth: 1,
    borderColor: HokieColors.border,
    padding: HokieSpacing.sm,
  },
  environmentLabel: {
    color: HokieColors.textSecondary,
    fontSize: 11,
    marginTop: 7,
  },
  environmentValue: {
    color: HokieColors.text,
    fontSize: HokieTypography.label,
    fontWeight: '800',
    textTransform: 'capitalize',
    marginTop: 2,
  },
  warningCard: {
    flexDirection: 'row',
    backgroundColor: HokieColors.warningSoft,
    borderRadius: HokieRadius.large,
    padding: HokieSpacing.lg,
    marginTop: HokieSpacing.lg,
  },
  warningIcon: {
    width: 40,
    height: 40,
    borderRadius: HokieRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: HokieColors.surface,
    marginRight: HokieSpacing.md,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    color: HokieColors.warning,
    fontSize: HokieTypography.label,
    fontWeight: '800',
  },
  warningText: {
    color: HokieColors.warning,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  warningAction: {
    color: HokieColors.warning,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 18,
    marginTop: 6,
  },
  accessCard: {
    backgroundColor: HokieColors.surface,
    borderRadius: HokieRadius.large,
    borderWidth: 1,
    borderColor: HokieColors.border,
    padding: HokieSpacing.lg,
    marginTop: HokieSpacing.lg,
  },
  accessTitle: {
    color: HokieColors.text,
    fontSize: HokieTypography.subheading,
    fontWeight: '800',
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: HokieSpacing.sm,
    marginTop: HokieSpacing.md,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: HokieColors.background,
    borderRadius: HokieRadius.pill,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  featureText: {
    color: HokieColors.text,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
    marginLeft: 5,
  },
  missedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: HokieColors.burgundy,
    borderRadius: HokieRadius.large,
    padding: HokieSpacing.lg,
    marginTop: HokieSpacing.xl,
  },
  missedButtonIcon: {
    width: 44,
    height: 44,
    borderRadius: HokieRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: HokieColors.surface,
  },
  missedButtonContent: {
    flex: 1,
    marginHorizontal: HokieSpacing.md,
  },
  missedButtonTitle: {
    color: HokieColors.surface,
    fontSize: HokieTypography.body,
    fontWeight: '800',
  },
  missedButtonText: {
    color: '#F5CDD9',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
  },
  missedCard: {
    backgroundColor: HokieColors.surface,
    borderRadius: HokieRadius.large,
    borderWidth: 1,
    borderColor: HokieColors.border,
    padding: HokieSpacing.lg,
    marginTop: HokieSpacing.md,
  },
  missedEyebrow: {
    color: HokieColors.burgundy,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  updateRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: HokieSpacing.lg,
  },
  updateNumber: {
    width: 28,
    height: 28,
    borderRadius: HokieRadius.small,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: HokieColors.warningSoft,
  },
  updateNumberText: {
    color: HokieColors.orange,
    fontSize: 12,
    fontWeight: '800',
  },
  updateContent: {
    flex: 1,
    marginLeft: HokieSpacing.md,
  },
  updateTitle: {
    color: HokieColors.text,
    fontSize: HokieTypography.label,
    fontWeight: '700',
  },
  updateText: {
    color: HokieColors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3,
  },
  nextAction: {
    backgroundColor: HokieColors.burgundySoft,
    borderRadius: HokieRadius.medium,
    padding: HokieSpacing.md,
    marginTop: HokieSpacing.lg,
  },
  nextActionLabel: {
    color: HokieColors.burgundy,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  nextActionText: {
    color: HokieColors.text,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
    marginTop: 5,
  },
  dataNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: HokieColors.surface,
    borderRadius: HokieRadius.medium,
    borderWidth: 1,
    borderColor: HokieColors.border,
    padding: HokieSpacing.md,
    marginTop: HokieSpacing.lg,
  },
  dataNoticeIcon: {
    width: 40,
    height: 40,
    borderRadius: HokieRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: HokieColors.burgundySoft,
    marginRight: HokieSpacing.md,
  },
  dataNoticeContent: {
    flex: 1,
  },
  dataNoticeTitle: {
    color: HokieColors.text,
    fontSize: HokieTypography.label,
    fontWeight: '700',
  },
  dataNoticeText: {
    color: HokieColors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
  },
  primaryButton: {
    minHeight: 52,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: HokieColors.burgundy,
    borderRadius: HokieRadius.pill,
    marginTop: HokieSpacing.xl,
  },
  primaryButtonText: {
    color: HokieColors.surface,
    fontSize: HokieTypography.label,
    fontWeight: '800',
  },
  homeButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: HokieSpacing.md,
  },
  homeButtonText: {
    color: HokieColors.burgundy,
    fontSize: HokieTypography.label,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: HokieSpacing.section,
  },
  errorIcon: {
    width: 54,
    height: 54,
    borderRadius: HokieRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: HokieColors.burgundySoft,
  },
  errorTitle: {
    color: HokieColors.text,
    fontSize: HokieTypography.subheading,
    fontWeight: '800',
    marginTop: HokieSpacing.md,
  },
  errorText: {
    color: HokieColors.textSecondary,
    fontSize: HokieTypography.label,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: HokieSpacing.sm,
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.98 }],
  },
});