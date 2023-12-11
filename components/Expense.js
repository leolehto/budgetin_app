import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Modal, ScrollView,} from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import Icon from 'react-native-vector-icons/FontAwesome/';
import { PieChart} from 'react-native-chart-kit';
import { useBudget } from './BudgetContext';
import { initializeApp } from "firebase/app";
import {getDatabase, push, ref, onValue, remove, set, query, orderByChild, equalTo, startAt,endAt} from "firebase/database"
import CalendarPicker from 'react-native-calendar-picker';
import moment, { months } from 'moment';


//firebase Configuration
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

export default function Expense() {
  const [editing, setEditing] = useState(false);
  const [expense, setExpense] = useState(0.0);
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState("")
  const [totalExpense, setTotalExpense] = useState(0.0);
  const [category, setCategory] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [expenseModalVisible, setExpenseModalVisible] = useState(false);
  const [expensesModalVisible, setExpensesModalVisible] = useState(false)
  const [statsModalVisible, setStatsModalVisible] = useState(false)
  const [calendarModalVisible1, setCalendarModalVisible1] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null);
  const {budget, updateBudget} = useBudget();
  const [statData, setStatData] = useState([]);

  const handleCalendarModalVisible1 = () => {
    setCalendarModalVisible1(true)
  }
  const closeCalendarModalVisible1 = () => {
    setCalendarModalVisible1(false)
  }

  const [selectedDate, setSelectedDate] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState('');
  const firstDayOfMonth = moment().startOf('month').format('YYYY-MM-DD');
  const lastDayOfMonth = moment().endOf('month').format('YYYY-MM-DD');

  const onDateClick = (date, type) => {
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
      const formatStart = moment(startDate).format('YYYY-MM-DD');
      const formatEnd = moment(endDate).format('YYYY-MM-DD');

      const expensesQuery = query(
        expensesRef,
        orderByChild('date'),
        startAt(formatStart),
        endAt(formatEnd)
      );

      onValue(expensesQuery, (snapshot) => {
        const expensesData = snapshot.val();
        const expensesArray = Object.values(expensesData || []);

        const pieChartData = categories.map(category => {
          const expenseData = expensesArray.filter(item => item.category === category.value);
          return {
            name: category.value + ' (€)',
            population: expenseData.reduce((total, expense) => total + expense.amount, 0),
            color: category.color
          };
        });

        setStatData(pieChartData);
        //console.log(pieChartData);
      });
    }
  }, [startDate, endDate, categories]);
  
  const onDateChange = (date) => {
    console.log(date)
    const formattedDate = moment(date).format('YYYY-MM-DD');
    setSelectedDate(formattedDate);
    closeCalendarModalVisible1();
  };


  //fetch data from expenses collection in firebase
  useEffect(() => {
    const itemsRef = ref(database, 'expenses/');
    onValue(itemsRef,(snapshot) => {
      const data = snapshot.val();
      const keys = Object.keys(data);
      if (data && typeof data === 'object') {
        const dataWithKeys = Object.values(data).map((obj, index) => {
          return {...obj, key: keys[index]}
        });
        setExpenses(dataWithKeys)
        
      } else {
        console.error();
      }
    });
  }, [])

