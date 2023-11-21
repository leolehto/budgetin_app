import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Modal, Button, ScrollView,} from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import Icon from 'react-native-vector-icons/FontAwesome/';
import { PieChart } from 'react-native-chart-kit';
import { useBudget } from './BudgetContext';
import { initializeApp } from "firebase/app";
import {getDatabase, push,remove, ref, onValue, set} from "firebase/database"

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

export default function Income() {
  const [editing, setEditing] = useState(false);
  const [income, setIncome] = useState("");
  const [incomes, setIncomes] = useState([]);
  const [description, setDescription] = useState("")
  const [totalIncome, setTotalIncome] = useState(0);
  const [category, setCategory] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [incomeModalVisible, setIncomeModalVisible] = useState(false);
  const [incomesModalVisible, setIncomesModalVisible] = useState(false)
  const [statsModalVisible, setStatsModalVisible] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const itemsRef = ref(database, 'finances/');
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      const keys = Object.keys(data);
      if (data && typeof data === 'object') {
        const dataWithKeys = Object.values(data).map((obj, index) => {
          return {...obj, key: keys[index]}
        });
        setIncomes(dataWithKeys)
      } else {
        console.error();
      }
    })
  }, [])
  const deleteFinances = (key) => {
    remove(ref(database, `finances/${key}`))
  }
  
  const handleEditClick = () => {
    setModalVisible(true);
  };

  const closeEditClick = () => {
    setModalVisible(false);
  }
  
  const handleAddIncomeClick = () => {
    setIncomeModalVisible(true);
  };

  const closeIncomeModalVisible = () => {
    setIncomeModalVisible(false);
  }
  const handleAddIncomesClick = () => {
    setIncomesModalVisible(true);
  };

  const closeIncomesModalVisible = () => {
    setIncomesModalVisible(false);
  }

  const handleStatsModalVisible = () => {
    setStatsModalVisible(true)
  }
  const closeStatsModalVisible = () => {
    setStatsModalVisible(false)
  }
  const {budget, updateBudget} = useBudget();
  
  const handleSaveClick = () => {
    const newBudget = parseFloat(budget);
    if (!isNaN(newBudget) && newBudget >= 0) {
      updateBudget(newBudget);
      setEditing(false);
      setModalVisible(false)
    }
  };

  const addIncome = () => {
    if (income !== '' && category !== '' && description!= '' && parseFloat(income) > 0) {
      const newIncome = {description, category, amount: parseFloat(income), tag: 'income'};
      updateBudget((prevBudget) => prevBudget + parseFloat(income));
      setIncomes([...incomes, newIncome]);
      setIncome('');
      setDescription('');
      setIncomeModalVisible(false);
      const newBudget2 = budget + parseFloat(income)
      
      const updatedCategories = categories.map((cat) => {
        if (cat.value === category) {
          cat.incomes.push(newIncome);
        }
        return cat;
      });
      
      setCategories(updatedCategories);
      
      push(ref(database, 'finances/'), newIncome)
      
      const budgetRef = ref(database, 'budget');
      set(budgetRef, newBudget2)
      .then(() => {
        console.log("update succes")
      })
      .catch((error) => {
        console.error(error)
      })
    } 
  }

  useEffect(() => {
    let total = 0;
    incomes.forEach((item) => {
      total += item.amount;
    });
    setTotalIncome(total);
  }, [incomes]);

  const [categories, setCategories] = useState([
    { key: '1', value: 'Palkka', incomes: [], icon: 'euro', color: 'red'},
    { key: '2', value: 'Lahja', incomes: [], icon: 'gift', color: 'brown' },
    { key: '3', value: 'Muut', incomes: [], icon: 'question', color: 'purple' },
    { key: '4', value: 'Kumppani', incomes: [], icon: 'user', color: 'gray' },
  
    // Add more categories as needed
  ]);
  const statData = categories.map(category => ({
    name: category.value,
    population: category.incomes.reduce((total, income) => total + income.amount, 0),
    color: category.color
  }))
   
  return (
    
    <View style={styles.container}>
      <ScrollView>
      <Modal visible={modalVisible} animationType="slide" transparent={false}>
      <View style={styles.modalContainer}>
      <TextInput
            style={styles.inputFieldBudget}
            keyboardType="numeric"
            value={budget !== 0 ? budget.toString() : ''}
            onChangeText={(text) => {
              if (text === '') {
                updateBudget(0);
              } else {
                updateBudget(parseFloat(text) || 0);
              }
            }}
          />
          <View style={styles.modalButtons} >
          <TouchableOpacity style={{marginRight: 20}} color={'orange'} title="Tallenna" onPress={handleSaveClick} >
            <Icon name="check" size={50} color="orange" ></Icon>
          </TouchableOpacity>
          <TouchableOpacity color={'orange'} title="peruuta" onPress={closeEditClick} >
            <Icon name="close" size={50} color="orange" ></Icon>
          </TouchableOpacity>
          </View>
      </View>
      </Modal>
      <View style={styles.editBudget}>
        <Text onPress={handleEditClick} style={styles.text}>{budget} €</Text>
        <TouchableOpacity color={'orange'} style={styles.editButton1} title="Muokkaa" onPress={handleEditClick} >
          <Icon name='edit' color='orange' size={55}></Icon>
        </TouchableOpacity>
      </View>
      <View style={styles.container2}>
      <TouchableOpacity color={'orange'} style={styles.calendarButton} title="Lisää kulu" >
        <Icon name='calendar' color='orange' size={45}  onPress={handleStatsModalVisible}></Icon>
      </TouchableOpacity>
      <TouchableOpacity color={'orange'} style={styles.expenseButton} title="Lisää kulu" onPress={handleAddIncomeClick} >
        <Icon name='plus-circle' color='orange' size={60}></Icon>
      </TouchableOpacity>
      <TouchableOpacity color={'orange'} style={styles.navigateButton} title="Lisää kulu" >
        <Icon name='bar-chart-o' color='orange' size={45}  onPress={handleStatsModalVisible}></Icon>
      </TouchableOpacity>
      </View>
      <Modal visible={incomeModalVisible} animationType="slide" transparent={false}>
        <View style={styles.modalContainer2}>
          <View style={styles.addExpense}>
            <TextInput style={styles.expenseInput}
              placeholder="Lisää tulo"
              keyboardType="numeric"
              value={income}
              onChangeText={(text) => setIncome(text)}
            />
            <TextInput style={styles.expenseInput}
              placeholder="Lisää kuvaus"
              value={description}
              onChangeText={(text) => setDescription(text)}
            />
            <SelectList
              setSelected={(val) => setCategory(val)}
              data={categories}
              save="value"
              placeholder='Kategoria'
              boxStyles={{ borderRadius: 50, width: 200, marginLeft: 5, borderColor: 'orange' }}
            />
          </View>
          <View style={styles.Modal2Buttons}>
          <TouchableOpacity style={styles.editButton2} onPress={addIncome}>
            <Icon name="check" size={40} color="orange" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.editButton2} title="" onPress={closeIncomeModalVisible} >
            <Icon name="close" size={40} color="orange" /> 
          </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.showData}>
        {categories.map((cat) => (
          <TouchableOpacity 
            key={cat.key}
            onPress={() => {setSelectedCategory(cat); handleAddIncomesClick();}}
            style={styles.categoryButton}
          >
            <View style={styles.dataDetails} >
            <View style={styles.dataIcons}>
            <Icon name={cat.icon} color={'orange'} size={50}></Icon>
            <Text style={{fontSize: 15, color: 'orange'}}>{cat.value}</Text>
            </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <Modal visible={incomesModalVisible} animationType="slide" transparent={false} onBackdropPress={() => incomeModalVisible(false)}>
        <View style={styles.modalContainer3}>
          {selectedCategory && (
          <Icon style={{marginBottom: 25}} name={selectedCategory.icon} color={'white'} size={50}></Icon>
          )}
          <FlatList 
            data={selectedCategory ? incomes.filter(item => item.category === selectedCategory.value): []}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <View style={styles.flatlistData}>
                <Text style={{color: 'orange', fontSize: 30, width:350, fontWeight: 'bold'}}>
                  {item.amount}€
                </Text>
                <Text style={{color: 'black', fontSize: 25, width:350}} onPress={() => deleteFinances(item.key)}>
                  {item.description} <Icon name="trash-o" size={40} color="orange" />
                </Text>
              </View>
            )}>
          </FlatList>
          <TouchableOpacity style={styles.editButton3} title="" onPress={closeIncomesModalVisible} >
            <Icon name="close" size={55} color="orange" /> 
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal visible={statsModalVisible} animationType='slide' transparent={false} onPress={handleStatsModalVisible}>
        <View style={styles.modalContainer3}>
          <View style={styles.PieChart}>
          <PieChart
            data={statData}
            width={350}
            height={259}
            backgroundColor={'transparent'}
            paddingLeft={'18'}
            borderWidth={2}
            borderColor={'black'}
            chartConfig={{
              backgroundGradientFrom: '#1E2923',
              backgroundGradientTo: '#08130D',
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            accessor="population"
            absolute
           />
      </View>
          <TouchableOpacity style={styles.editButton3} title="" onPress={closeStatsModalVisible} >
            <Icon name="close" size={55} color="orange" /> 
          </TouchableOpacity>
        </View>
      </Modal>
      <View style={styles.totalIncomeData}>
               
      </View>
     </ScrollView>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'center',
    padding: 0

  },
  scrollContainer: {
    backgroundColor: 'pink'
  },
  modalContainer: {
    marginLeft:100,
    borderRadius: 20,
    borderWidth: 0.5,
    padding: 35,
    alignItems: 'center',
    shadowColor: 'black',
    marginTop: 200,
    backgroundColor: 'teal',
    width: '50%',
    height: '23%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.22,
    shadowRadius: 3,

    elevation: 4,
    
  },
  modalContainer2: {
    marginTop: 150,
    marginLeft: 60,
    borderWidth: 0.3,
    borderRadius: 50,
    borderColor: 'black',
    padding: 35,
    borderColor: 'white',
    alignItems: 'center',
    backgroundColor: 'teal',
    width: '70%',
    height: '70%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.22,
    shadowRadius: 3,

    elevation: 4,
  },

  modalButtons:{
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editBudget: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 40,
    

  },
  setBudget: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20
  },
  inputFieldBudget: {
    flex: 0,
    width: 100,
    textAlign: 'center',
    fontSize: 20,
    borderBottomWidth: 0.5,
    borderColor: 'black',
    marginBottom: 10,
    marginTop:2 ,
    fontSize: 25

  },
  container2: {
    padding:1,
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    backgroundColor: 'teal',
    flexDirection: 'row',
    marginBottom: 5,
    borderWidth: 0.3,
    borderRadius: 30,
    borderColor: 'white',
    shadowColor: "#000",
    shadowOffset: {
	  width: 0,
	  height: 1,
},
shadowOpacity: 0.3,
shadowRadius: 3,

elevation: 4,
  },
  text: {
    marginRight: 10,
    fontSize: 50,
  },
  editButton1: {
    width: 70,
    height: 50,
    backgroundColor: 'white',
    marginTop: 10,
    marginLeft: 5,
    marginBottom: 5
  },
  
  addExpense: {
    justifyContent: 'space-between',
    marginBottom: 5,
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    flex: 0
  },
  expenseButton:{
    margin: 5,
    marginBottom: 5,
    width: 100,
    borderWidth: 0,
    alignItems: 'center'
  },
  navigateButton:{
    margin: 5,
    marginBottom: 5,
    width: 100,
    borderWidth: 0,
    alignItems: 'center'
  },
  calendarButton:{
    margin: 5,
    marginBottom: 5,
    width: 100,
    borderWidth: 0,
    alignItems: 'center'
  },
  expenseInput: {
    marginBottom: 25,
    marginLeft: 10,
    marginTop: 25,
    borderBottomWidth: 0.5,
    width: 190,
    fontSize: 19,
  },
  editButton2: {
    width: 60,
    height: 100,
    padding: 10,
    borderRadius: 100,
    marginLeft: 10,
    alignItems: 'center',
    backgroundColor: 'teal'
  },
  editButton3: {
    width: 60,
    height: 100,
    padding: 10,
    borderRadius: 100,
    backgroundColor: 'white',
    marginLeft: 10,
    alignItems: 'center',
  },
  Modal2Buttons: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  showData: {
    flex: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'white',
    marginBottom: 4,
    borderBottomWidth: 0
  },
  categoryButton: {
    backgroundColor: 'white',
    padding: 10,
    margin: 5,
    borderRadius: 50,
    borderWidth: 0.2,
    borderColor: 'white',
    width: 109,
    height: 100,
    marginLeft: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
  dataDetails:{
    flexDirection: 'row',
    marginBottom: 40
  },
  dataIcons:{
    marginLeft: 2,
    marginTop: 12,
    alignItems: 'center'
  },
  modalContainer3: {
    margin:0,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: 'black',
    marginTop: 20,
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
    shadowOffset: {
      width: 3,
      height: 2,
    }
  },
  flatlistData:{
    marginBottom: 9,
    alignItems: 'flex-start',
    borderBottomWidth: 0.2,
    padding: 8,
    
  },
  totalExpenseData:{
    flex: 3, 
    margin: 20,
    width: '90%',
    //height: 100,
    justifyContent: 'center',
    alignItems: 'center', 
    borderRadius: 100,
    backgroundColor: 'white',
  },
  PieChart: {
    width: '90%',
    height: '70%',
    marginLeft: 100,
    marginTop: 0,
    marginRight: 100 ,
    borderColor: 'black',
    borderWidth: 0,
    borderRadius: 50,
    alignItems: 'center'
  }
})