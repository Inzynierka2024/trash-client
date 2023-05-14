import { useContext, useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { ThemeContext } from "../../../theme/theme";
import { is_android } from "../../Utils/is_android";
import { MapComponent } from "./MapComponent";
import { NoPermissionScreen } from "./NoPermission";
import MapLibreGL from "@maplibre/maplibre-react-native";

export const MapContainer = () => {
  const themeFromContext = useContext(ThemeContext);

  const [permissions, setPermissions] = useState({
    isFetchingPermissions: is_android(),
    isLocationGranted: false,
  });

  async function checkPermissions() {
    const isGranted = await MapLibreGL.requestAndroidLocationPermissions();
    setPermissions({
      isLocationGranted: isGranted,
      isFetchingPermissions: false,
    });
  }

  useEffect(() => {
    // Set up permissions and stuff on first load
    checkPermissions().finally(() => {
      console.log(`Perms: location=${permissions.isLocationGranted}`);
    });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: themeFromContext.colors.background,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {permissions.isFetchingPermissions && (
        <Text>Accept location permission</Text>
      )}
      {permissions.isLocationGranted && !permissions.isFetchingPermissions && (
        <MapComponent />
      )}
      {!permissions.isLocationGranted && !permissions.isFetchingPermissions && (
        <NoPermissionScreen checkPermissions={checkPermissions} />
      )}
    </View>
  );
};
