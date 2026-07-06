import AuthModal from "@/components/AuthModal";
import NutritionGoalsCard from "@/components/NutritionGoalsCard";
import { useAuth } from "@/contexts/AuthContext";
import { colors, globalStyles } from "@/styles/global";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function ProfileScreen() {
  const { user, isAiUnlocked, signOut } = useAuth();
  const [authModalVisible, setAuthModalVisible] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    Toast.show({
      type: "success",
      text2: "Signed out successfully.",
      position: "bottom",
    });
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={[
          globalStyles.container,
          globalStyles.pageContent,
          styles.content,
        ]}
        style={{ flex: 1, backgroundColor: colors.background }}
        showsVerticalScrollIndicator={false}
      >
        <View style={globalStyles.sectionSpacing}>
          {/* <Text style={globalStyles.sectionTitle}>YOUR PROFILE</Text> */}
          <Text style={globalStyles.secondarySubTitle}>
            Manage your account and meal log.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.avatarRow}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={32} color={colors.button} />
            </View>
            <View style={styles.avatarInfo}>
              <Text style={styles.displayName}>
                {user?.email ?? "Not signed in"}
              </Text>
            </View>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>AI Estimate</Text>
            <View style={styles.badgeRow}>
              <MaterialCommunityIcons
                name={isAiUnlocked ? "lock-open-outline" : "lock-outline"}
                size={16}
                color={isAiUnlocked ? colors.button : colors.textSecondary}
              />
              <Text
                style={[
                  styles.statValue,
                  { color: isAiUnlocked ? colors.button : colors.textSecondary },
                ]}
              >
                {isAiUnlocked ? "Unlocked" : "Locked"}
              </Text>
            </View>
          </View>

          {user?.marketingConsent && (
            <View style={styles.consentBanner}>
              <Ionicons name="mail-outline" size={16} color={colors.button} />
              <Text style={styles.consentBannerText}>
                You're opted in for occasional updates.
              </Text>
            </View>
          )}
        </View>

        <NutritionGoalsCard />

        {user ? (
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setAuthModalVisible(true)}
          >
            <Text style={styles.primaryButtonText}>Sign In / Create Account</Text>
          </TouchableOpacity>
        )}

        {!user && (
          <Text style={styles.hint}>
            Create an account with email and password. Meals are saved to your
            account on this device.
          </Text>
        )}

        <View
            style={{
              marginTop: "auto",
              paddingTop: 12,
              borderTopWidth: 1,
              borderTopColor: colors.depth,
              bottom: 0,
              left: 16,
              right: 16,
              position: "absolute",
            }}
          >
            <Text style={globalStyles.secondarySubTitle}>Guilt Giver v1.0</Text>
            <Text
              style={[
                globalStyles.secondarySubTitle,
                { marginTop: 4, fontSize: 11 },
              ]}
            >
              Your data. Your guilt. Your choice.
            </Text>
          </View>
      </ScrollView>

      <AuthModal
        visible={authModalVisible}
        onClose={() => setAuthModalVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 80,
  },
  card: {
    marginTop: 20,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.depth,
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 20,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.sutleDepth,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInfo: {
    flex: 1,
  },
  displayName: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.depth,
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  statValue: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "600",
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  consentBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
    padding: 10,
    backgroundColor: colors.sutleDepth,
    borderRadius: 8,
  },
  consentBannerText: {
    color: colors.textSecondary,
    fontSize: 12,
    flex: 1,
  },
  primaryButton: {
    backgroundColor: colors.button,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 24,
  },
  primaryButtonText: {
    color: "#283500",
    fontSize: 16,
    fontWeight: "700",
  },
  signOutButton: {
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 24,
    borderWidth: 1,
    borderColor: colors.alert,
  },
  signOutText: {
    color: colors.alert,
    fontSize: 16,
    fontWeight: "600",
  },
  hint: {
    color: colors.textTertiary,
    fontSize: 12,
    textAlign: "center",
    marginTop: 12,
    opacity: 0.7,
    lineHeight: 18,
  },
});
