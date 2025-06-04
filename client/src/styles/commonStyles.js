import { StyleSheet } from "react-native";

const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 28,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#FAFAFA",
    color: "#212121",
    padding: 18,
    marginVertical: 12,
    borderRadius: 16, // Aumentado
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  button: {
    backgroundColor: "#D32F2F",
    padding: 18,
    marginVertical: 14,
    borderRadius: 20, // Mais arredondado
    alignItems: "center",
    shadowColor: "#D32F2F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.8,
  },
  linkText: {
    color: "#D32F2F",
    marginTop: 18,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "500",
  },
  title: {
    fontSize: 32, // Aumentado
    fontWeight: "800",
    marginBottom: 28,
    textAlign: "center",
    color: "#212121",
    letterSpacing: -0.8,
  },
  errorText: {
    color: "#D32F2F",
    marginBottom: 14,
    textAlign: "center",
    fontWeight: "500",
    fontSize: 15,
  },
  menuList: {
    marginTop: 28,
  },
  menuItemContainer: {
    flexDirection: "row",
    marginBottom: 24,
    borderRadius: 24, // Altamente arredondado
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  menuItemImage: {
    width: 120, // Aumentado
    height: 120, // Aumentado
    backgroundColor: "#F5F5F5",
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
  },
  menuItemInfo: {
    flex: 1,
    padding: 18,
    justifyContent: "space-between",
  },
  menuItemName: {
    fontSize: 20, // Aumentado
    fontWeight: "700",
    color: "#212121",
    marginBottom: 6,
  },
  menuItemDescription: {
    fontSize: 15,
    color: "#757575",
    marginVertical: 8,
    lineHeight: 22,
  },
  menuItemPrice: {
    fontSize: 20, // Aumentado
    fontWeight: "800",
    color: "#D32F2F",
    marginBottom: 12,
  },
  orderButton: {
    backgroundColor: "rgba(211, 47, 47, 0.1)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 16, // Mais arredondado
    alignSelf: "flex-start",
    borderWidth: 1.5,
    borderColor: "#D32F2F",
  },
  orderButtonText: {
    color: "#D32F2F",
    fontSize: 15,
    fontWeight: "700",
  },
});

export default commonStyles;
