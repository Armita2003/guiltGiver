import { useAuth } from "@/contexts/AuthContext";
import { colors, globalStyles } from "@/styles/global";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type AuthModalProps = {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  title?: string;
  subtitle?: string;
};

export default function AuthModal({
  visible,
  onClose,
  onSuccess,
  title = "Sign In",
  subtitle = "Sign in to unlock AI and sync your meals across devices.",
}: AuthModalProps) {
  const { signInWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setMarketingConsent(false);
    setIsRegister(false);
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSuccess = () => {
    resetForm();
    onSuccess?.();
    onClose();
  };

  const runAction = async (action: () => Promise<void>) => {
    setError(null);
    setIsSubmitting(true);
    try {
      await action();
      handleSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.lockBadge}>
              <MaterialCommunityIcons
                name="lock-open-outline"
                size={22}
                color={colors.button}
              />
            </View>
            <Pressable onPress={handleClose} hitSlop={8}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </Pressable>
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor={colors.gridColors.unfilled}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="At least 6 characters"
              placeholderTextColor={colors.gridColors.unfilled}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
            {isRegister && (
              <ConsentCheckbox
                checked={marketingConsent}
                onToggle={() => setMarketingConsent((v) => !v)}
              />
            )}
            <PrimaryButton
              label={isRegister ? "Create Account" : "Sign In"}
              loading={isSubmitting}
              onPress={() =>
                runAction(() =>
                  signInWithEmail(email, password, isRegister, marketingConsent)
                )
              }
            />
            <TouchableOpacity
              onPress={() => {
                setIsRegister((v) => !v);
                setError(null);
              }}
              style={styles.switchMode}
            >
              <Text style={styles.switchModeText}>
                {isRegister
                  ? "Already have an account? Sign in"
                  : "New here? Create an account"}
              </Text>
            </TouchableOpacity>

            {error && <Text style={styles.errorText}>{error}</Text>}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function ConsentCheckbox({
  checked,
  onToggle,
}: {
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable style={styles.consentRow} onPress={onToggle}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Ionicons name="checkmark" size={14} color="#283500" />}
      </View>
      <Text style={styles.consentText}>
        I agree to receive occasional emails about Guilt Giver and other apps.
        I'll ask for permission before sending anything (rarely, I'm lazy).
      </Text>
    </Pressable>
  );
}

function PrimaryButton({
  label,
  loading,
  onPress,
}: {
  label: string;
  loading: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.button, loading && styles.buttonDisabled]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="#283500" />
      ) : (
        <Text style={styles.buttonText}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    maxHeight: "85%",
    borderWidth: 1,
    borderColor: colors.depth,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  lockBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.sutleDepth,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    ...globalStyles.sectionTitle,
    fontSize: 20,
  },
  subtitle: {
    ...globalStyles.secondarySubTitle,
    marginTop: 6,
    marginBottom: 16,
    lineHeight: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
    marginTop: 8,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: colors.background,
    color: colors.text,
    padding: 14,
    borderRadius: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: colors.depth,
  },
  consentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginTop: 14,
    marginBottom: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.depth,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.button,
    borderColor: colors.button,
  },
  consentText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  button: {
    backgroundColor: colors.button,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#283500",
    fontSize: 15,
    fontWeight: "700",
  },
  switchMode: {
    marginTop: 12,
    alignItems: "center",
  },
  switchModeText: {
    color: colors.button,
    fontSize: 13,
  },
  errorText: {
    color: colors.alert,
    fontSize: 13,
    marginTop: 12,
    textAlign: "center",
  },
});
