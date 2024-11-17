import {
  Text,
  Image,
  View,
  Button,
  ImageBackground,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("../assets/images/loginBg.jpg")}
      imageStyle={{ opacity: 0.5 }}
      style={styles.background}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={{ alignItems: "center", marginBottom: 5, marginTop: 1 }}>
          <Image source={require("../assets/images/LibraryMFUIndex.png")} />
        </View>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Welcome to</Text>
        <Text style={{ fontSize: 32, fontWeight: "bold" }}>Mfu Library</Text>
        <View
          style={{ alignItems: "center", marginBottom: 10, marginTop: 10 }}
        ></View>
        <Button
          title="Enter"
          color="#E64646"
          onPress={() => router.push("./login")}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
});
