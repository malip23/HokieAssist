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

const COLORS = {
  maroon: '#861F41',
  orange: '#E87722',
  cream: '#FFF8F2',
  white: '#FFFFFF',
  text: '#211A1D',
  secondaryText: '#665B60',
  border: '#E8DDE1',
  paleMaroon: '#F8E8EE',
  paleOrange: '#FFF0E4',
  warning: '#9A5A00',
  warningBackground: '#FFF4D8',
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
          <Text style={styles.errorIcon}>📍</Text>
          <Text style={styles.errorTitle}>Event data unavailable</Text>
          <Text style={styles.errorText}>
            HokieAssist could not load the current campus information.
          </Text>

          <Pressable
            accessibilityRole="button"
            onPress={() => router.back()}
            style={styles.primaryButton}
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
            <Text style={styles.backText}>‹</Text>
          </Pressable>

          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveIndicatorText}>LIVE</Text>
          </View>
        </View>

        <View style={styles.introduction}>
          <Text style={styles.eyebrow}>ACCESS LIVE</Text>
          <Text style={styles.title}>{currentEvent.name}</Text>

          <Text style={styles.description}>
            {currentEvent.building} · {currentEvent.room}
          </Text>
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
            <Text style={styles.environmentIcon}>👥</Text>
            <Text style={styles.environmentLabel}>Crowd</Text>
            <Text style={styles.environmentValue}>
              {latestCondition.crowd_level}
            </Text>
          </View>

          <View style={styles.environmentCard}>
            <Text style={styles.environmentIcon}>🔊</Text>
            <Text style={styles.environmentLabel}>Noise</Text>
            <Text style={styles.environmentValue}>
              {latestCondition.noise_level}
            </Text>
          </View>

          <View style={styles.environmentCard}>
            <Text style={styles.environmentIcon}>🌡️</Text>
            <Text style={styles.environmentLabel}>Temperature</Text>
            <Text style={styles.environmentValue}>
              {latestCondition.temperature_f}°F
            </Text>
          </View>
        </View>

        {blockedCondition && (
          <View style={styles.warningCard}>
            <Text style={styles.warningIcon}>⚠️</Text>

            <View style={styles.warningContent}>
              <Text style={styles.warningTitle}>Route update</Text>
              <Text style={styles.warningText}>
                {blockedCondition.message}
              </Text>
              <Text style={styles.warningAction}>
                HokieAssist recommends using an alternate elevator.
              </Text>
            </View>
          </View>
        )}

        <View style={styles.accessCard}>
          <Text style={styles.accessTitle}>Available nearby</Text>

          <View style={styles.features}>
            {building.accessibility_features.map((feature) => (
              <View key={feature} style={styles.feature}>
                <Text style={styles.featureCheck}>✓</Text>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}

            {building.quiet_spaces && (
              <View style={styles.feature}>
                <Text style={styles.featureCheck}>✓</Text>
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
            <Text style={styles.missedButtonEmoji}>✨</Text>
          </View>

          <View style={styles.missedButtonContent}>
            <Text style={styles.missedButtonTitle}>
              What did I miss?
            </Text>
            <Text style={styles.missedButtonText}>
              Get a quick accessible summary after taking a break.
            </Text>
          </View>

          <Text style={styles.missedButtonArrow}>
            {showMissedUpdates ? '⌃' : '⌄'}
          </Text>
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
                  Employer introductions are complete and open networking is
                  now underway.
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
                  The elevator on your original route is unavailable. Use the
                  alternate elevator near the ballroom entrance.
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
                  The workshop starts at {formatTime(nextEvent.start_time)} in
                  Room {nextEvent.room}. Seating is available nearby.
                </Text>
              </View>
            </View>

            <View style={styles.nextAction}>
              <Text style={styles.nextActionLabel}>
                RECOMMENDED NEXT ACTION
              </Text>
              <Text style={styles.nextActionText}>
                Continue networking, then take a seated break before going to
                Room {nextEvent.room}.
              </Text>
            </View>
          </View>
        )}

        <View style={styles.dataNotice}>
          <Text style={styles.dataNoticeIcon}>📊</Text>

          <View style={styles.dataNoticeContent}>
            <Text style={styles.dataNoticeTitle}>
              Powered by campus intelligence
            </Text>
            <Text style={styles.dataNoticeText}>
              HokieAssist combines event schedules, building accessibility,
              and live campus conditions to adapt your experience.
            </Text>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Return to home"
          onPress={() => router.replace('/')}
          style={styles.homeButton}
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
    backgroundColor: COLORS.cream,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 42,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  backText: {
    color: COLORS.maroon,
    fontSize: 34,
    lineHeight: 36,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.paleMaroon,
    borderRadius: 20,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },
  liveDot: {
    width: 8,
    height: 8,
    backgroundColor: COLORS.orange,
    borderRadius: 4,
    marginRight: 7,
  },
  liveIndicatorText: {
    color: COLORS.maroon,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  introduction: {
    marginTop: 32,
  },
  eyebrow: {
    color: COLORS.maroon,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.3,
  },
  title: {
    color: COLORS.text,
    fontSize: 31,
    fontWeight: '900',
    lineHeight: 38,
    marginTop: 10,
  },
  description: {
    color: COLORS.secondaryText,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 9,
  },
  timelineCard: {
    backgroundColor: COLORS.maroon,
    borderRadius: 24,
    padding: 20,
    marginTop: 24,
  },
  timelineSection: {
    paddingVertical: 3,
  },
  timelineLabel: {
    color: COLORS.orange,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  nextLabel: {
    color: '#F5CDD9',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  timelineTitle: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 23,
    marginTop: 7,
  },
  timelineTime: {
    color: '#F5CDD9',
    fontSize: 13,
    marginTop: 5,
  },
  timelineDivider: {
    height: 1,
    backgroundColor: '#A94C6B',
    marginVertical: 17,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 19,
    fontWeight: '800',
    marginTop: 28,
    marginBottom: 13,
  },
  environmentGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  environmentCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 8,
    paddingVertical: 15,
  },
  environmentIcon: {
    fontSize: 22,
  },
  environmentLabel: {
    color: COLORS.secondaryText,
    fontSize: 11,
    marginTop: 8,
  },
  environmentValue: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'capitalize',
    marginTop: 3,
  },
  warningCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.warningBackground,
    borderRadius: 20,
    padding: 17,
    marginTop: 16,
  },
  warningIcon: {
    fontSize: 21,
    marginRight: 11,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    color: COLORS.warning,
    fontSize: 15,
    fontWeight: '900',
  },
  warningText: {
    color: COLORS.warning,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 5,
  },
  warningAction: {
    color: COLORS.warning,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 19,
    marginTop: 7,
  },
  accessCard: {
    backgroundColor: COLORS.white,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 19,
    marginTop: 16,
  },
  accessTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '800',
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
    marginTop: 15,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cream,
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  featureCheck: {
    color: COLORS.maroon,
    fontSize: 12,
    fontWeight: '900',
    marginRight: 6,
  },
  featureText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  missedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.maroon,
    borderRadius: 22,
    padding: 17,
    marginTop: 22,
  },
  missedButtonIcon: {
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 14,
  },
  missedButtonEmoji: {
    fontSize: 21,
  },
  missedButtonContent: {
    flex: 1,
    marginLeft: 13,
  },
  missedButtonTitle: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '900',
  },
  missedButtonText: {
    color: '#F5CDD9',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
  },
  missedButtonArrow: {
    color: COLORS.orange,
    fontSize: 22,
    fontWeight: '900',
    marginLeft: 8,
  },
  missedCard: {
    backgroundColor: COLORS.white,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 19,
    marginTop: 12,
  },
  missedEyebrow: {
    color: COLORS.maroon,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.1,
    marginBottom: 5,
  },
  updateRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 17,
  },
  updateNumber: {
    width: 29,
    height: 29,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.paleOrange,
    borderRadius: 9,
  },
  updateNumberText: {
    color: COLORS.orange,
    fontSize: 13,
    fontWeight: '900',
  },
  updateContent: {
    flex: 1,
    marginLeft: 12,
  },
  updateTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '800',
  },
  updateText: {
    color: COLORS.secondaryText,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },
  nextAction: {
    backgroundColor: '#F0E8F8',
    borderRadius: 17,
    padding: 15,
    marginTop: 19,
  },
  nextActionLabel: {
    color: COLORS.maroon,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  nextActionText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
    marginTop: 6,
  },
  dataNotice: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 17,
    marginTop: 18,
  },
  dataNoticeIcon: {
    fontSize: 22,
    marginRight: 12,
  },
  dataNoticeContent: {
    flex: 1,
  },
  dataNoticeTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '800',
  },
  dataNoticeText: {
    color: COLORS.secondaryText,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 5,
  },
  primaryButton: {
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.maroon,
    borderRadius: 17,
    alignSelf: 'stretch',
    marginTop: 22,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
  },
  homeButton: {
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  homeButtonText: {
    color: COLORS.maroon,
    fontSize: 14,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  errorIcon: {
    fontSize: 38,
  },
  errorTitle: {
    color: COLORS.text,
    fontSize: 21,
    fontWeight: '900',
    marginTop: 14,
  },
  errorText: {
    color: COLORS.secondaryText,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 8,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
});