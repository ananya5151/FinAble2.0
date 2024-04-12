import React, { useContext, useState } from "react";
import axios from 'axios';

const BASE_URL = "http://localhost:2000/api/";


const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState(null);

    // Add income to the list of incomes
    const addIncome = async (income) => {
        try {
            await axios.post(`${BASE_URL}incomes/add`, income);
            getIncomes(); // Fetch updated incomes
        } catch (error) {
            setError('Failed to add income. Please try again.'); // Set error state in case of failure
            console.error('Error adding income:', error);
        }
    };

    // Fetch incomes from the server
    const getIncomes = async () => {
        try {
            const response = await axios.get(`${BASE_URL}incomes/list`);
            setIncomes(response.data);
        } catch (error) {
            setError('Failed to fetch incomes. Please try again.'); // Set error state in case of failure
            console.error('Error fetching incomes:', error);
        }
    };

    // Delete income by ID
    const deleteIncome = async (id) => {
        try {
            await axios.delete(`${BASE_URL}incomes/delete/${id}`);
            getIncomes(); // Fetch updated incomes
        } catch (error) {
            setError('Failed to delete income. Please try again.'); // Set error state in case of failure
            console.error('Error deleting income:', error);
        }
    };

    // Calculate total income
    const totalIncome = () => {
        return incomes.reduce((total, income) => total + income.amount, 0);
    };

    // Add expense to the list of expenses
    const addExpense = async (expense) => {
        try {
            await axios.post(`${BASE_URL}expenses/add`, expense);
            getExpenses(); // Fetch updated expenses
        } catch (error) {
            setError('Failed to add expense. Please try again.'); // Set error state in case of failure
            console.error('Error adding expense:', error);
        }
    };

    // Fetch expenses from the server
    const getExpenses = async () => {
        try {
            const response = await axios.get(`${BASE_URL}expenses`);
            setExpenses(response.data);
        } catch (error) {
            setError('Failed to fetch expenses. Please try again.'); // Set error state in case of failure
            console.error('Error fetching expenses:', error);
        }
    };

    // Delete expense by ID
    const deleteExpense = async (id) => {
        try {
            await axios.delete(`${BASE_URL}expenses/delete/${id}`);
            getExpenses(); // Fetch updated expenses
        } catch (error) {
            setError('Failed to delete expense. Please try again.'); // Set error state in case of failure
            console.error('Error deleting expense:', error);
        }
    };

    // Calculate total expenses
    const totalExpenses = () => {
        return expenses.reduce((total, expense) => total + expense.amount, 0);
    };

    // Calculate total balance
    const totalBalance = () => {
        return totalIncome() - totalExpenses();
    };

    // Return the recent transaction history
    const transactionHistory = () => {
        const history = [...incomes, ...expenses];
        history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return history.slice(0, 3);
    };

    return (
        <GlobalContext.Provider value={{
            addIncome,
            getIncomes,
            incomes,
            deleteIncome,
            addExpense,
            getExpenses,
            expenses,
            deleteExpense,
            totalIncome,
            totalExpenses,
            totalBalance,
            transactionHistory,
            error,
            setError
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => {
    return useContext(GlobalContext);
};
