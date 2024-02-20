import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from './android/app/navigations/TabNavigation';
import LoginStackNavigator from './android/app/navigations/LoginStackNavigation';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';

const Stack = createNativeStackNavigator();

function App() {
  export function signIn({email, password}) {
    return auth().signInWithEmailAndPassword(email, password);
  }
  
  export function signUp({email, password}) {
    return auth().createUserWithEmailAndPassword(email, password);
  }
  
  export function subscribeAuth(callback) {
    return auth().onAuthStateChanged(callback);
  }


  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator
        screenOptions={({ route }) => ({ headerShown: false })}
        initialRouteName={signUp ? 'TabNavigator' : 'LoginStackNavigator'}
      >
        {signUp ? (
          <Stack.Screen name='TabNavigator' component={TabNavigator} />
        ) : (
          <Stack.Screen
            name='LoginStackNavigator'
            options={{ animationEnabled: false }} // 초기 로그인 시 네비게이션 애니메이션 제거
          >
            {(props) => (
              <Stack.Screen name='LoginStackNavigator' component={LoginStackNavigator} />
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
