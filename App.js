import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Expense from "./components/Expense";
import Income from "./components/Income";
import Stats from './components/Stats';
import { BudgetProvider } from './components/BudgetContext';
import { CalendarProvider } from './components/CalendarContext'
import Icon from 'react-native-vector-icons/FontAwesome/';

const Tab = createBottomTabNavigator();
export default function App() {
  const screenOptions = ({ route }) => ({
    tabBarIcon: ({}) => {
      let iconName;
  
      if (route.name === 'Menot') {
        iconName = 'credit-card-alt';
      } else if (route.name === 'Tulot') {
        iconName = 'bank';
      }else if (route.name === 'Stats'){
        iconName = 'bar-chart'
      }
  
      return <Icon name={iconName} size={35} color={'orange'} />;
    },
    tabBarStyle:{
      backgroundColor: 'white',
      borderRadius: 1
    }
      
  });
  return (
  <BudgetProvider>
    <NavigationContainer>
      <Tab.Navigator screenOptions={screenOptions} >
        <Tab.Screen name="Menot" component={Expense} />
        <Tab.Screen name='Stats' component={Stats}/>
        <Tab.Screen name="Tulot" component={Income}/>
      </Tab.Navigator>
    </NavigationContainer>
  </BudgetProvider>
  );
}
