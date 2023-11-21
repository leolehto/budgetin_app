import React, { createContext, useContext, useState } from 'react';

const DateContext = createContext();

export const useDate = () => {
    return useContext(DateContext);
};

export const CalendarProvider = ({children}) => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const updateSelectedDate = (date) => {
        setSelectedDate(date);
    };

    return(
        <DateContext.Provider value={{selectedDate, updateSelectedDate}}>
            {children}
        </DateContext.Provider>
    );
};

