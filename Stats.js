import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Picker, StyleSheet } from 'react-native';

export default function StatScreen() {
    return (
      <View style={styles.container}>
        <Text>ToDo!</Text>
      </View>
    );
  }
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });