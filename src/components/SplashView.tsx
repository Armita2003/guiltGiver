import { colors } from "@/styles/global";
import React from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";

export default function SplashView() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/splash-icon.png")}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.overlay} />
      <View style={styles.bottom}>
        <ActivityIndicator size="large" color={colors.gridColors.secondary} />
        <Text style={styles.text}>LOADING YOUR REGRET</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.28)",
  },
  bottom: {
    position: "absolute",
    bottom: 90,
    left: 0,
    right: 0,
    alignItems: "center",
    gap: 12,
  },
  text: {
    marginTop: 8,
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
  },
});
