import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from "react-native";

type CourseDemyLoadingScreenProps = {
  label?: string;
};

export default function CourseDemyLoadingScreen({
  label = "Đang tải",
}: CourseDemyLoadingScreenProps) {
  const bounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const bounceAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, {
          toValue: 1,
          duration: 450,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(bounce, {
          toValue: 0,
          duration: 450,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    bounceAnimation.start();

    return () => {
      bounceAnimation.stop();
    };
  }, [bounce]);

  const translateY = bounce.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -12],
  });

  return (
    <View
      style={styles.screen}
      accessibilityRole="progressbar"
      accessibilityLabel={label}
    >
      <Animated.View style={[styles.logo, { transform: [{ translateY }] }]}>
        <Text style={styles.logoText}>CD</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f8fafc",
  },
  logo: {
    width: 68,
    height: 68,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "#6d29d2",
    shadowColor: "#6d29d2",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 8,
  },
  logoText: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 0,
  },
});
