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
import type { AccessNeed } from '../../services/types';

const COLORS = {
    maroon: '#861F41',
    orange: '#E87722',
    cream: '#FFF8F2',
    white: '#FFFFFF',
    text: '#211A1D',
    secondaryText: '#665B60',
    border: '#E8DDE1',
    selected: '#F8E8EE',
};

const accessNeeds: {
    id: AccessNeed;
    icon: string;
    label: string;
}[] = [
        { id: 'minimize_walking', icon: '🚶', label: 'Minimize walking' },
        { id: 'no_stairs', icon: '🛗', label: 'Avoid stairs' },
        { id: 'minimize_standing', icon: '🧍', label: 'Minimize standing' },
        { id: 'seating', icon: '🪑', label: 'Frequent seating' },
        { id: 'avoid_heat', icon: '🌡️', label: 'Avoid heat' },
        { id: 'indoor_route', icon: '🏢', label: 'Prefer indoors' },
        { id: 'low_stimulation', icon: '🔇', label: 'Low stimulation' },
        { id: 'restroom', icon: '🚻', label: 'Restrooms nearby' },
        { id: 'water', icon: '💧', label: 'Water nearby' },
        { id: 'elevator', icon: '↕️', label: 'Elevator required' },
    ];

export default function AccessNeedsScreen() {
    const router = useRouter();
    const [selectedNeeds, setSelectedNeeds] = useState<AccessNeed[]>([]);

    function toggleNeed(id: AccessNeed) {
        setSelectedNeeds((currentNeeds) =>
            currentNeeds.includes(id)
                ? currentNeeds.filter((need) => need !== id)
                : [...currentNeeds, id],
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
                        accessibilityLabel="Return to home"
                        onPress={() => router.back()}
                        style={({ pressed }) => [
                            styles.backButton,
                            pressed && styles.pressed,
                        ]}
                    >
                        <Text style={styles.backText}>‹</Text>
                    </Pressable>

                    <Text style={styles.step}>STEP 1 OF 4</Text>
                </View>

                <View style={styles.introduction}>
                    <Text style={styles.eyebrow}>TODAY’S ACCESS PLAN</Text>

                    <Text style={styles.title}>
                        What would make participating easier?
                    </Text>

                    <Text style={styles.description}>
                        Select everything that would help today. Your choices can change
                        whenever your needs change.
                    </Text>
                </View>

                <View style={styles.notice}>
                    <Text style={styles.noticeIcon}>🛡️</Text>

                    <Text style={styles.noticeText}>
                        You don’t need to share a diagnosis. Choose only the support you
                        want.
                    </Text>
                </View>

                <View style={styles.selectionHeader}>
                    <Text style={styles.selectionTitle}>Choose your needs</Text>

                    <Text style={styles.selectionCount}>
                        {selectedNeeds.length} selected
                    </Text>
                </View>

                <View style={styles.grid}>
                    {accessNeeds.map((need) => {
                        const selected = selectedNeeds.includes(need.id);

                        return (
                            <Pressable
                                key={need.id}
                                accessibilityRole="checkbox"
                                accessibilityState={{ checked: selected }}
                                accessibilityLabel={need.label}
                                onPress={() => toggleNeed(need.id)}
                                style={({ pressed }) => [
                                    styles.needCard,
                                    selected && styles.selectedCard,
                                    pressed && styles.pressed,
                                ]}
                            >
                                <View style={styles.cardTop}>
                                    <View
                                        style={[
                                            styles.iconContainer,
                                            selected && styles.selectedIconContainer,
                                        ]}
                                    >
                                        <Text style={styles.needIcon}>{need.icon}</Text>
                                    </View>

                                    <View
                                        style={[
                                            styles.checkbox,
                                            selected && styles.selectedCheckbox,
                                        ]}
                                    >
                                        {selected && <Text style={styles.checkmark}>✓</Text>}
                                    </View>
                                </View>

                                <Text
                                    style={[
                                        styles.needLabel,
                                        selected && styles.selectedLabel,
                                    ]}
                                >
                                    {need.label}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>

                {selectedNeeds.length > 0 && (
                    <View style={styles.summary}>
                        <Text style={styles.summaryTitle}>Your plan will prioritize:</Text>

                        <Text style={styles.summaryText}>
                            {selectedNeeds
                                .map(
                                    (id) =>
                                        accessNeeds.find((need) => need.id === id)?.label,
                                )
                                .join(' · ')}
                        </Text>
                    </View>
                )}

                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={
                        selectedNeeds.length > 0
                            ? 'Continue to campus events'
                            : 'Select at least one access need to continue'
                    }
                    accessibilityState={{
                        disabled: selectedNeeds.length === 0,
                    }}
                    disabled={selectedNeeds.length === 0}
                    onPress={() =>
                        router.push({
                            pathname: '/events',
                            params: {
                                accessNeeds: JSON.stringify(selectedNeeds),
                            },
                        })
                    }
                    style={({ pressed }) => [
                        styles.continueButton,
                        selectedNeeds.length === 0 && styles.disabledButton,
                        pressed && selectedNeeds.length > 0 && styles.pressed,
                    ]}
                >
                    <Text style={styles.continueText}>
                        {selectedNeeds.length === 0
                            ? 'Select at least one'
                            : 'Continue'}
                    </Text>

                    <Text style={styles.continueArrow}>→</Text>
                </Pressable>

                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Skip access needs"
                    onPress={() =>
                        router.push({
                            pathname: '/events',
                            params: {
                                accessNeeds: JSON.stringify([]),
                            },
                        })
                    }
                    style={styles.skipButton}
                >
                    <Text style={styles.skipText}>I don’t need preferences today</Text>
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
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        width: 48,
        height: 48,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.white,
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
    notice: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0E8F8',
        borderRadius: 18,
        padding: 16,
        marginTop: 24,
    },
    noticeIcon: {
        fontSize: 22,
        marginRight: 12,
    },
    noticeText: {
        flex: 1,
        color: COLORS.secondaryText,
        fontSize: 13,
        lineHeight: 19,
    },
    selectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 30,
        marginBottom: 14,
    },
    selectionTitle: {
        color: COLORS.text,
        fontSize: 19,
        fontWeight: '800',
    },
    selectionCount: {
        color: COLORS.maroon,
        fontSize: 13,
        fontWeight: '700',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },
    needCard: {
        width: '48%',
        minHeight: 130,
        justifyContent: 'space-between',
        backgroundColor: COLORS.white,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 15,
    },
    selectedCard: {
        backgroundColor: COLORS.selected,
        borderColor: COLORS.maroon,
        borderWidth: 2,
    },
    cardTop: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.cream,
    },
    selectedIconContainer: {
        backgroundColor: COLORS.white,
    },
    needIcon: {
        fontSize: 21,
    },
    checkbox: {
        width: 25,
        height: 25,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#C7B9BF',
        backgroundColor: COLORS.white,
    },
    selectedCheckbox: {
        backgroundColor: COLORS.maroon,
        borderColor: COLORS.maroon,
    },
    checkmark: {
        color: COLORS.white,
        fontSize: 15,
        fontWeight: '900',
    },
    needLabel: {
        color: COLORS.text,
        fontSize: 15,
        fontWeight: '700',
        lineHeight: 20,
        marginTop: 16,
    },
    selectedLabel: {
        color: COLORS.maroon,
    },
    summary: {
        backgroundColor: COLORS.white,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 17,
        marginTop: 24,
    },
    summaryTitle: {
        color: COLORS.text,
        fontSize: 14,
        fontWeight: '800',
    },
    summaryText: {
        color: COLORS.secondaryText,
        fontSize: 13,
        lineHeight: 20,
        marginTop: 6,
    },
    continueButton: {
        minHeight: 58,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.maroon,
        borderRadius: 18,
        marginTop: 26,
    },
    disabledButton: {
        backgroundColor: '#B8ADB1',
    },
    continueText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '800',
    },
    continueArrow: {
        color: COLORS.orange,
        fontSize: 22,
        fontWeight: '800',
        marginLeft: 10,
    },
    skipButton: {
        minHeight: 48,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    skipText: {
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