import MacroGrid from "@/components/MacroGrid";
import RecentMeals from "@/components/RecentMeals";
import { getMeals, Meal } from "@/storage/meals";
import { colors, globalStyles } from "@/styles/global";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { on } from "../_layout";

const SIDEBAR_WIDTH = Dimensions.get("window").width * 1; // 100% of screen

type MenuItem = {
  label: string;
  route: string;
  icon: string;
};

const menuItems: MenuItem[] = [
  { label: "Home", route: "/", icon: "home" },
  { label: "Add Meals", route: "/add-meals", icon: "add-circle" },
  { label: "All Meals", route: "/meals", icon: "list" },
];

export default function HomeScreen() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const slideAnim = useState(new Animated.Value(-SIDEBAR_WIDTH))[0];
  const router = useRouter();

  const loadMeals = async () => {
    const data = await getMeals();
    setMeals(data);
    console.log("Loaded meals:", data);
  };

  useFocusEffect(
    useCallback(() => {
      loadMeals();
    }, [])
  );

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
    <>
      <ScrollView
        contentContainerStyle={[
          globalStyles.container,
          globalStyles.pageContent,
        ]}
        style={{ flex: 1, backgroundColor: colors.background }}
        showsVerticalScrollIndicator={false} // Hide ugly scrollbar
        keyboardShouldPersistTaps="handled" // Allow taps while keyboard is open
        bounces={true} // iOS bounce effect (optional)
        overScrollMode="always"
      >
        {/* <Text style={globalStyles.title}>Guilt Giver</Text> */}
        <View style={{ gap: 4, marginBottom: 24 }}>
          <Text style={globalStyles.subtitle}>SYSTEM STATUS: UNIMPRESSED</Text>
          <Text style={globalStyles.sectionTitle}>Feed the machine.</Text>
          <Text style={globalStyles.secondarySubTitle}>
            Did you really need that second snack? Your data says otherwise.
          </Text>
          {/* <HomeHeader /> */}
        </View>
        <MacroGrid />
        <RecentMeals meals={meals} />
      </ScrollView>
      <Modal
        visible={menuOpen}
        transparent
        animationType="none"
        onRequestClose={closeMenu}
      >
        {/* Backdrop - closes menu on tap */}
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)" }}
          onPress={closeMenu}
        >
          {/* Sidebar Panel - slides in from left */}
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
              paddingTop: 60, // Account for status bar
            }}
          >
            {/* Header with Close Button */}
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

            {/* Navigation Links */}
            <ScrollView
              style={{ gap: 24, marginBottom: 20 }}
              showsVerticalScrollIndicator={false}
            >
              {menuItems.map((item) => (
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
                    },
                  ]}
                >
                  <Ionicons name={item.icon as any} size={22} color="white" />
                  <Text style={globalStyles.sectionTitle}>{item.label}</Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* Optional: App Info at Bottom */}
            <View
              style={{
                marginTop: "auto",
                paddingTop: 24,
                borderTopWidth: 1,
                borderTopColor: colors.depth,
              }}
            >
              <Text style={globalStyles.secondarySubTitle}>
                Guilt Giver v1.0
              </Text>
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
    </>
  );
}
