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
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;
  
      if (route.name === 'Expenses') {
        iconName = 'credit-card-alt';
      } else if (route.name === 'Incomes') {
        iconName = 'bank';
      }else if (route.name === 'Stats'){
        iconName = 'bar-chart'
      }
  
      return <Icon name={iconName} size={30} color={'orange'} />;
    },
    tabBarStyle:{
      backgroundColor: 'teal',
      borderRadius: 1
    }
      
  });
  return (
  <BudgetProvider>
    <NavigationContainer>
      <Tab.Navigator screenOptions={screenOptions} >
        <Tab.Screen name="Expenses" component={Expense} />
        <Tab.Screen name='Stats' component={Stats}/>
        <Tab.Screen name="Incomes" component={Income}/>
      </Tab.Navigator>
    </NavigationContainer>
  </BudgetProvider>
  );
}