//fetch data from totalExpense collection in firebase
  useEffect(() => {
    onValue(ref(database, 'totalExpense/'), (snapshot) => {
      const data = snapshot.val();
      const keys = Object.keys(data);
      const totalData = Object.values(data).map((obj, index) => { 
        return {...obj, key: keys[index] } 
      });

      setTotalExpense(totalData);
    })
  }, []);

 
  //Modal opening and closing handling

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
  const handleAddExpensesClick = () => {
    setExpensesModalVisible(true);
  };

  const closeExpensesModalVisible = () => {
    setExpensesModalVisible(false);
  }

  const handleStatsModalVisible = () => {
    setStatsModalVisible(true);
    setStartDate(firstDayOfMonth);
    setEndDate(lastDayOfMonth);
  }
  const closeStatsModalVisible = () => {
    setStatsModalVisible(false);
    setStartDate(firstDayOfMonth);
    setEndDate(lastDayOfMonth);
  }
  
  //update budget
  const handleSaveClick = () => {
    const newBudget = parseFloat(budget);
    if (!isNaN(newBudget) && newBudget >= 0) {
      updateBudget(newBudget);
      setEditing(false);
      setModalVisible(false)
      
    }
  };
  //add new expense
  const addExpense = () => {
    if (expense !== '' && category !== '' && description!= '' && parseFloat(expense) > 0 && selectedDate) {
      const newExpense = {description, category, amount: parseFloat(expense), tag:'expense', date: selectedDate };
      updateBudget((prevBudget) => prevBudget - parseFloat(expense));
      setExpenses([...expenses, newExpense]);
      setExpense('');
      setDescription('');
      setExpenseModalVisible(false);
      const newBudget1 = budget - parseFloat(expense);
      
      const updatedCategories = categories.map((cat) => {
        if (cat.value === category) {
          cat.expenses.push(newExpense);
        }
        return cat;
      });
      setCategories(updatedCategories);
      //update totalExpense in firebase
      set(ref(database, 'totalExpense/'), totalExpense + parseFloat(expense));
     //push new expense to firebase
      push(ref(database, 'expenses/'), {...newExpense, date: selectedDate})
      console.log(selectedDate)
      console.log(newExpense)
      const budgetRef = ref(database, 'budget');
      set(budgetRef, newBudget1)
      .then(() => {
        console.log("budget update succes")
      })
      .catch((error) => {
        console.error(error)
      })
    } 
  }

  const deleteExpenses = (key) => {
    const expenseRef = ref(database, `expenses/${key}`);
    onValue(expenseRef, (snapshot) => {
      const expenseData = snapshot.val();
      
    if(expenseData !== null){  
      remove(expenseRef)
      .then(() => {
        const newTotalExpense = totalExpense - expenseData.amount;
        const newBudget = budget + expenseData.amount; 
      try{
        set(ref(database, 'totalExpense/'), newTotalExpense);
        set(ref(database, 'budget/'), newBudget);
        setTotalExpense(newTotalExpense)
        console.log("updated totalExpense: " , newTotalExpense)
        console.log("updated budget:",  newBudget)
        console.log("Expense deleted and totalExpense updated successfully.");
      }catch(error){
        console.error("Error updating totalExpense:", error)
      }
      })
    }});
  };

  useEffect(() => {
    let total = 0;
    expenses.forEach((item) => {
      total += item.amount;
    });
    setTotalExpense(total);
    //console.log(totalExpense)
  }, [expenses]);

  //categories including expenses, more can be added
  const [categories, setCategories] = useState([
    {key: '1', value: 'Ostokset', expenses: [], icon: 'shopping-cart', color: '#F44336'},
    {key: '2', value: 'Kuljetus', expenses: [], icon: 'bus', color: '#9C27B0' },
    {key: '3', value: 'Harrastukset', expenses: [], icon: 'futbol-o', color: '#3F51B5' },
    {key: '4', value: 'Koti', expenses: [], icon: 'home', color: '#2196F3' },
    {key: '5', value: 'Kahvilat', expenses: [], icon: 'coffee', color: '#795548'},
    {key: '6', value: 'Lemmikki', expenses: [], icon: 'paw', color: '#FF9800'},
    {key: '7', value: 'Sijoitukset', expenses: [], icon: 'money',color: '#8BC34A'},
    {key: '8', value: 'Autoilu', expenses: [], icon: 'car',color: '#607D8B'},
    {key: '9', value: 'Muut', expenses: [], icon: 'question',color: '#E91E63'}
  ]);

 

  return (
    
    <View style={styles.container}>
      <ScrollView>
        <StatusBar animated={true} backgroundColor='teal'></StatusBar>
      <Modal visible={modalVisible} animationType="slide" transparent={false}>
      <View style={styles.modalContainer}>
      <TextInput
            style={styles.inputFieldBudget}
            keyboardType="numeric"
            value={budget}
            onChangeText={(text) => {
              if (text === '') {
                updateBudget(0.00);
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
      <TouchableOpacity color={'orange'} style={styles.expenseButton} title="Lisää kulu" onPress={handleAddExpenseClick} >
        <Icon name='plus-circle' color='orange' size={60}></Icon>
      </TouchableOpacity>
      <TouchableOpacity color={'orange'} style={styles.navigateButton} title="Lisää kulu" >
        <Icon name='pie-chart' color='orange' size={60}  onPress={handleStatsModalVisible}></Icon>
      </TouchableOpacity>
      </View>
      <Modal visible={expenseModalVisible} animationType="slide" transparent={false}>
        <View style={styles.modalContainer2}>
          <View style={styles.addExpense}>
            <TextInput style={styles.expenseInput}
              placeholder="Lisää kulu"
              keyboardType="numeric"
              value={expense}
              onChangeText={(text) => setExpense(text)}
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
            <Text style={{marginTop: 10}}>
              <Icon name='calendar' color='orange' size={35}  onPress={handleCalendarModalVisible1} ></Icon>
            </Text>
          <Modal visible={calendarModalVisible1} animationType='slide' transparent={false} onPress={handleCalendarModalVisible1} >
            <CalendarPicker
              onDateChange={onDateChange}
              selectedDayColor='teal'
          /> 
          <Text onPress={closeCalendarModalVisible1} style={{marginLeft: 10}}>
            <Icon name='close' color='orange' size={50} ></Icon>
          </Text>
          </Modal>
          </View>
          <View style={styles.Modal2Buttons}>
          <TouchableOpacity style={styles.editButton2} onPress={addExpense}>
            <Icon name="check" size={40} color="orange" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.editButton2} title="" onPress={closeExpenseModalVisible} >
            <Icon name="close" size={40} color="orange" /> 
          </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.showData}>
        {categories.map((cat) => (
          <TouchableOpacity 
            key={cat.key}
            onPress={() => {setSelectedCategory(cat); handleAddExpensesClick();}}
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
      <Modal visible={expensesModalVisible} animationType="slide" transparent={false} onBackdropPress={() => expenseModalVisible(false)}>
        <View style={styles.modalContainer3}>
          {selectedCategory && (
          <Icon style={{marginBottom: 25}} name={selectedCategory.icon} color={'white'} size={50}></Icon>
          )}
          <FlatList 
            data={selectedCategory ? expenses.filter(item => item.category === selectedCategory.value): []}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <View style={styles.flatlistData}>
                <Text onPress={() => deleteExpenses(item.key)} style={{color: 'orange', fontSize: 30, width:350, fontWeight: 'bold'}}>
                  {item.date}                 <Icon name="trash-o" size={40} color="orange" />
                </Text>
                <Text style={{color: 'orange', fontSize: 30, width:350, fontWeight: 'bold'}}>
                  {item.amount}€
                </Text>
                <Text style={{color: 'black', fontSize: 25, width:350}}>
                  {item.description}
                </Text>
              </View>
            )}>
          </FlatList>
          <TouchableOpacity style={styles.editButton3} title="" onPress={closeExpensesModalVisible} >
            <Icon name="close" size={55} color="orange" /> 
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal visible={statsModalVisible} animationType='slide' transparent={false} onPress={handleStatsModalVisible}>
        <View style={styles.modalContainer3}>
          <View style={styles.PieChart}>
          <PieChart
            data={statData}
            width={410}
            height={275}
            backgroundColor={'transparent'}
            paddingLeft={'15'}
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
            <View>
              <CalendarPicker
              //months={['Tammikuu', 'Helmikuu', 'Maaliskuu', 'Huhtikuu', 'Toukokuu', 'Kesäkuu', 'Heinäkuu', 'Elokuu', 'Syyskuu', 'Lokakuu', 'Marraskuu', 'Joulukuu']}
               selectedStartDate={startDate}
               selectedEndDate={endDate}
               onDateChange={onDateClick}
               allowRangeSelection={true}
               resetSelections={true}
               todayBackgroundColor='orange'
               selectedDayColor='teal'
               width={400}
               
               > 
              </CalendarPicker>
            </View>
          <TouchableOpacity style={styles.editButton3} title="" onPress={closeStatsModalVisible} >
            <Icon name="close" size={55} color="orange" /> 
          </TouchableOpacity>
        </View>
      </Modal>
      <View style={styles.totalExpenseData}>
        <View style={{alignContent: 'center' , margin: 10}}>
          <Text style={styles.totalExpense}>{totalExpense}€</Text>
        </View>
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
    backgroundColor: 'blue'
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
    height: '74.5%',
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
    marginTop: 20,
    marginLeft: 60,
    alignItems: 'center',
    justifyContent: 'center',
    width: '70%',
    backgroundColor: 'teal',
    flexDirection: 'row',
    marginBottom: 5,
    borderWidth: 0.3,
    borderRadius: 50,
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
    padding:5 ,
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
    borderWidth: 0,
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
    marginLeft: 65,
    marginTop: 20,
    marginBottom: 0,
    marginRight: 10,
    backgroundColor: 'teal',
    width: '70%',
    //height: 100,
    justifyContent: 'center',
    alignItems: 'center', 
    borderRadius: 100,
    flexDirection: 'row',
    borderWidth: 0,
    alignContent: 'space-between',
  },
  
  totalExpense:{
    borderWidth: 0,
    paddingRight: 10,
    margin: 5,
    textAlign: 'center',
    alignContent: 'center',
    fontSize: 55,
    backgroundColor: 'teal',
    color: 'orange',
    borderRadius: 50,

  },
  PieChart: {
    width: 400,
    height: '40%',
    backgroundColor: 'white',
    marginLeft: 108,
    marginTop: 0,
    marginRight: 110 ,
    borderColor: 'black',
    borderWidth: 0.3,
    borderRadius: 50,
    alignItems: 'center',
    shadowColor: "teal",
    shadowOffset: {
	  width: 0,
	  height: 1,
},
shadowOpacity: 1,
shadowRadius: 1,

elevation: 2,
  },
  
})