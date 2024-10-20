import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'MFU-Library-index' }} />
      <Stack.Screen name="login" options={{ title: 'MFU-Library-login' }} />
      <Stack.Screen name="main" options={{ title: 'MFU-Library' }} />
    </Stack>
  );
}