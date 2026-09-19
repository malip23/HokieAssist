import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EventsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>‹</Text>
        </Pressable>

        <Text style={styles.step}>STEP 2 OF 4</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.eyebrow}>CAMPUS EVENTS</Text>
        <Text style={styles.title}>Where are you going today?</Text>
        <Text style={styles.description}>
          Next, we’ll create beautiful event cards for the career fair,
          résumé workshop, and AWC meeting.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardIcon}>📅</Text>
          <Text style={styles.cardTitle}>Your Events screen works!</Text>
          <Text style={styles.cardText}>
            Your selected access needs will eventually personalize the events
            and routes shown here.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F2',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8DDE1',
  },
  backText: {
    color: '#861F41',
    fontSize: 34,
    lineHeight: 36,
  },
  step: {
    color: '#861F41',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  content: {
    padding: 20,
    paddingTop: 38,
  },
  eyebrow: {
    color: '#861F41',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.3,
  },
  title: {
    color: '#211A1D',
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 40,
    marginTop: 12,
  },
  description: {
    color: '#665B60',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 14,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E8DDE1',
    padding: 20,
    marginTop: 34,
  },
  cardIcon: {
    fontSize: 28,
  },
  cardTitle: {
    color: '#211A1D',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 15,
  },
  cardText: {
    color: '#665B60',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
});