import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button,FlatList, Picker, StyleSheet} from 'react-native';
export default function HomePage() {
const [budget, setBudget] = useState(0)
const[editing, setEditing] = useState(false)
const [expense, setExpense] = useState("")
const [expenses, setExpenses] = useState([])
const [totalExpense, setTotalExpense] = useState(0);
const [category, setCategory] = useState('');

const handleEditClick = () => {
    setEditing(!editing);
    
  };

  const handleSaveClick = () => {
    const newBudget = parseInt(budget);
    if(!isNaN(newBudget) && newBudget >= 0) {
    setBudget(newBudget);
      setEditing(false);
    } else {
    }
  };

  return (
    <View style={styles.container}>
      {editing ? (
        <View style={styles.setBudget}>
          <TextInput
            style={styles.inputField}
            keyboardType="numeric"
            value={budget !== 0 ? budget.toString() : ''}
            onChangeText={(text) => {
                if (text === '') {
                  setBudget(0); // Jos tekstikenttä tyhjennetään, aseta budjetti 0:ksi
                } else {
                  setBudget(parseInt(text) || 0); // Tarkista, että syöte on kelvollinen numero
                }
              }}
          />
          <Button title="Tallenna" onPress={handleSaveClick} />
        </View>
      ) : (
        <View style = {styles.editBudget}>
          <Text style={styles.text}>{budget} €</Text>
          <Button style={styles.editButton} title="Muokkaa" onPress={handleEditClick}  />
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    editBudget: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'

    },
    setBudget:{
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputField: {
        flex: 0,
        marginRight: 10,
        width: 150,
        borderBottomWidth: 2,
        textAlign: 'center',
        fontSize: 50
      },
      text:{
        marginRight: 10,
        fontSize: 50
      },
      editButton:{
        width: 20
      }
  });