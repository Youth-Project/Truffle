import SettingsView from "../Screens/SettingsView";
import MonthlyModifyView from "../Screens/MonthlyModifyView";
import CreditView from "../Screens/CreditView";
import LoginStackNavigation from "./LoginStackNavigation";
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const SettingStackNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SetView" component={SettingsView} />
      <Stack.Screen name="MonthlyModifyView" component={MonthlyModifyView} />
      <Stack.Screen name="CreditView" component={CreditView} />
    </Stack.Navigator>
  )
};

export default SettingStackNavigation;
