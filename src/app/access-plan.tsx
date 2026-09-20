import { Ionicons } from '@expo/vector-icons';
import {
    useAudioPlayer,
    useAudioPlayerStatus,
} from 'expo-audio';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';

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
import { runHokieAgent } from '../../services/agent';
import { createFocusNarration } from '../../services/focusMode';
import { createFocusSpeechFile } from '../../services/speech';
import type {
    AccessNeed,
    AccessPlan,
} from '../../services/types';

function parseAccessNeeds(
    value: string | string[] | undefined,
): AccessNeed[] {
    const serializedValue = Array.isArray(value) ? value[0] : value;

    if (!serializedValue) {
        return [];
    }

    try {
        return JSON.parse(serializedValue) as AccessNeed[];
    } catch {
        return [];
    }
}

export default function AccessPlanScreen() {
    const router = useRouter();

    const params = useLocalSearchParams<{
        accessNeeds?: string | string[];
    }>();

    const selectedNeeds = useMemo(
        () => parseAccessNeeds(params.accessNeeds),
        [params.accessNeeds],
    );

    const [plan, setPlan] = useState<AccessPlan>({
        summary: 'Checking campus routes against your preferences.',
        steps: [],
        accommodations: [],
        warnings: [],
    });

    const [isLoading, setIsLoading] = useState(true);

    const player = useAudioPlayer(null);
    const playerStatus = useAudioPlayerStatus(player);

    const [isPreparingAudio, setIsPreparingAudio] =
        useState(false);
    const [audioUri, setAudioUri] = useState<string | null>(
        null,
    );
    const [audioError, setAudioError] = useState<string | null>(
        null,
    );

    const narrationText = useMemo(
        () =>
            createFocusNarration(plan)
                .map((step) => step.text)
                .join(' '),
        [plan],
    );

    useEffect(() => {
        let isActive = true;

        async function loadAccessPlan() {
            setIsLoading(true);

            try {
                const nextPlan = await runHokieAgent({
                    message:
                        'Create an accessible route from Newman Library to Squires Student Center.',
                    origin: 'Newman Library',
                    destination: 'Squires Student Center',
                    accessNeeds: selectedNeeds,
                    urgency: 'normal',
                    energyLevel: 'moderate',
                });

                if (isActive) {
                    setPlan(nextPlan);
                }
            } catch (error) {
                console.error('Failed to create access plan:', error);

                if (isActive) {
                    setPlan({
                        summary:
                            "HokieAssist couldn't create your access plan right now.",
                        steps: [],
                        accommodations: [],
                        warnings: [],
                    });
                }
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        }

        void loadAccessPlan();

        return () => {
            isActive = false;
        };
    }, [selectedNeeds]);

    async function handleListenToRoute() {
        if (playerStatus.playing) {
            player.pause();
            return;
        }

        if (audioUri) {
            player.play();
            return;
        }

        if (!narrationText) {
            setAudioError(
                'A route is needed before voice guidance can begin.',
            );
            return;
        }

        setIsPreparingAudio(true);
        setAudioError(null);

        try {
            const nextAudioUri =
                await createFocusSpeechFile(narrationText);

            setAudioUri(nextAudioUri);
            player.replace(nextAudioUri);
            player.play();
        } catch (error) {
            console.error(
                'Failed to prepare route narration:',
                error,
            );

            setAudioError(
                "Voice guidance isn't available right now. You can still follow the written route.",
            );
        } finally {
            setIsPreparingAudio(false);
        }
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
                        accessibilityLabel="Return to events"
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
                        accessibilityLabel="Step 3 of 4"
                        style={styles.progress}
                    >
                        <View style={[styles.progressBar, styles.progressBarActive]} />
                        <View style={[styles.progressBar, styles.progressBarActive]} />
                        <View style={[styles.progressBar, styles.progressBarActive]} />
                        <View style={styles.progressBar} />
                    </View>

                    <Text style={styles.step}>3 OF 4</Text>
                </View>

                <View style={styles.introduction}>
                    <Text style={styles.eyebrow}>YOUR ACCESS PLAN</Text>

                    <Text style={styles.title}>
                        A route designed{'\n'}around you
                    </Text>

                    <Text style={styles.description}>{plan.summary}</Text>
                </View>

                {plan.route ? (
                    <>
                        <View style={styles.routeCard}>
                            <View style={styles.routeHeading}>
                                <View style={styles.routeIcon}>
                                    <Ionicons
                                        name="navigate-outline"
                                        size={24}
                                        color={HokieColors.burgundy}
                                    />
                                </View>

                                <View style={styles.routeHeadingText}>
                                    <Text style={styles.routeLabel}>
                                        RECOMMENDED ROUTE
                                    </Text>

                                    <View style={styles.routeTitleRow}>
                                        <Text style={styles.routeTitle}>
                                            {plan.route.origin}
                                        </Text>

                                        <Ionicons
                                            name="arrow-forward"
                                            size={17}
                                            color="#F5CDD9"
                                        />

                                        <Text style={styles.routeTitle}>
                                            {plan.route.destination}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.metrics}>
                                <View style={styles.metric}>
                                    <Text style={styles.metricValue}>
                                        {plan.route.walkingTime}
                                    </Text>
                                    <Text style={styles.metricLabel}>minutes</Text>
                                </View>

                                <View style={styles.metricDivider} />

                                <View style={styles.metric}>
                                    <Text style={styles.metricValue}>
                                        {plan.route.distance}
                                    </Text>
                                    <Text style={styles.metricLabel}>miles</Text>
                                </View>

                                <View style={styles.metricDivider} />

                                <View style={styles.metric}>
                                    <Text style={styles.metricValue}>
                                        {plan.route.stairs}
                                    </Text>
                                    <Text style={styles.metricLabel}>stairs</Text>
                                </View>
                            </View>

                            <View style={styles.routeDetails}>
                                <View style={styles.routeDetail}>
                                    <Ionicons
                                        name="business-outline"
                                        size={17}
                                        color={HokieColors.surface}
                                    />
                                    <Text style={styles.routeDetailText}>
                                        {plan.route.indoorPercentage}% indoors
                                    </Text>
                                </View>

                                <View style={styles.routeDetail}>
                                    <Ionicons
                                        name="trending-up-outline"
                                        size={17}
                                        color={HokieColors.surface}
                                    />
                                    <Text style={styles.routeDetailText}>
                                        {plan.route.slope} slope
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={
                                playerStatus.playing
                                    ? 'Pause route narration'
                                    : audioUri
                                        ? 'Resume route narration'
                                        : 'Listen to my route'
                            }
                            accessibilityState={{
                                disabled: isPreparingAudio,
                                busy: isPreparingAudio,
                            }}
                            disabled={isPreparingAudio}
                            onPress={() => void handleListenToRoute()}
                            style={({ pressed }) => [
                                styles.secondaryButton,
                                isPreparingAudio && styles.buttonDisabled,
                                pressed && styles.pressed,
                            ]}
                        >
                            <Ionicons
                                name={
                                    playerStatus.playing
                                        ? 'pause-outline'
                                        : 'volume-high-outline'
                                }
                                size={20}
                                color={HokieColors.burgundy}
                            />

                            <Text style={styles.secondaryButtonText}>
                                {isPreparingAudio
                                    ? 'Preparing voice guidance…'
                                    : playerStatus.playing
                                        ? 'Pause narration'
                                        : audioUri
                                            ? 'Resume narration'
                                            : 'Listen to my route'}
                            </Text>
                        </Pressable>

                        {audioError ? (
                            <Text
                                accessibilityRole="alert"
                                style={styles.audioError}
                            >
                                {audioError}
                            </Text>
                        ) : null}

                        {plan.accommodations.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>
                                    Included accommodations
                                </Text>

                                {plan.accommodations.map((accommodation) => (
                                    <View
                                        key={accommodation}
                                        style={styles.accommodationRow}
                                    >
                                        <View style={styles.checkCircle}>
                                            <Ionicons
                                                name="checkmark"
                                                size={16}
                                                color={HokieColors.burgundy}
                                            />
                                        </View>

                                        <Text style={styles.rowText}>{accommodation}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {plan.warnings.length > 0 && (
                            <View style={styles.warningSection}>
                                <View style={styles.warningHeading}>
                                    <Ionicons
                                        name="warning-outline"
                                        size={21}
                                        color={HokieColors.warning}
                                    />

                                    <Text style={styles.warningTitle}>Before you go</Text>
                                </View>

                                {plan.warnings.map((warning) => (
                                    <View key={warning} style={styles.warningRow}>
                                        <View style={styles.warningDot} />
                                        <Text style={styles.warningText}>{warning}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Step-by-step route</Text>

                            {plan.steps.map((routeStep, index) => (
                                <View
                                    key={`${routeStep}-${index}`}
                                    style={styles.stepRow}
                                >
                                    <View style={styles.stepNumber}>
                                        <Text style={styles.stepNumberText}>
                                            {index + 1}
                                        </Text>
                                    </View>

                                    <Text style={styles.stepText}>{routeStep}</Text>
                                </View>
                            ))}
                        </View>
                    </>
                ) : (
                    <View style={styles.emptyCard}>
                        <View style={styles.emptyIcon}>
                            <Ionicons
                                name="location-outline"
                                size={26}
                                color={HokieColors.burgundy}
                            />
                        </View>

                        <Text style={styles.emptyTitle}>
                            {isLoading ? 'Building your route' : 'Route unavailable'}
                        </Text>
                        <Text style={styles.emptyText}>{plan.summary}</Text>
                    </View>
                )}

                <View style={styles.agentNotice}>
                    <View style={styles.agentNoticeIcon}>
                        <Ionicons
                            name="sparkles-outline"
                            size={21}
                            color={HokieColors.burgundy}
                        />
                    </View>

                    <View style={styles.agentNoticeContent}>
                        <Text style={styles.agentNoticeTitle}>
                            Personalized by HokieAssist
                        </Text>

                        <Text style={styles.agentNoticeText}>
                            Built around your selected access preferences. Update them
                            whenever your needs change.
                        </Text>
                    </View>
                </View>

                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Enter live event mode"
                    onPress={() => router.push('/live-event')}
                    style={({ pressed }) => [
                        styles.primaryButton,
                        pressed && styles.pressed,
                    ]}
                >
                    <Ionicons
                        name="radio-outline"
                        size={20}
                        color={HokieColors.surface}
                    />

                    <Text style={styles.primaryButtonText}>
                        Enter live event mode
                    </Text>

                    <Ionicons
                        name="arrow-forward"
                        size={20}
                        color={HokieColors.surface}
                    />
                </Pressable>

                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Change access preferences"
                    onPress={() => router.push('/access-needs')}
                    style={({ pressed }) => [
                        styles.secondaryButton,
                        pressed && styles.pressed,
                    ]}
                >
                    <Ionicons
                        name="options-outline"
                        size={19}
                        color={HokieColors.burgundy}
                    />

                    <Text style={styles.secondaryButtonText}>
                        Change my preferences
                    </Text>
                </Pressable>


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
        color: HokieColors.textSecondary,
        fontSize: HokieTypography.label,
        lineHeight: 20,
        marginTop: HokieSpacing.md,
    },
    routeCard: {
        backgroundColor: HokieColors.burgundy,
        borderRadius: HokieRadius.large,
        padding: HokieSpacing.lg,
        marginTop: HokieSpacing.xxl,
        ...HokieShadow,
    },
    routeHeading: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    routeIcon: {
        width: 46,
        height: 46,
        borderRadius: HokieRadius.medium,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: HokieColors.surface,
    },
    routeHeadingText: {
        flex: 1,
        marginLeft: HokieSpacing.md,
    },
    routeLabel: {
        color: '#F5CDD9',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1.1,
    },
    routeTitleRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 5,
        marginTop: 4,
    },
    routeTitle: {
        color: HokieColors.surface,
        fontSize: HokieTypography.label,
        fontWeight: '700',
        lineHeight: 19,
    },
    metrics: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: HokieColors.burgundyDark,
        borderRadius: HokieRadius.medium,
        paddingVertical: HokieSpacing.md,
        marginTop: HokieSpacing.lg,
    },
    metric: {
        flex: 1,
        alignItems: 'center',
    },
    metricValue: {
        color: HokieColors.surface,
        fontSize: HokieTypography.heading,
        fontWeight: '800',
    },
    metricLabel: {
        color: '#F5CDD9',
        fontSize: 11,
        marginTop: 2,
    },
    metricDivider: {
        width: 1,
        height: 30,
        backgroundColor: '#A94C6B',
    },
    routeDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: HokieSpacing.md,
        marginTop: HokieSpacing.lg,
    },
    routeDetail: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    routeDetailText: {
        color: HokieColors.surface,
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 6,
        textTransform: 'capitalize',
    },
    section: {
        backgroundColor: HokieColors.surface,
        borderRadius: HokieRadius.large,
        borderWidth: 1,
        borderColor: HokieColors.border,
        padding: HokieSpacing.lg,
        marginTop: HokieSpacing.lg,
    },
    sectionTitle: {
        color: HokieColors.text,
        fontSize: HokieTypography.subheading,
        fontWeight: '800',
        marginBottom: HokieSpacing.sm,
    },
    accommodationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: HokieSpacing.md,
    },
    checkCircle: {
        width: 28,
        height: 28,
        borderRadius: HokieRadius.small,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: HokieColors.burgundySoft,
    },
    rowText: {
        flex: 1,
        color: HokieColors.text,
        fontSize: HokieTypography.label,
        lineHeight: 19,
        marginLeft: HokieSpacing.md,
    },
    warningSection: {
        backgroundColor: HokieColors.warningSoft,
        borderRadius: HokieRadius.large,
        padding: HokieSpacing.lg,
        marginTop: HokieSpacing.lg,
    },
    warningHeading: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    warningTitle: {
        color: HokieColors.warning,
        fontSize: HokieTypography.subheading,
        fontWeight: '800',
        marginLeft: HokieSpacing.sm,
    },
    warningRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: HokieSpacing.md,
    },
    warningDot: {
        width: 6,
        height: 6,
        borderRadius: HokieRadius.pill,
        backgroundColor: HokieColors.warning,
        marginTop: 7,
        marginRight: HokieSpacing.md,
    },
    warningText: {
        flex: 1,
        color: HokieColors.warning,
        fontSize: HokieTypography.label,
        lineHeight: 20,
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: HokieSpacing.md,
    },
    stepNumber: {
        width: 30,
        height: 30,
        borderRadius: HokieRadius.small,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: HokieColors.warningSoft,
    },
    stepNumberText: {
        color: HokieColors.orange,
        fontSize: 13,
        fontWeight: '800',
    },
    stepText: {
        flex: 1,
        color: HokieColors.text,
        fontSize: HokieTypography.label,
        lineHeight: 19,
        marginLeft: HokieSpacing.md,
    },
    emptyCard: {
        alignItems: 'center',
        backgroundColor: HokieColors.surface,
        borderRadius: HokieRadius.large,
        borderWidth: 1,
        borderColor: HokieColors.border,
        padding: HokieSpacing.xxl,
        marginTop: HokieSpacing.xxl,
    },
    emptyIcon: {
        width: 48,
        height: 48,
        borderRadius: HokieRadius.medium,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: HokieColors.burgundySoft,
    },
    emptyTitle: {
        color: HokieColors.text,
        fontSize: HokieTypography.subheading,
        fontWeight: '800',
        marginTop: HokieSpacing.md,
    },
    emptyText: {
        color: HokieColors.textSecondary,
        fontSize: HokieTypography.label,
        lineHeight: 20,
        textAlign: 'center',
        marginTop: HokieSpacing.sm,
    },
    agentNotice: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: HokieColors.burgundySoft,
        borderRadius: HokieRadius.medium,
        padding: HokieSpacing.md,
        marginTop: HokieSpacing.lg,
    },
    agentNoticeIcon: {
        width: 38,
        height: 38,
        borderRadius: HokieRadius.small,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: HokieColors.surface,
        marginRight: HokieSpacing.md,
    },
    agentNoticeContent: {
        flex: 1,
    },
    agentNoticeTitle: {
        color: HokieColors.text,
        fontSize: HokieTypography.label,
        fontWeight: '700',
    },
    agentNoticeText: {
        color: HokieColors.textSecondary,
        fontSize: 12,
        lineHeight: 17,
        marginTop: 3,
    },
    primaryButton: {
        minHeight: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: HokieSpacing.sm,
        backgroundColor: HokieColors.burgundy,
        borderRadius: HokieRadius.pill,
        marginTop: HokieSpacing.xl,
    },
    primaryButtonText: {
        color: HokieColors.surface,
        fontSize: HokieTypography.body,
        fontWeight: '800',
    },
    secondaryButton: {
        minHeight: 54,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: HokieSpacing.sm,
        backgroundColor: HokieColors.surface,
        borderRadius: HokieRadius.pill,
        borderWidth: 1,
        borderColor: HokieColors.burgundy,
        marginTop: HokieSpacing.md,
    },
    secondaryButtonText: {
        color: HokieColors.burgundy,
        fontSize: HokieTypography.label,
        fontWeight: '700',
    },

    buttonDisabled: {
        opacity: 0.55,
    },
    audioError: {
        color: HokieColors.textSecondary,
        fontSize: 12,
        lineHeight: 17,
        textAlign: 'center',
        marginHorizontal: HokieSpacing.lg,
        marginTop: HokieSpacing.sm,
    },

    homeButton: {
        minHeight: 48,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: HokieSpacing.sm,
    },
    homeButtonText: {
        color: HokieColors.burgundy,
        fontSize: HokieTypography.label,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    pressed: {
        opacity: 0.78,
        transform: [{ scale: 0.98 }],
    },
});
