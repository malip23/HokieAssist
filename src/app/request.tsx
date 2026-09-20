import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
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
import { parseStudentRequestWithServer } from '../../services/aiClient';

const EXAMPLE_REQUEST =
  "I'm exhausted and need to get from Newman Library to Squires Student Center without stairs and with somewhere to sit.";

export default function RequestScreen() {
  const router = useRouter();

  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      setError('Please describe what would help today.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const request =
        await parseStudentRequestWithServer(trimmedMessage);

      if (!request.origin || !request.destination) {
        setError(
          'Please include where you are starting and where you need to go.',
        );
        return;
      }

      router.push({
        pathname: '/access-plan',
        params: {
          message: request.message,
          origin: request.origin,
          destination: request.destination,
          accessNeeds: JSON.stringify(request.accessNeeds),
          urgency: request.urgency ?? 'normal',
          energyLevel: request.energyLevel ?? 'normal',
        },
      });
    } catch (requestError) {
      console.warn(
        'HokieAssist request parsing failed:',
        requestError,
      );

      setError(
        requestError instanceof Error
          ? requestError.message
          : "HokieAssist couldn't understand that request.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Return home"
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

            <Text style={styles.headerLabel}>
              ASK HOKIEASSIST
            </Text>
          </View>

          <View style={styles.introduction}>
            <Text style={styles.eyebrow}>
              PERSONALIZED SUPPORT
            </Text>

            <Text style={styles.title}>
              What would help{'\n'}right now?
            </Text>

            <Text style={styles.description}>
              Describe where you are going and what would make the
              experience easier. You never need to share a diagnosis.
            </Text>
          </View>

          <View style={styles.inputCard}>
            <View style={styles.inputHeading}>
              <View style={styles.inputIcon}>
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={21}
                  color={HokieColors.burgundy}
                />
              </View>

              <Text style={styles.inputLabel}>
                Describe what you need
              </Text>
            </View>

            <TextInput
              accessibilityLabel="Describe your campus access request"
              accessibilityHint="Include your starting location, destination, and any support you need"
              editable={!isSubmitting}
              maxLength={500}
              multiline
              onChangeText={(value) => {
                setMessage(value);
                setError(null);
              }}
              placeholder="For example: I'm at Newman Library and need to get to Squires without stairs."
              placeholderTextColor={HokieColors.textSecondary}
              style={styles.input}
              textAlignVertical="top"
              value={message}
            />

            <Text style={styles.characterCount}>
              {message.length}/500
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Use an example request"
            disabled={isSubmitting}
            onPress={() => {
              setMessage(EXAMPLE_REQUEST);
              setError(null);
            }}
            style={({ pressed }) => [
              styles.exampleButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              name="sparkles-outline"
              size={18}
              color={HokieColors.burgundy}
            />

            <Text style={styles.exampleButtonText}>
              Try an example
            </Text>
          </Pressable>

          {error ? (
            <View accessibilityRole="alert" style={styles.errorCard}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color={HokieColors.warning}
              />

              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Create my personalized access plan"
            accessibilityState={{
              busy: isSubmitting,
              disabled: isSubmitting || !message.trim(),
            }}
            disabled={isSubmitting || !message.trim()}
            onPress={() => void handleSubmit()}
            style={({ pressed }) => [
              styles.submitButton,
              (isSubmitting || !message.trim()) &&
                styles.submitButtonDisabled,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting
                ? 'Understanding your request…'
                : 'Create my plan'}
            </Text>

            <Ionicons
              name={
                isSubmitting
                  ? 'hourglass-outline'
                  : 'arrow-forward'
              }
              size={20}
              color={HokieColors.surface}
            />
          </Pressable>

          <View style={styles.privacyNotice}>
            <Ionicons
              name="shield-checkmark-outline"
              size={20}
              color={HokieColors.burgundy}
            />

            <Text style={styles.privacyText}>
              HokieAssist identifies preferences—not diagnoses.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: HokieColors.background,
  },
  keyboardView: {
    flex: 1,
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: HokieColors.surface,
    borderRadius: HokieRadius.medium,
    borderWidth: 1,
    borderColor: HokieColors.border,
  },
  headerLabel: {
    color: HokieColors.burgundy,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginLeft: HokieSpacing.md,
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
    lineHeight: 38,
    letterSpacing: -0.8,
    marginTop: HokieSpacing.sm,
  },
  description: {
    color: HokieColors.textSecondary,
    fontSize: HokieTypography.label,
    lineHeight: 21,
    marginTop: HokieSpacing.md,
  },
  inputCard: {
    backgroundColor: HokieColors.surface,
    borderRadius: HokieRadius.large,
    borderWidth: 1,
    borderColor: HokieColors.border,
    padding: HokieSpacing.lg,
    marginTop: HokieSpacing.xxl,
    ...HokieShadow,
  },
  inputHeading: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: HokieColors.burgundySoft,
    borderRadius: HokieRadius.small,
  },
  inputLabel: {
    flex: 1,
    color: HokieColors.text,
    fontSize: HokieTypography.label,
    fontWeight: '700',
    marginLeft: HokieSpacing.md,
  },
  input: {
    minHeight: 150,
    color: HokieColors.text,
    fontSize: HokieTypography.body,
    lineHeight: 23,
    backgroundColor: HokieColors.background,
    borderRadius: HokieRadius.medium,
    borderWidth: 1,
    borderColor: HokieColors.border,
    padding: HokieSpacing.md,
    marginTop: HokieSpacing.lg,
  },
  characterCount: {
    color: HokieColors.textSecondary,
    fontSize: 11,
    textAlign: 'right',
    marginTop: HokieSpacing.sm,
  },
  exampleButton: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: HokieSpacing.sm,
    marginTop: HokieSpacing.md,
  },
  exampleButtonText: {
    color: HokieColors.burgundy,
    fontSize: HokieTypography.label,
    fontWeight: '700',
  },
  errorCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: HokieColors.warningSoft,
    borderRadius: HokieRadius.medium,
    padding: HokieSpacing.md,
    marginTop: HokieSpacing.md,
  },
  errorText: {
    flex: 1,
    color: HokieColors.warning,
    fontSize: 12,
    lineHeight: 18,
    marginLeft: HokieSpacing.sm,
  },
  submitButton: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: HokieSpacing.sm,
    backgroundColor: HokieColors.burgundy,
    borderRadius: HokieRadius.pill,
    marginTop: HokieSpacing.lg,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: HokieColors.surface,
    fontSize: HokieTypography.body,
    fontWeight: '800',
  },
  privacyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: HokieSpacing.sm,
    marginTop: HokieSpacing.lg,
  },
  privacyText: {
    color: HokieColors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.98 }],
  },
});