
import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {View, Button, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import BookmarkTab from "../Screens/BookmarkTab";
import RecipeDetailStackNavigation from "../navigations/RecipeDetailStackNavigation";
import RefTab from "../Screens/RefTab";

const Tab = createMaterialTopTabNavigator();

function RecipeTabNavigator() {
  return (
    <Tab.Navigator
    initialRouteName="RefTab"
    tabBarOptions={{
      indicatorStyle: {
        backgroundColor: '#FEA655', // 활성화된 탭의 아래 표시줄 색상
      },
    }}
    screenOptions={{
      tabBarActiveTintColor: 'black',
      tabBarInactiveTintColor : '#D4D4D4',
      tabBarLabelStyle: { fontSize: 16, fontWeight : 'bold' },
      tabBarStyle: { backgroundColor: 'white' },
      headerShown: false,
      }}>

      <Tab.Screen
        name="RefTab"
        component={RefTab}
        options={{ tabBarLabel: '냉장고', unmountOnBlur: true }} 
      />
      <Tab.Screen
        name="RecipeTabStack"
        component={RecipeDetailStackNavigation}
        options={{ tabBarLabel: '레시피', unmountOnBlur: true }} 
      />
      <Tab.Screen
        name="BookmarkTab"
        component={BookmarkTab}
        options={{ tabBarLabel: '북마크', unmountOnBlur: true }} 
      />
    </Tab.Navigator>
  );
}
export default RecipeTabNavigator;
