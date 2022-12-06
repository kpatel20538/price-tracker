import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from 'react-native-elements';
import LoadingPhase from './src/components/LoadingPhase';
import Navigator from './src/components/Navigator';

export default function App() {
  return (
    <LoadingPhase>
      <ThemeProvider>
        <NavigationContainer>
          <StatusBar />
          <Navigator />
        </NavigationContainer>
      </ThemeProvider>
    </LoadingPhase>
  );
}
