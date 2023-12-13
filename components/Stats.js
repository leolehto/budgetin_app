import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet} from 'react-native';
import {getDatabase, push, ref, onValue, remove, set, query, orderByChild, equalTo, startAt,endAt} from "firebase/database"
import { initializeApp } from "firebase/app";
import CalendarPicker from 'react-native-calendar-picker';
import moment, { months } from 'moment';

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

export default function Stats(){
    const[expenses, setExpenses] = useState(0.00);
    const[incomes, setIncomes] = useState(0.00);
    const[result, setResult] = useState(0.00); 

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState('');

    //get first and last day of each mont
    const firstDayOfMonth = moment().startOf('month').format('YYYY-MM-DD');
    const lastDayOfMonth = moment().endOf('month').format('YYYY-MM-DD');

    /* onDateChange function to set timeline on calendar by pickind start and end.
    fetching expenses and incomes from db and sortin them by date and amount */
    const onDateChange = (date, type) => {
        if (type === 'END_DATE') {
          setEndDate(date);
        } else {
          setStartDate(date);
          setEndDate(date);
        }
      };
    
      useEffect(() => {
        if (startDate && endDate) {
          const expensesRef = ref(database, 'expenses');
          const incomeRef = ref(database, '/incomes');
          const formatStart = moment(startDate).format('YYYY-MM-DD');
          const formatEnd = moment(endDate).format('YYYY-MM-DD');
    
          const expensesQuery = query(
            expensesRef,
            orderByChild('date'),
            startAt(formatStart),
            endAt(formatEnd)
          );

          const incomesQuery = query(
            incomeRef,
            orderByChild('date'),
            startAt(formatStart),
            endAt(formatEnd)
          )
    
          onValue(expensesQuery, (snapshot) => {
            const expensesData = snapshot.val();
            const expensesArray = Object.values(expensesData || []);
            const expenseAmountsArray = expensesArray.map((expense) => expense.amount);
            const totalExpenseAmount = expenseAmountsArray.reduce((ex, amount) => ex + amount, 0);
            setExpenses(totalExpenseAmount);
          });

          onValue(incomesQuery, (snapshot) => {
            const incomesData = snapshot.val();
            const incomesArray = Object.values(incomesData || []);
            const incomeAmountsArray = incomesArray.map((income) => income.amount);
            const totalIncomeAmount = incomeAmountsArray.reduce((inc, amount) => inc + amount, 0);
            setIncomes(totalIncomeAmount)
            
          })
          
        }
      }, [startDate, endDate]);
      //calculate difference and setResult everytime dates are changed
      useEffect(() => {
        if (typeof expenses === 'number' && typeof incomes === 'number') {
          const difference = incomes - expenses;
          setResult(difference);
        }
      }, [expenses, incomes]);

      //set calendar to cover whole month when page is rendered
      useEffect(() =>{
        setStartDate(firstDayOfMonth);
        setEndDate(lastDayOfMonth);
      }, [])
      
      return (
        <View style={styles.container}>
          <View style={styles.display}> 
          <View>
          <Text style={{marginLeft: 40, fontSize: 15}}>Menot</Text>
          <View style={styles.expenses}>
            <Text style={{fontSize: 22, color: 'orange'}}>{expenses} €</Text>
          </View>
          </View>
          <View>
          <Text style={{marginLeft: 40, fontSize: 15}}>Tulot</Text>
          <View style={styles.incomes}>
            <Text style={{fontSize: 22, color: 'orange'}}>{incomes} €</Text>
          </View>
          </View>
          </View> 
          <View style={styles.result}>
          <Text style={{fontSize: 22, color: 'orange'}}>{result} €</Text>
            </View>
          <View style={styles.calendar}>
            <CalendarPicker
              months={['Tammikuu', 'Helmikuu', 'Maaliskuu', 'Huhtikuu', 'Toukokuu', 'Kesäkuu',
                'Heinäkuu', 'Elokuu', 'Syyskuu', 'Lokakuu', 'Marraskuu', 'Joulukuu']}
              weekdays={['Su', 'Ma', 'Ti', 'Ke', 'To', 'Pe', 'La']}
              onDateChange={onDateChange}
              selectedStartDate={startDate}
              selectedEndDate={endDate}
              allowRangeSelection={true}
              resetSelections={true}
              todayBackgroundColor='orange'
              selectedDayColor='teal'
              width={400}
            />
          </View>
        </View>
      );
}

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      alignItems: 'center', 
      backgroundColor: 'white'
    },
    display:{
        flexDirection: 'row',
        margin: 20,
        backgroundColor: 'white',
        borderWidth: 0,
        width: '100%',
        height: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    expenses: {
        borderWidth: 0.3,
        borderRadius: 50,
        backgroundColor: 'teal',
        margin: 10,
        padding: 5,
        alignItems: 'center',
        width: 120
    },
    incomes: {
        borderWidth: 0.3,
        borderRadius: 50,
        backgroundColor: 'teal',
        margin: 10,
        padding: 5,
        alignItems: 'center',
        width: 120
    },
    result:{
        borderWidth: 0.3,
        padding: 4,
        backgroundColor: 'teal',
        borderRadius: 50,
        width: 120,
        alignItems: 'center'
    },
    calendar: {
      flex: 2, 
      margin: 10, 
    },
  });