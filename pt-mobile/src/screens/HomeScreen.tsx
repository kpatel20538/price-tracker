import React from 'react';
import { StyleSheet, View } from "react-native"
import { FAB, Icon } from 'react-native-elements'
import { RootStackScreenProps } from "../components/Navigator"

const styles = StyleSheet.create({
  container: { 
    position: 'relative',
    flex: 1
  },
  fab: { 
    position: 'absolute', 
    bottom: 32, 
    right: 32 
  }
});

export default function HomeScreen({ navigation }: RootStackScreenProps<'Home'>) {
  return <View style={styles.container}>
    <FAB 
      style={styles.fab} 
      onPress={() => navigation.push('TrackPrice')} 
      icon={<Icon name="add" color="white" />} 
    />
  </View>
}