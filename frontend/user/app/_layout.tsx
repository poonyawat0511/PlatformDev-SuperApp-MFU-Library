import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'index' }} />
      <Stack.Screen name="login" options={{ title: 'login' }} />
      <Stack.Screen name="profile" options={{ title: 'profile' }} />
    </Stack>
  );
}
