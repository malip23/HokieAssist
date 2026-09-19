import { useRouter } from 'expo-router';
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
  lightMaroon: '#F8EDF1',
  lightOrange: '#FFF1E7',
};

type ActionCardProps = {
  icon: string;
  title: string;
  description: string;
  onPress?: () => void;
  accent?: boolean;
};

function ActionCard({
  icon,
  title,
  description,
  onPress,
  accent = false,
}: ActionCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${description}`}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionCard,
        accent && styles.accentCard,
        pressed && styles.pressed,
        !onPress && styles.comingSoonCard,
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          accent && styles.accentIconContainer,
        ]}
      >
        <Text style={styles.icon} accessibilityElementsHidden>
          {icon}
        </Text>
      </View>

      <View style={styles.actionText}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionDescription}>{description}</Text>
      </View>

      <Text style={styles.arrow} accessibilityElementsHidden>
        {onPress ? '›' : 'Soon'}
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
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>H</Text>
          </View>

          <View style={styles.headerText}>
            <Text style={styles.appName}>HokieAssist</Text>
            <Text style={styles.tagline}>Your campus, your way</Text>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open settings"
            style={styles.settingsButton}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </Pressable>
        </View>

        <View style={styles.welcomeSection}>
          <Text style={styles.eyebrow}>GOOD AFTERNOON</Text>
          <Text style={styles.title}>What would make today easier?</Text>
          <Text style={styles.subtitle}>
            Choose what you need right now. No diagnosis required.
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Set today's access needs"
          onPress={() => router.push('/access-needs')}
          style={({ pressed }) => [
            styles.featureCard,
            pressed && styles.pressed,
          ]}
        >
          <View style={styles.featureTop}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureEmoji}>✨</Text>
            </View>

            <View style={styles.featureBadge}>
              <Text style={styles.featureBadgeText}>START HERE</Text>
            </View>
          </View>

          <Text style={styles.featureTitle}>Build today’s access plan</Text>
          <Text style={styles.featureDescription}>
            Tell us how you want to receive information and what would help
            you participate comfortably.
          </Text>

          <View style={styles.featureButton}>
            <Text style={styles.featureButtonText}>Choose my needs</Text>
            <Text style={styles.featureButtonArrow}>→</Text>
          </View>
        </Pressable>

        <Text style={styles.sectionTitle}>Explore HokieAssist</Text>

        <View style={styles.actionList}>
          <ActionCard
            icon="📍"
            title="Get somewhere"
            description="Find a route that works for you"
          />

          <ActionCard
            icon="📅"
            title="What’s happening"
            description="Browse accessible campus events"
          />

          <ActionCard
            icon="💬"
            title="Ask HokieAssist"
            description="Get personalized campus support"
          />

          <ActionCard
            icon="⏪"
            title="What did I miss?"
            description="Catch up after taking a break"
            accent
          />
        </View>

        <View style={styles.privacyCard}>
          <Text style={styles.privacyIcon}>🛡️</Text>

          <View style={styles.privacyText}>
            <Text style={styles.privacyTitle}>
              Designed around your needs
            </Text>
            <Text style={styles.privacyDescription}>
              HokieAssist asks what would help—not what condition you have.
            </Text>
          </View>
        </View>

        <Text style={styles.footer}>Ut Prosim · That I May Serve</Text>
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
    paddingTop: 12,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 34,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.maroon,
  },
  logoText: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: '800',
  },
  headerText: {
    flex: 1,
    marginLeft: 12,
  },
  appName: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '800',
  },
  tagline: {
    color: COLORS.secondaryText,
    fontSize: 13,
    marginTop: 2,
  },
  settingsButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  settingsIcon: {
    fontSize: 20,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  eyebrow: {
    color: COLORS.maroon,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 10,
  },
  title: {
    color: COLORS.text,
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 41,
    letterSpacing: -0.8,
  },
  subtitle: {
    color: COLORS.secondaryText,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 12,
  },
  featureCard: {
    backgroundColor: COLORS.maroon,
    borderRadius: 28,
    padding: 22,
    marginBottom: 30,
    shadowColor: COLORS.maroon,
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 5,
  },
  featureTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  featureEmoji: {
    fontSize: 22,
  },
  featureBadge: {
    backgroundColor: COLORS.orange,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  featureBadgeText: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  featureTitle: {
    color: COLORS.white,
    fontSize: 25,
    fontWeight: '800',
    lineHeight: 31,
    marginTop: 22,
  },
  featureDescription: {
    color: '#F7E8EE',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
  },
  featureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 22,
  },
  featureButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
  },
  featureButtonArrow: {
    color: COLORS.orange,
    fontSize: 22,
    fontWeight: '800',
    marginLeft: 9,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 14,
  },
  actionList: {
    gap: 12,
  },
  actionCard: {
    minHeight: 84,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
  },
  accentCard: {
    backgroundColor: COLORS.lightOrange,
    borderColor: '#F2C7A5',
  },
  comingSoonCard: {
    opacity: 0.78,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.lightMaroon,
  },
  accentIconContainer: {
    backgroundColor: '#FFE0C7',
  },
  icon: {
    fontSize: 23,
  },
  actionText: {
    flex: 1,
    marginHorizontal: 14,
  },
  actionTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '800',
  },
  actionDescription: {
    color: COLORS.secondaryText,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  arrow: {
    color: COLORS.maroon,
    fontSize: 15,
    fontWeight: '800',
  },
  privacyCard: {
    flexDirection: 'row',
    backgroundColor: '#F0E8F8',
    borderRadius: 20,
    padding: 18,
    marginTop: 24,
  },
  privacyIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  privacyText: {
    flex: 1,
  },
  privacyTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '800',
  },
  privacyDescription: {
    color: COLORS.secondaryText,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },
  footer: {
    color: COLORS.secondaryText,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 28,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.99 }],
  },
});