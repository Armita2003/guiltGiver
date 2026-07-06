import { colors } from "@/styles/global";
import { StyleSheet } from "react-native";

export const LOG_ACCENT_COLORS = [
  colors.text,
  colors.secondaryActions,
  colors.gridColors.primary,
] as const;

export const LogMealCardStyles = StyleSheet.create({
  card: {
    backgroundColor: "#161616",
    borderWidth: 1,
    borderColor: "#282825",
    marginBottom: 12,
    overflow: "hidden",
  },
  cardInner: {
    flexDirection: "row",
    minHeight: 100,
  },
  accentBar: {
    width: 5,
  },
  content: {
    flex: 1,
    padding: 14,
    paddingLeft: 12,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  name: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: colors.white,
    letterSpacing: 0.5,
  },
  calories: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  meta: {
    marginTop: 6,
    fontSize: 12,
    color: colors.textTertiary,
    letterSpacing: 0.3,
  },
  macroRow: {
    flexDirection: "row",
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#282825",
    gap: 16,
  },
  macroItem: {
    flex: 1,
  },
  macroLabel: {
    fontSize: 9,
    fontWeight: "600",
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  macroValue: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.white,
  },
  searchInput: {
    backgroundColor: "#161616",
    borderWidth: 1,
    borderColor: "#282825",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.white,
    fontSize: 12,
    letterSpacing: 0.5,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    marginBottom: 20,
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#282825",
    backgroundColor: "#161616",
  },
  filterTabActive: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  filterText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.white,
    letterSpacing: 0.5,
  },
  filterTextActive: {
    color: colors.background,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  sectionCalories: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textTertiary,
    letterSpacing: 0.5,
  },
  footerBox: {
    marginTop: 24,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#393939",
    borderStyle: "dashed",
  },
  footerText: {
    fontSize: 11,
    color: colors.textTertiary,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  pageSubtitle: {
    fontSize: 11,
    color: colors.textTertiary,
    letterSpacing: 0.4,
    marginTop: 4,
  },
});
