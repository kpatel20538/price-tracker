import React from 'react';
import { StyleSheet, View, TextInput, ViewStyle, StyleProp } from "react-native"
import { Input, Avatar, Text } from 'react-native-elements'

const styles = StyleSheet.create({
  pagePadding: { padding: 40 },
  sectionMargin: { marginBottom: 24 },
  itemMargin: { marginRight: 12, },
  debugBorder: {
    borderColor: "crimson",
    borderStyle: "dashed",
    borderWidth: 1,
  },
  container: {
    flex: 1,
    
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  inputContainer: {
    
    flexDirection: 'row',
    borderColor: "gainsboro",
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
  },
  input: {
    flex: 1,
    textAlign: 'center'
  },
  label: {
    fontFamily: 'RobotoSlab',
    textAlign: 'center',
    fontSize: 12,
    color: 'grey',
    marginBottom: 6,
  }
})

type TrackerInputProps = {
  label: string;
  style?: StyleProp<ViewStyle>;
}


function toDisplayPrice(value: string) {
  //
}

function TrackerInput({ label, style }: TrackerInputProps) {
  return <View style={[styles.container, style]}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputContainer}>
      <TextInput style={styles.input} keyboardType="decimal-pad" />
    </View>
  </View>
}

export default function TrackPriceScreen() {
  return <View style={{ padding: 40 }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 }}>
      <Avatar source={{ uri: 'https://placeimg.com/256/256/nature', }} size="large" rounded />
      <View>
        <Text>Lorem Ipsum</Text>
      </View>
    </View>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <TrackerInput style={styles.itemMargin} label="Price" />
      <TrackerInput style={styles.itemMargin} label="Quantity" />
      <TrackerInput label="Unit Price" />
    </View>
  </View>
}