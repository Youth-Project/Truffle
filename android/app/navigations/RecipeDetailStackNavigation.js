import RecipeTab from "../Screens/RecipeTab";
import UserRecipeTab from "../Screens/UserRecipeTab";
import UserRecipeMain from "../Screens/UserRecipeMain";
import UserRecipeDetail from "../Screens/UserRecipeDetail";
import RecipeMain from "../Screens/RecipeMain";
import RecipeDetail from "../Screens/RecipeDetail";
import AddRecipeMain from "../Screens/AddRecipeMain";
import AddRecipeIngredients from "../Screens/AddRecipeIngredients";
import AddProgress from "../Screens/AddProgress";

import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const RecipeDetailStackNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RecipeTab" component={RecipeTab} />
      <Stack.Screen name="UserRecipeTab" component={UserRecipeTab} />
      <Stack.Screen name="UserRecipeMain" component={UserRecipeMain} />
      <Stack.Screen name="UserRecipeDetail" component={UserRecipeDetail} />
      <Stack.Screen name="RecipeMain" component={RecipeMain} />
      <Stack.Screen name="RecipeDetail" component={RecipeDetail} />
      <Stack.Screen name="AddRecipeMain" component={AddRecipeMain} />
  {/*<Stack.Screen name="AddRecipeIngredients" component={AddRecipeIngredients} />*/}
      <Stack.Screen name="AddProgress" component={AddProgress} />
    </Stack.Navigator>
  )
};

export default RecipeDetailStackNavigation;
