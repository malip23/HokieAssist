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

const COLORS = {
  maroon: '#861F41',
  orange: '#E87722',
  cream: '#FFF8F2',
  white: '#FFFFFF',
  text: '#211A1D',
  secondaryText: '#665B60',
  border: '#E8DDE1',
  paleMaroon: '#F8E8EE',
};

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
            <Text style={styles.backText}>‹</Text>
          </Pressable>

          <Text style={styles.step}>STEP 2 OF 4</Text>
        </View>

        <View style={styles.introduction}>
          <Text style={styles.eyebrow}>CAMPUS DESTINATION</Text>
          <Text style={styles.title}>Where are you going today?</Text>

          <Text style={styles.description}>
            Choose a destination and HokieAssist will create a route using
            your access preferences.
          </Text>
        </View>

        <View style={styles.preferenceNotice}>
          <Text style={styles.preferenceIcon}>✨</Text>

          <View style={styles.preferenceContent}>
            <Text style={styles.preferenceTitle}>
              {preferenceCount > 0
                ? `${preferenceCount} access ${
                    preferenceCount === 1 ? 'preference' : 'preferences'
                  } selected`
                : 'Standard route selected'}
            </Text>

            <Text style={styles.preferenceText}>
              {preferenceCount > 0
                ? 'Your route will prioritize the support you selected.'
                : 'You can return and add access preferences at any time.'}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Featured campus event</Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Create an accessible route to the career fair at Squires Student Center"
          onPress={openAccessPlan}
          style={({ pressed }) => [
            styles.eventCard,
            pressed && styles.pressed,
          ]}
        >
          <View style={styles.eventImage}>
            <Text style={styles.eventImageIcon}>💼</Text>

            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>HAPPENING TODAY</Text>
            </View>
          </View>

          <View style={styles.eventContent}>
            <View style={styles.eventHeading}>
              <View style={styles.eventHeadingText}>
                <Text style={styles.eventType}>CAREER & PROFESSIONAL</Text>
                <Text style={styles.eventTitle}>
                  Hokie Career Connections
                </Text>
              </View>

              <View style={styles.arrowCircle}>
                <Text style={styles.arrow}>→</Text>
              </View>
            </View>

            <View style={styles.eventDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailIcon}>📍</Text>
                <Text style={styles.detailText}>
                  Squires Student Center
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailIcon}>🕐</Text>
                <Text style={styles.detailText}>1:00 PM–4:00 PM</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailIcon}>🚶</Text>
                <Text style={styles.detailText}>
                  Starting from Newman Library
                </Text>
              </View>
            </View>

            <View style={styles.accessibilityTags}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>Accessible route</Text>
              </View>

              <View style={styles.tag}>
                <Text style={styles.tagText}>Live updates</Text>
              </View>
            </View>

            <View style={styles.createPlanButton}>
              <Text style={styles.createPlanText}>
                Build my access plan
              </Text>
              <Text style={styles.createPlanArrow}>→</Text>
            </View>
          </View>
        </Pressable>

        <View style={styles.comingSoonCard}>
          <Text style={styles.comingSoonIcon}>🏫</Text>

          <View style={styles.comingSoonContent}>
            <Text style={styles.comingSoonTitle}>
              More campus locations coming soon
            </Text>

            <Text style={styles.comingSoonText}>
              Future plans can include classrooms, club meetings, dining
              halls, and additional campus events.
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
  step: {
    color: COLORS.maroon,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  introduction: {
    marginTop: 34,
  },
  eyebrow: {
    color: COLORS.maroon,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.3,
  },
  title: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 39,
    letterSpacing: -0.6,
    marginTop: 10,
  },
  description: {
    color: COLORS.secondaryText,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 13,
  },
  preferenceNotice: {
    flexDirection: 'row',
    backgroundColor: '#F0E8F8',
    borderRadius: 20,
    padding: 17,
    marginTop: 24,
  },
  preferenceIcon: {
    fontSize: 22,
    marginRight: 12,
  },
  preferenceContent: {
    flex: 1,
  },
  preferenceTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '800',
  },
  preferenceText: {
    color: COLORS.secondaryText,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 19,
    fontWeight: '800',
    marginTop: 30,
    marginBottom: 14,
  },
  eventCard: {
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  eventImage: {
    height: 128,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: COLORS.maroon,
    padding: 18,
  },
  eventImageIcon: {
    fontSize: 38,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  liveDot: {
    width: 7,
    height: 7,
    backgroundColor: COLORS.orange,
    borderRadius: 4,
    marginRight: 7,
  },
  liveText: {
    color: COLORS.maroon,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  eventContent: {
    padding: 20,
  },
  eventHeading: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  eventHeadingText: {
    flex: 1,
    paddingRight: 12,
  },
  eventType: {
    color: COLORS.orange,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  eventTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 28,
    marginTop: 6,
  },
  arrowCircle: {
    width: 39,
    height: 39,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.paleMaroon,
    borderRadius: 13,
  },
  arrow: {
    color: COLORS.maroon,
    fontSize: 20,
    fontWeight: '900',
  },
  eventDetails: {
    marginTop: 17,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 9,
  },
  detailIcon: {
    width: 26,
    fontSize: 16,
  },
  detailText: {
    flex: 1,
    color: COLORS.secondaryText,
    fontSize: 14,
    lineHeight: 20,
  },
  accessibilityTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 18,
  },
  tag: {
    backgroundColor: COLORS.cream,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  tagText: {
    color: COLORS.maroon,
    fontSize: 11,
    fontWeight: '800',
  },
  createPlanButton: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.maroon,
    borderRadius: 16,
    marginTop: 20,
  },
  createPlanText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
  },
  createPlanArrow: {
    color: COLORS.orange,
    fontSize: 20,
    fontWeight: '900',
    marginLeft: 9,
  },
  comingSoonCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 17,
    marginTop: 18,
  },
  comingSoonIcon: {
    fontSize: 24,
    marginRight: 13,
  },
  comingSoonContent: {
    flex: 1,
  },
  comingSoonTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '800',
  },
  comingSoonText: {
    color: COLORS.secondaryText,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 5,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
});