import React from 'react';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import TrackPriceScreen from '../screens/TrackPriceScreen';

type RootStackParamsList = {
  Home: undefined;
  TrackPrice: undefined;
}

export type RootStackScreenProps<T extends keyof RootStackParamsList = keyof RootStackParamsList> =
  NativeStackScreenProps<RootStackParamsList, T>;

const RootStack = createNativeStackNavigator<RootStackParamsList>();

export default function Navigator() {
  return <RootStack.Navigator>
    <RootStack.Screen name="Home" component={HomeScreen} />
    <RootStack.Screen name="TrackPrice" component={TrackPriceScreen} />
  </RootStack.Navigator>
}