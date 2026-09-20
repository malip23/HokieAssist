import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />

      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          contentStyle: {
            backgroundColor: "#FFF8F2",
          },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="request" />
        <Stack.Screen name="access-needs" />
        <Stack.Screen name="events" />
        <Stack.Screen name="access-plan" />
        <Stack.Screen name="live-event" />
      </Stack>
    </>
  );
}
