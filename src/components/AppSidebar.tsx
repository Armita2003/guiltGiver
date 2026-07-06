import { colors, globalStyles } from "@/styles/global";
import { on } from "@/utils/events";
import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

const SIDEBAR_WIDTH = Dimensions.get("window").width;

const menuItems = [
  { label: "Profile", route: "/profile", icon: "person-circle-outline" as const },
];

export default function AppSidebar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const slideAnim = useState(new Animated.Value(-SIDEBAR_WIDTH))[0];
  const router = useRouter();
  const pathname = usePathname();

  const openMenu = () => {
    setMenuOpen(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: -SIDEBAR_WIDTH,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setMenuOpen(false));
  };

  const handleNavigate = (route: string) => {
    router.push(route as any);
    closeMenu();
  };

  useEffect(() => {
    return on("menu:open", openMenu);
  }, []);

  return (
    <Modal
      visible={menuOpen}
      transparent
      animationType="none"
      onRequestClose={closeMenu}
    >
      <Pressable
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)" }}
        onPress={closeMenu}
      >
        <Animated.View
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: SIDEBAR_WIDTH,
            backgroundColor: colors.surface,
            borderRightWidth: 1,
            borderRightColor: colors.depth,
            transform: [{ translateX: slideAnim }],
            padding: 24,
            paddingTop: 60,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 32,
            }}
          >
            <Text style={globalStyles.title}>Menu</Text>
            <Pressable onPress={closeMenu} hitSlop={8}>
              <Ionicons name="close" size={24} color="white" />
            </Pressable>
          </View>

          <ScrollView
            style={{ marginBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
            {menuItems.map((item) => {
              const isSelected = pathname === item.route;

              return (
                <Pressable
                  key={item.route}
                  onPress={() => handleNavigate(item.route)}
                  style={({ pressed }) => [
                    {
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                      opacity: pressed ? 0.7 : 1,
                      paddingVertical: 12,
                      paddingHorizontal: 12,
                      borderRadius: 12,
                      marginVertical: 4,
                    },
                    isSelected && { backgroundColor: colors.sutleDepth },
                  ]}
                >
                  <Ionicons
                    name={item.icon}
                    size={22}
                    color={isSelected ? colors.text : colors.textSecondary}
                  />
                  <Text
                    style={[
                      globalStyles.secondarySubTitle,
                      {
                        color: isSelected ? colors.text : colors.textSecondary,
                      },
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View
            style={{
              marginTop: "auto",
              paddingTop: 24,
              borderTopWidth: 1,
              borderTopColor: colors.depth,
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
        </Animated.View>
      </Pressable>
    </Modal>
  );
}
