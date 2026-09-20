import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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

type IconName = keyof typeof Ionicons.glyphMap;

type QuickActionProps = {
  icon: IconName;
  label: string;
  onPress: () => void;
};

function QuickAction({ icon, label, onPress }: QuickActionProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.quickAction,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.quickActionIcon}>
        <Ionicons
          name={icon}
          size={25}
          color={HokieColors.burgundy}
        />
      </View>

      <Text style={styles.quickActionLabel}>{label}</Text>
    </Pressable>
  );
}

type NavigationItemProps = {
  icon: IconName;
  selectedIcon: IconName;
  label: string;
  active?: boolean;
  onPress?: () => void;
};

function NavigationItem({
  icon,
  selectedIcon,
  label,
  active = false,
  onPress,
}: NavigationItemProps) {
  const color = active
    ? HokieColors.burgundy
    : HokieColors.inactive;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{
        selected: active,
        disabled: !onPress,
      }}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.navigationItem,
        pressed && styles.pressed,
      ]}
    >
      <Ionicons
        name={active ? selectedIcon : icon}
        size={23}
        color={color}
      />

      <Text
        style={[
          styles.navigationLabel,
          active && styles.navigationLabelActive,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brandSection}>
          <Text style={styles.appName}>
            <Text style={styles.appNameDark}>Hokie</Text>
            Assist
          </Text>

          <Text style={styles.tagline}>Your campus, your way</Text>
        </View>

        <Text style={styles.question}>
          What would make today easier?
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickActions}
        >
          <QuickAction
            icon="navigate-outline"
            label="Get somewhere"
            onPress={() => router.push('/access-needs')}
          />

          <QuickAction
            icon="mic-outline"
            label="Live captions"
            onPress={() => router.push('/live-event')}
          />

          <QuickAction
            icon="scan-outline"
            label="Describe"
            onPress={() => router.push('/request')}
          />

          <QuickAction
            icon="leaf-outline"
            label="Calm mode"
            onPress={() => router.push('/access-needs')}
          />

          <QuickAction
            icon="list-outline"
            label="My plan"
            onPress={() => router.push('/access-plan')}
          />
        </ScrollView>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Build my personalized access plan"
          onPress={() => router.push('/access-needs')}
          style={({ pressed }) => [
            styles.planCard,
            pressed && styles.pressed,
          ]}
        >
          <View style={styles.planEyebrowRow}>
            <View style={styles.orangeLine} />

            <Text style={styles.planEyebrow}>
              YOUR ACCESS PLAN
            </Text>
          </View>

          <Text style={styles.planTitle}>
            Make today{'\n'}
            <Text style={styles.planTitleItalic}>your way</Text>
          </Text>

          <Text style={styles.planDescription}>
            Set your preferences, get personalized recommendations,
            and explore campus with confidence.
          </Text>

          <View style={styles.planBottomRow}>
            <View style={styles.planButton}>
              <Text style={styles.planButtonText}>Build my plan</Text>

              <Ionicons
                name="arrow-forward"
                size={21}
                color={HokieColors.burgundy}
              />
            </View>

            <Text style={styles.utProsim}>Ut Prosim</Text>
          </View>
        </Pressable>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Happening today</Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="See all events"
            onPress={() => router.push('/events')}
            style={styles.seeAllButton}
          >
            <Text style={styles.seeAllText}>See all</Text>

            <Ionicons
              name="chevron-forward"
              size={18}
              color={HokieColors.burgundy}
            />
          </Pressable>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Campus Yoga at the Drillfield"
          onPress={() => router.push('/events')}
          style={({ pressed }) => [
            styles.eventCard,
            pressed && styles.pressed,
          ]}
        >
          <View style={styles.eventIcon}>
            <Ionicons
              name="calendar-outline"
              size={26}
              color={HokieColors.burgundy}
            />
          </View>

          <View style={styles.eventDetails}>
            <Text style={styles.eventTitle}>Campus Yoga</Text>
            <Text style={styles.eventTime}>12:00 PM – 1:00 PM</Text>

            <View style={styles.locationRow}>
              <Ionicons
                name="location-outline"
                size={15}
                color={HokieColors.textSecondary}
              />
              <Text style={styles.eventLocation}>Drillfield</Text>
            </View>

            <View style={styles.tagRow}>
              <View style={[styles.tag, styles.accessibleTag]}>
                <Text style={styles.accessibleTagText}>Accessible</Text>
              </View>

              <View style={styles.tag}>
                <Text style={styles.tagText}>Outdoors</Text>
              </View>

              <View style={[styles.tag, styles.sensoryTag]}>
                <Text style={styles.sensoryTagText}>Low sensory</Text>
              </View>
            </View>
          </View>
        </Pressable>

        <View style={styles.valuesCard}>
          <Ionicons
            name="shield-checkmark-outline"
            size={21}
            color={HokieColors.burgundy}
          />

          <Text style={styles.valuesText}>
            Support based on what you need—no diagnosis required.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.bottomNavigation}>
        <NavigationItem
          icon="home-outline"
          selectedIcon="home"
          label="Home"
          active
          onPress={() => undefined}
        />

        <NavigationItem
          icon="compass-outline"
          selectedIcon="compass"
          label="Explore"
          onPress={() => router.push('/explore')}
        />

        <NavigationItem
          icon="calendar-outline"
          selectedIcon="calendar"
          label="Events"
          onPress={() => router.push('/events')}
        />
      </View>
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
    paddingTop: HokieSpacing.md,
    paddingBottom: 118,
  },
  brandSection: {
    marginBottom: HokieSpacing.section,
  },
  appName: {
    color: HokieColors.burgundy,
    fontFamily: 'serif',
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -1,
  },
  appNameDark: {
    color: HokieColors.text,
  },
  tagline: {
    color: HokieColors.burgundy,
    fontSize: HokieTypography.label,
    marginTop: 2,
  },
  question: {
    color: HokieColors.text,
    fontSize: HokieTypography.heading,
    fontWeight: '700',
    letterSpacing: -0.35,
    marginBottom: HokieSpacing.lg,
  },
  quickActions: {
    gap: HokieSpacing.md,
    paddingRight: HokieSpacing.xl,
  },
  quickAction: {
    width: 72,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 62,
    height: 62,
    borderRadius: HokieRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: HokieColors.blush,
    borderWidth: 1,
    borderColor: '#F4DDE4',
  },
  quickActionLabel: {
    color: HokieColors.text,
    fontSize: HokieTypography.caption,
    fontWeight: '600',
    lineHeight: 16,
    textAlign: 'center',
    marginTop: HokieSpacing.sm,
  },
  planCard: {
    overflow: 'hidden',
    backgroundColor: HokieColors.burgundy,
    borderRadius: HokieRadius.large,
    padding: HokieSpacing.xl,
    marginTop: HokieSpacing.section,
    ...HokieShadow,
  },
  planEyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orangeLine: {
    width: 28,
    height: 3,
    borderRadius: HokieRadius.pill,
    backgroundColor: HokieColors.orange,
    marginRight: HokieSpacing.md,
  },
  planEyebrow: {
    color: '#F6DDE5',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
  },
  planTitle: {
    color: HokieColors.surface,
    fontFamily: 'serif',
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 39,
    marginTop: HokieSpacing.xl,
  },
  planTitleItalic: {
    fontStyle: 'italic',
  },
  planDescription: {
    maxWidth: 300,
    color: '#F6E7EC',
    fontSize: HokieTypography.label,
    lineHeight: 21,
    marginTop: HokieSpacing.md,
  },
  planBottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: HokieSpacing.md,
    marginTop: HokieSpacing.xl,
  },
  planButton: {
    minHeight: 52,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: HokieColors.surface,
    borderRadius: HokieRadius.pill,
    paddingHorizontal: HokieSpacing.lg,
  },
  planButtonText: {
    color: HokieColors.burgundy,
    fontSize: HokieTypography.body,
    fontWeight: '800',
  },
  utProsim: {
    color: '#F8E7EC',
    fontFamily: 'serif',
    fontSize: 15,
    fontStyle: 'italic',
    marginBottom: HokieSpacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: HokieSpacing.section,
    marginBottom: HokieSpacing.md,
  },
  sectionTitle: {
    color: HokieColors.text,
    fontSize: HokieTypography.heading,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  seeAllButton: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: HokieSpacing.md,
  },
  seeAllText: {
    color: HokieColors.burgundy,
    fontSize: HokieTypography.label,
    fontWeight: '700',
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: HokieColors.surface,
    borderRadius: HokieRadius.large,
    borderWidth: 1,
    borderColor: HokieColors.border,
    padding: HokieSpacing.lg,
    ...HokieShadow,
  },
  eventIcon: {
    width: 54,
    height: 54,
    borderRadius: HokieRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: HokieColors.burgundySoft,
    marginRight: HokieSpacing.md,
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    color: HokieColors.text,
    fontSize: HokieTypography.subheading,
    fontWeight: '800',
  },
  eventTime: {
    color: HokieColors.textSecondary,
    fontSize: HokieTypography.label,
    marginTop: 3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: HokieSpacing.sm,
  },
  eventLocation: {
    color: HokieColors.textSecondary,
    fontSize: HokieTypography.label,
    marginLeft: 3,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: HokieSpacing.md,
  },
  tag: {
    backgroundColor: '#F1F0F1',
    borderRadius: HokieRadius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagText: {
    color: HokieColors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  accessibleTag: {
    backgroundColor: HokieColors.successSoft,
  },
  accessibleTagText: {
    color: HokieColors.success,
    fontSize: 11,
    fontWeight: '700',
  },
  sensoryTag: {
    backgroundColor: HokieColors.burgundySoft,
  },
  sensoryTagText: {
    color: HokieColors.burgundy,
    fontSize: 11,
    fontWeight: '700',
  },
  valuesCard: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: HokieColors.burgundySoft,
    borderRadius: HokieRadius.medium,
    paddingHorizontal: HokieSpacing.lg,
    marginTop: HokieSpacing.xl,
  },
  valuesText: {
    flex: 1,
    color: HokieColors.textSecondary,
    fontSize: HokieTypography.label,
    lineHeight: 19,
    marginLeft: HokieSpacing.md,
  },
  bottomNavigation: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    minHeight: 82,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: HokieColors.surface,
    borderTopWidth: 1,
    borderTopColor: HokieColors.border,
    paddingHorizontal: HokieSpacing.md,
    paddingBottom: HokieSpacing.sm,
  },
  navigationItem: {
    minWidth: 64,
    minHeight: 58,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigationLabel: {
    color: HokieColors.inactive,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  navigationLabelActive: {
    color: HokieColors.burgundy,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
});