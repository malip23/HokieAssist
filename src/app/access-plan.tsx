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

import { runHokieAgent } from '../../services/agent';
import type { AccessNeed } from '../../services/types';

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

    const plan = useMemo(
        () =>
            runHokieAgent({
                message:
                    'Create an accessible route from Newman Library to Squires Student Center.',
                origin: 'Newman Library',
                destination: 'Squires Student Center',
                accessNeeds: selectedNeeds,
                urgency: 'normal',
                energyLevel: 'moderate',
            }),
        [selectedNeeds],
    );

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
                        <Text style={styles.backText}>‹</Text>
                    </Pressable>

                    <Text style={styles.step}>STEP 3 OF 4</Text>
                </View>

                <View style={styles.introduction}>
                    <Text style={styles.eyebrow}>YOUR ACCESS PLAN</Text>
                    <Text style={styles.title}>A route designed around you</Text>
                    <Text style={styles.description}>{plan.summary}</Text>
                </View>

                {plan.route && (
                    <>
                        <View style={styles.routeCard}>
                            <View style={styles.routeHeading}>
                                <View style={styles.routeIcon}>
                                    <Text style={styles.routeIconText}>🧭</Text>
                                </View>

                                <View style={styles.routeHeadingText}>
                                    <Text style={styles.routeLabel}>RECOMMENDED ROUTE</Text>
                                    <Text style={styles.routeTitle}>
                                        {plan.route.origin} → {plan.route.destination}
                                    </Text>
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
                                <Text style={styles.routeDetail}>
                                    🏢 {plan.route.indoorPercentage}% indoors
                                </Text>

                                <Text style={styles.routeDetail}>
                                    ↗️ {plan.route.slope} slope
                                </Text>
                            </View>
                        </View>

                        {plan.accommodations.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Included accommodations</Text>

                                {plan.accommodations.map((accommodation) => (
                                    <View key={accommodation} style={styles.accommodationRow}>
                                        <View style={styles.checkCircle}>
                                            <Text style={styles.checkmark}>✓</Text>
                                        </View>

                                        <Text style={styles.rowText}>{accommodation}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {plan.warnings.length > 0 && (
                            <View style={styles.warningSection}>
                                <Text style={styles.warningTitle}>Before you go</Text>

                                {plan.warnings.map((warning) => (
                                    <View key={warning} style={styles.warningRow}>
                                        <Text style={styles.warningIcon}>⚠️</Text>
                                        <Text style={styles.warningText}>{warning}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Step-by-step route</Text>

                            {plan.steps.map((step, index) => (
                                <View key={`${step}-${index}`} style={styles.stepRow}>
                                    <View style={styles.stepNumber}>
                                        <Text style={styles.stepNumberText}>{index + 1}</Text>
                                    </View>

                                    <Text style={styles.stepText}>{step}</Text>
                                </View>
                            ))}
                        </View>
                    </>
                )}

                {!plan.route && (
                    <View style={styles.emptyCard}>
                        <Text style={styles.emptyIcon}>📍</Text>
                        <Text style={styles.emptyTitle}>Route unavailable</Text>
                        <Text style={styles.emptyText}>{plan.summary}</Text>
                    </View>
                )}

                <View style={styles.agentNotice}>
                    <Text style={styles.agentNoticeIcon}>✨</Text>

                    <View style={styles.agentNoticeContent}>
                        <Text style={styles.agentNoticeTitle}>
                            Personalized by HokieAssist
                        </Text>

                        <Text style={styles.agentNoticeText}>
                            Your route was created using your selected access preferences.
                            You can return and update them whenever your needs change.
                        </Text>
                    </View>
                </View>

                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Change access preferences"
                    onPress={() => router.push('/access-needs')}
                    style={({ pressed }) => [
                        styles.secondaryButton,
                        pressed && styles.pressed,
                    ]}
                >
                    <Text style={styles.secondaryButtonText}>
                        Change my preferences
                    </Text>
                </Pressable>

                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Enter live event mode"
                    onPress={() => router.push('/live-event')}
                    style={({ pressed }) => [
                        styles.secondaryButton,
                        pressed && styles.pressed,
                    ]}
                >
                    <Text style={styles.secondaryButtonText}>
                        Enter live event mode
                    </Text>
                </Pressable>

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
    routeCard: {
        backgroundColor: COLORS.maroon,
        borderRadius: 24,
        padding: 20,
        marginTop: 28,
    },
    routeHeading: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    routeIcon: {
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 15,
    },
    routeIconText: {
        fontSize: 23,
    },
    routeHeadingText: {
        flex: 1,
        marginLeft: 14,
    },
    routeLabel: {
        color: '#F5CDD9',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1.1,
    },
    routeTitle: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '800',
        lineHeight: 22,
        marginTop: 4,
    },
    metrics: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#751A38',
        borderRadius: 18,
        paddingVertical: 16,
        marginTop: 20,
    },
    metric: {
        flex: 1,
        alignItems: 'center',
    },
    metricValue: {
        color: COLORS.white,
        fontSize: 21,
        fontWeight: '900',
    },
    metricLabel: {
        color: '#F5CDD9',
        fontSize: 11,
        marginTop: 3,
    },
    metricDivider: {
        width: 1,
        height: 32,
        backgroundColor: '#A94C6B',
    },
    routeDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 17,
    },
    routeDetail: {
        color: COLORS.white,
        fontSize: 13,
        fontWeight: '700',
    },
    section: {
        backgroundColor: COLORS.white,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 20,
        marginTop: 18,
    },
    sectionTitle: {
        color: COLORS.text,
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 15,
    },
    accommodationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 11,
    },
    checkCircle: {
        width: 27,
        height: 27,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.paleMaroon,
        borderRadius: 9,
    },
    checkmark: {
        color: COLORS.maroon,
        fontSize: 15,
        fontWeight: '900',
    },
    rowText: {
        flex: 1,
        color: COLORS.text,
        fontSize: 14,
        lineHeight: 20,
        marginLeft: 12,
    },
    warningSection: {
        backgroundColor: COLORS.warningBackground,
        borderRadius: 22,
        padding: 20,
        marginTop: 18,
    },
    warningTitle: {
        color: COLORS.warning,
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 12,
    },
    warningRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 8,
    },
    warningIcon: {
        fontSize: 18,
        marginRight: 10,
    },
    warningText: {
        flex: 1,
        color: COLORS.warning,
        fontSize: 14,
        lineHeight: 20,
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 13,
    },
    stepNumber: {
        width: 31,
        height: 31,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.paleOrange,
        borderRadius: 10,
    },
    stepNumberText: {
        color: COLORS.orange,
        fontSize: 13,
        fontWeight: '900',
    },
    stepText: {
        flex: 1,
        color: COLORS.text,
        fontSize: 14,
        lineHeight: 20,
        marginLeft: 12,
    },
    emptyCard: {
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 24,
        marginTop: 28,
    },
    emptyIcon: {
        fontSize: 34,
    },
    emptyTitle: {
        color: COLORS.text,
        fontSize: 19,
        fontWeight: '800',
        marginTop: 13,
    },
    emptyText: {
        color: COLORS.secondaryText,
        fontSize: 14,
        lineHeight: 21,
        textAlign: 'center',
        marginTop: 8,
    },
    agentNotice: {
        flexDirection: 'row',
        backgroundColor: '#F0E8F8',
        borderRadius: 20,
        padding: 17,
        marginTop: 18,
    },
    agentNoticeIcon: {
        fontSize: 22,
        marginRight: 12,
    },
    agentNoticeContent: {
        flex: 1,
    },
    agentNoticeTitle: {
        color: COLORS.text,
        fontSize: 14,
        fontWeight: '800',
    },
    agentNoticeText: {
        color: COLORS.secondaryText,
        fontSize: 13,
        lineHeight: 19,
        marginTop: 5,
    },
    secondaryButton: {
        minHeight: 58,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.maroon,
        borderRadius: 18,
        marginTop: 24,
    },
    secondaryButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '800',
    },
    homeButton: {
        minHeight: 48,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    homeButtonText: {
        color: COLORS.maroon,
        fontSize: 14,
        fontWeight: '700',
        textDecorationLine: 'underline',
    },
    pressed: {
        opacity: 0.8,
        transform: [{ scale: 0.99 }],
    },
});