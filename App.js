import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons} from '@expo/vector-icons';  
import HomePage from './HomePage';
import Stats from './Stats';
const Tab = createBottomTabNavigator();

const screenOptions = ({ route }) => ({
  tabBarStyle:{
    backgroundColor: 'black',
    height: 50
  },

  tabBarIcon: ({ focused, color, size }) => {
    let iconName;

    if (route.name === 'Home') {
      iconName = 'md-home';
    } else if (route.name === 'Stats') {
      iconName = 'md-stats-chart';
    }

    return <Ionicons name={iconName} size={size} color={'orange'} backgroundColor={'black'} />;
  }
});
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={screenOptions}>
        <Tab.Screen name="Home" component={HomePage} />
        <Tab.Screen name="Stats" component={Stats} />
      </Tab.Navigator>
    </NavigationContainer>
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