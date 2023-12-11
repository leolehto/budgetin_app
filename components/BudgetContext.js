import React, { createContext, useContext, useState, useEffect } from 'react';
import { ref, onValue, push, set, getDatabase } from 'firebase/database'; 
import { initializeApp } from "firebase/app";
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

const BudgetContext = createContext();

export const useBudget = () => {
    return useContext(BudgetContext);
}

export const BudgetProvider = ({children}) => {
    const [budget,setBudget] = useState(0.00);

    useEffect(() => {
        // Fetch the initial budget value from Firebase
        const budgetRef = ref(database, 'budget');
        onValue(budgetRef, (snapshot) => {
            const budgetData = snapshot.val();
            setBudget(budgetData || 0.00);
        });
    }, []);

    const updateBudget = (newBudget) => {
        setBudget(newBudget)
        if (typeof newBudget !== 'number' || isNaN(newBudget)){
            //console.error('Invalid budget value:', newBudget)
            return;
        }
        const budgetRef = ref(database, 'budget');
        set(budgetRef, newBudget)
            .then(() => {
                console.log('Budget updated successfully');
            })
            .catch((error) => {
                console.error('Error updating budget: ', error);
            });
    }
    return(
        <BudgetContext.Provider value={{budget, updateBudget}}>
            {children}
        </BudgetContext.Provider>
    );
}



