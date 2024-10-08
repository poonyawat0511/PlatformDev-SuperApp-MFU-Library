import React, { useState } from "react";

import { router } from "expo-router";
import { useSession } from "@/contexts/ctx";
import { Button, Card, H3, Input, Sheet, Text, View, YStack } from "tamagui";

export default function SignIn() {
  const { logIn } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(true);
  const [modal, setModal] = useState(true);


  const handlelogIn = async () => {
    try {
      await logIn(email, password);
      router.replace("/");
    } catch (error) {
      console.error("Sign-in error:", error);
    }
  };

  return (
    <YStack
      style={{
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: "grey",
      }}
    >
      <Sheet
        modal={modal}
        open={open}
        snapPoints={undefined}
        snapPointsMode={'fit'}
      >
        <Card padded borderRadius="$8">
          <H3 paddingBottom="$2">Get Started</H3>
          <YStack paddingBottom="$4">
            <Text>Welcome to MFU Campus!</Text>
            <Text>Your gateway to campus life and services.</Text>
          </YStack>
          <YStack gap="$2" paddingBottom="$4">
            <Input
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={{ borderBottomWidth: 1 }}
            />
            <Input
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={{ borderBottomWidth: 1 }}
            />
          </YStack>
          <Button
            borderRadius="$6"
            marginBottom="$2"
            color="white"
            onPress={handlelogIn}
          >
            Continue
          </Button>
          <Button borderRadius="$6">Continue With Google</Button>
        </Card>
      </Sheet>
    </YStack>
  );
}
