
import Loginpg from "../Screens/Loginpg";
import SignupAgree from "../Screens/SignupAgree";
import Agreement1 from "../Screens/Agreement1";
import Agreement2 from "../Screens/Agreement2";
import Agreement3 from "../Screens/Agreement3";
import SignupPg from "../Screens/SignupPg";
import ForgotPW from "../Screens/ForgotPW";
import SuccessPW from "../Screens/SuccessPW";
import SuccessLogin from "../Screens/SuccessLogin";
import Budgetpg from "../Screens/Budgetpg";
import MainStackNavigation from "./MainStackNavigation";
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const LoginStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoginpgStack" component={Loginpg} />
      <Stack.Screen name="SignupAgree" component={SignupAgree} />
      <Stack.Screen name="Agreement1" component={Agreement1} />
      <Stack.Screen name="Agreement2" component={Agreement2} />
      <Stack.Screen name="Agreement3" component={Agreement3} />
      <Stack.Screen name="SignupPg" component={SignupPg} />
      <Stack.Screen name="ForgotPW" component={ForgotPW} />
      <Stack.Screen name="SuccessPW" component={SuccessPW} />
      <Stack.Screen name="SuccessLogin" component={SuccessLogin} />
      <Stack.Screen name="Budgetpg" component={Budgetpg} />
    </Stack.Navigator>
  )
};

export default LoginStackNavigator;
