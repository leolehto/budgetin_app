import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Modal, Button,} from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function App() {
  const [budget, setBudget] = useState(0);
  const [editing, setEditing] = useState(false);
  const [expense, setExpense] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [category, setCategory] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [expenseModalVisible, setExpenseModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

 
  const handleEditClick = () => {
    setModalVisible(true);
  };

  const closeEditClick = () => {
    setModalVisible(false);
  }
  
  const handleAddExpenseClick = () => {
    setExpenseModalVisible(true);
  };

  const closeExpenseModalVisible = () => {
    setExpenseModalVisible(false);
  }

  const handleSaveClick = () => {
    const newBudget = parseInt(budget);
    if (!isNaN(newBudget) && newBudget >= 0) {
      setBudget(newBudget);
      setEditing(false);
      setModalVisible(false)
    }
  };

  const addExpense = () => {
    if (expense !== '' && category !== '' && parseInt(expense) > 0) {
      const newExpense = { category, amount: parseInt(expense) };
      setExpenses([...expenses, newExpense]);
      setExpense('');
      setBudget((prevBudget) => prevBudget - parseInt(expense));
      setExpenseModalVisible(false);
      const updatedCategories = categories.map((cat) => {
        if (cat.value === category) {
          cat.expenses.push(newExpense);
        }
        return cat;
      });
      setCategories(updatedCategories);
    }
    
  }

  useEffect(() => {
    let total = 0;
    expenses.forEach((item) => {
      total += item.amount;
    });
    setTotalExpense(total);
  }, [expenses]);

  const [categories, setCategories] = useState([
    { key: '1', value: 'Ruoka', expenses: [] },
    { key: '2', value: 'Kuljetus', expenses: [] },
    { key: '3', value: 'Harrastukset', expenses: [] },
    { key: '4', value: 'Koti', expenses: [] },
    // Add more categories as needed
  ]);
  



  return (
    <View style={styles.container}>
      <Modal visible={modalVisible} animationType="slide" transparent={false}>
      <View style={styles.modalContainer}>
      <TextInput
            style={styles.inputFieldBudget}
            keyboardType="numeric"
            value={budget !== 0 ? budget.toString() : ''}
            onChangeText={(text) => {
              if (text === '') {
                setBudget(0);
              } else {
                setBudget(parseInt(text) || 0);
              }
            }}
          />
          <View style={styles.modalButtons} >
          <Button color={'orange'} title="Tallenna" onPress={handleSaveClick} />
          <Button color={'orange'} title="peruuta" onPress={closeEditClick} />
          </View>
      </View>
      </Modal>
      <View style={styles.editBudget}>
        <Text style={styles.text}>{budget} €</Text>
        <Button color={'orange'} style={styles.editButton1} title="Muokkaa" onPress={handleEditClick} />
      </View>
      <View style={styles.container2}>
      <Button color={'orange'} style={styles.editButton1} title="Lisää kulu" onPress={handleAddExpenseClick} />
      </View>
      <Modal visible={expenseModalVisible} animationType="slide" transparent={false}>
        <View style={styles.modalContainer}>
          <View style={styles.addExpense}>
            <TextInput style={styles.expenseInput}
              placeholder="Lisää kulu"
              keyboardType="numeric"
              value={expense}
              onChangeText={(text) => setExpense(text)}
            />
            <SelectList
              setSelected={(val) => setCategory(val)}
              data={categories}
              save="value"
              placeholder='Kategoria'
              boxStyles={{ borderRadius: 50, width: 150, marginLeft: 10, borderColor: 'orange' }}
            />
          </View>
          <View style={styles.Modal2Buttons}>
          <TouchableOpacity style={styles.editButton2} onPress={addExpense}>
            <Icon name="check" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.editButton2} title="" onPress={closeExpenseModalVisible} >
            <Icon name="close" size={20} color="white" /> 
          </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.showData}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            onPress={() => setSelectedCategory(cat)}
            style={styles.categoryButton}
          >
            <Text style={styles.categoryText}>{cat.value}</Text>
              {cat.expenses.map((expense, index) => (
              <Text style={{color: 'white'}} key={index}>{expense.amount} €</Text>
            ))}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'center',
    borderColor: 'white',
    borderWidth: 0,
    borderBottomWidth: 2
  },
  modalContainer: {
    margin: 20,
    backgroundColor: '#ff8c00',
    borderRadius: 50,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    marginTop: 300,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContainer2: {
    margin: 20,
    borderRadius: 22,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    marginTop: 300,
    backgroundColor: '#ff8c00',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalButtons:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 20
  },
  container2: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: 'white',
    borderTopWidth: 2,
  },
  editBudget: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 100,
    marginBottom: 100
  },
  setBudget: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20
  },
  inputFieldBudget: {
    flex: 0,
    width: 60,
    textAlign: 'center',
    fontSize: 20,
    borderBottomWidth: 1,
    borderColor: 'white',
    marginBottom: 5,
    fontSize: 25

  },
  text: {
    marginRight: 10,
    fontSize: 50,
  },
  editButton1: {
    width: 20,
  },
  
  addExpense: {
    justifyContent: 'space-between',
    marginBottom: 100,
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    flex: 0
  },
  expenseInput: {
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: 50,
    marginTop: 20,
    borderBottomWidth: 1
  },
  editButton2: {
    width: 60,
    height: 45,
    padding: 10,
    borderRadius: 100,
    backgroundColor: 'orange',
    marginLeft: 8,
    alignItems: 'center'
  },
  Modal2Buttons: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  showData: {
    margin: 20,
    flex: 3,
    width: '100%',
    borderTopWidth: 2
  },
  categoryButton: {
    backgroundColor: 'orange',
    padding: 10,
    margin: 5,
    borderRadius: 10,
    width: '90%',
    marginLeft: 20,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 10,

  },
  categoryText: {
    color: 'white',
    fontSize: 18,
  },
  categoryTitle: {
    fontSize: 20,
  },
  expenseList: {
    marginTop: 10,
  },
  modalButtons:{
    flexDirection: 'row'
  },

});
