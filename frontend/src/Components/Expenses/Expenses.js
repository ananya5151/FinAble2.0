import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { InnerLayout } from '../../styles/Layouts';
import IncomeItem from '../IncomeItem/IncomeItem';
import ExpenseForm from './ExpenseForm';

function Expenses({ currentForm, setCurrentForm }) {
    const {expenses, getExpenses, deleteExpense, totalExpenses} = useGlobalContext();

    useEffect(() =>{
        getExpenses();
    }, []);

    const handleDeleteWithVoice = (id, title) => {
        deleteExpense(id);
        // Voice feedback will be handled by the main App component
    };

    return (
        <ExpenseStyled>
            <InnerLayout>
                <h1>Expenses</h1>
                
                {/* Voice Form Indicator */}
                {currentForm === 'expense' && (
                    <VoiceFormIndicator>
                        <p>🎙️ Voice input active for new expense entry</p>
                        <button 
                            onClick={() => setCurrentForm(null)}
                            className="cancel-voice"
                        >
                            Cancel Voice Input
                        </button>
                    </VoiceFormIndicator>
                )}
                
                <h2 className="total-income">
                    Total Expense: <span>${totalExpenses()}</span>
                </h2>
                
                <div className="income-content">
                    <div className="form-container">
                        <ExpenseForm currentForm={currentForm} />
                    </div>
                    <div className="incomes">
                        {expenses.map((expense) => {
                            const {_id, title, amount, date, category, description, type} = expense;
                            return (
                                <IncomeItem
                                    key={_id}
                                    id={_id} 
                                    title={title} 
                                    description={description} 
                                    amount={amount} 
                                    date={date} 
                                    type={type}
                                    category={category} 
                                    indicatorColor="var(--color-delete)"
                                    deleteItem={() => handleDeleteWithVoice(_id, title)}
                                />
                            );
                        })}
                        {expenses.length === 0 && (
                            <EmptyState>
                                <p>No expense entries yet.</p>
                                <p>Say "Add expense" to create your first entry using voice commands!</p>
                            </EmptyState>
                        )}
                    </div>
                </div>
            </InnerLayout>
        </ExpenseStyled>
    );
}

const ExpenseStyled = styled.div`
    display: flex;
    overflow: auto;
    .total-income{
        display: flex;
        justify-content: center;
        align-items: center;
        background: beige;
        border: 5px solid darkgreen;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        border-radius: 20px;
        padding: 1rem;
        margin: 1rem 0;
        font-size: 2rem;
        gap: .5rem;
        span{
            font-size: 2.5rem;
            font-weight: 800;
            color: var(--color-delete);
        }
    }
    .income-content{
        display: flex;
        gap: 2rem;
        .incomes{
            flex: 1;
        }
    }
`;

const VoiceFormIndicator = styled.div`
    background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
    border: 2px solid #f44336;
    border-radius: 15px;
    padding: 1rem;
    margin: 1rem 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 12px rgba(244, 67, 54, 0.2);
    
    p {
        color: #c62828;
        font-weight: 600;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .cancel-voice {
        background: #f44336;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.3s ease;
        
        &:hover {
            background: #d32f2f;
            transform: translateY(-1px);
        }
    }
`;

const EmptyState = styled.div`
    text-align: center;
    padding: 3rem 1rem;
    color: var(--primary-color);
    
    p:first-child {
        font-size: 1.2rem;
        margin-bottom: 0.5rem;
        opacity: 0.7;
    }
    
    p:last-child {
        font-size: 1rem;
        color: #f44336;
        font-weight: 500;
        background: rgba(244, 67, 54, 0.1);
        padding: 1rem;
        border-radius: 10px;
        border: 2px dashed #f44336;
    }
`;

export default Expenses;