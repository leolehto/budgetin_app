import React, { createContext, useContext, useState } from 'react';

const BudgetContext = createContext();

export const useBudget = () => {
    return useContext(BudgetContext);
}

export const BudgetProvider = ({children}) => {
    const [budget,setBudget] = useState(0);
    
    const updateBudget = (newBudget) => {
        setBudget(newBudget)
    }
    return(
        <BudgetContext.Provider value={{budget, updateBudget}}>
            {children}
        </BudgetContext.Provider>
    )
};



