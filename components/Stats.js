import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Modal, Button, ScrollView,} from 'react-native';
import { useBudget } from './BudgetContext';
import { initializeApp } from "firebase/app";
import {getDatabase, push,remove, ref, onValue, set} from "firebase/database"
import Icon from 'react-native-vector-icons/FontAwesome/';

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
  const [expenseStats, setExpenseStats] = useState(0.00);
  const [incomeStats, setIncomeStats] = useState(0.00);

  useEffect(() => {
    const totalExpenseRef = ref(database, 'totalExpense/');
  
    onValue(totalExpenseRef, (snapshot) => {
      const totalExpenseAmount = parseFloat(snapshot.val() || 0);
      setExpenseStats(totalExpenseAmount);
    });
  }, []);
  
  useEffect(() => {
    const totalIncomeRef = ref(database, 'totalIncome/');
  
    onValue(totalIncomeRef, (snapshot) => {
      const totalIncomeAmount = parseFloat(snapshot.val() || 0);
      setIncomeStats(totalIncomeAmount);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text  style={styles.expense}>{expenseStats}€</Text>
      <Text style={styles.income}>{incomeStats}€</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    margin: 20,
    flexDirection: 'row',
    backgroundColor: 'white'
  },
  expense: {
    margin: 10,
    marginTop: 50,
    padding: 5,
    borderWidth: 0.5,
    borderColor: 'black',
    borderRadius: 50,
    width: 150,
    textAlign: 'center',
    fontSize: 50,
    backgroundColor: 'teal',
    color: 'orange'
  },
  income: {
    margin: 10,
    marginTop: 50,
    padding: 5,
    borderWidth: 0.5,
    borderColor: 'black',
    borderRadius: 50,
    width: 150,
    textAlign: 'center',
    fontSize: 50,
    backgroundColor: 'teal',
    color: 'orange'
  }
});
