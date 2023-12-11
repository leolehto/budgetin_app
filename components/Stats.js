import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { useBudget } from './BudgetContext';
import { initializeApp } from "firebase/app";
import {getDatabase, ref, onValue, query, orderByChild, startAt, endAt} from "firebase/database"
import Icon from 'react-native-vector-icons/FontAwesome/';
import { BarChart} from "react-native-gifted-charts";
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';


const firebaseConfig = {
    apiKey: "AIzaSyD9v0yEX56WUmxTX7-B3yC0QmzcHwiBghc",
    authDomain: "budgetin-app-ca711.firebaseapp.com",
    databaseURL: "https://budgetin-app-ca711-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "budgetin-app-ca711",
    storageBucket: "budgetin-app-ca711.appspot.com",
    messagingSenderId: "352476025044",
    appId: "1:352476025044:web:0f9fdca8d447b9292d2b41"
  };
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app)

export default function StatPage() {
  const data=[{value: 1}, {value: 2}]  
  const firstDayOfMonth = moment().startOf('month').format('YYYY-MM-DD');
  const lastDayOfMonth = moment().endOf('month').format('YYYY-MM-DD');
  const [startDate, setStartDate] = useState(firstDayOfMonth);
  const [endDate, setEndDate] = useState(lastDayOfMonth);
  const [expense, setExpense] = useState(0.00);
  const [income, setIncome] = useState(0.00);

  const onDateChange = (date, type) => {
    if (type === 'END_DATE') {
      setEndDate(date);
    } else {
      setStartDate(date);
      setEndDate(date);

      const expensesRef = ref(database, 'expenses');
      const incomesRef = ref(database, 'incomes/');
      const formatStart = moment(startDate).format('YYYY-MM-DD');
      const formatEnd = moment(endDate).format('YYYY-MM-DD');
  
      const expensesQuery = query(
        expensesRef,
        orderByChild('date'),
        startAt(formatStart),
        endAt(formatEnd)
      );
      const incomesQuery = query(
        incomesRef,
        orderByChild('date'),
        startAt(formatStart),
        endAt(formatEnd)
      )
      onValue(expensesQuery, (snapshot) => {
        const expensesData = snapshot.val();
        const expensesArray = Object.values(expensesData || []);
        const expenseDataArray = expensesArray.map((expense) => expense.amount);
        const totalE = expenseDataArray.reduce((ex, amount) => ex + amount, 0);
        //console.log('Expenses within selected timeline:', expenseDataArray);
        setExpense(totalE);
        console.log(expense)
        
      });
      onValue(incomesQuery, (snapshot) => {
        const incomesData = snapshot.val();
        const incomesArray = Object.values(incomesData || []);
        const incomeDataArray = incomesArray.map((income) => income.amount);
        const totalI = incomeDataArray.reduce((inc, amount) => inc + amount, 0);
        setIncome(totalI);
        console.log(income)
        
      });

    }
  };

  return (
    <View style={styles.container}>
     <View style={styles.barChart}>
      <BarChart initialSpacing={5} spacing={1} data = {data} maxValue={2000} height={200} barBorderRadius={10} 
      barBorderColor={'orange'} color={'orange'}/>
    </View>
    <View style={styles.calendar}>
     <CalendarPicker
        allowRangeSelection={true}
        selectedStartDate={startDate}
        selectedEndDate={endDate}
        onDateChange={onDateChange}
        height={600}
        width={400}

     /> 
    </View>
    <Text>{String(startDate)}</Text>
    <Text>{String(endDate)}</Text>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    margin: 0,
    backgroundColor: 'white',
    padding: 0,
  },
  barChart:{
    margin: 10
  },
  calendar:{
    marginRight: 100,
    marginTop: 20
  }
  

});
