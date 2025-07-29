import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import History from '../../History/History';
import { InnerLayout } from '../../styles/Layouts';
import { dollar } from '../../utils/Icons';
import Chart from '../Chart/Chart';

function Dashboard({ currentForm, setCurrentForm }) {
    const {totalExpenses, incomes, expenses, totalIncome, totalBalance, getIncomes, getExpenses } = useGlobalContext();

    useEffect(() => {
        getIncomes();
        getExpenses();
    }, []);

    return (
        <DashboardStyled>
            <InnerLayout>
                <h1>All Transactions</h1>
                
                {/* Voice Form Indicator */}
                {currentForm && (
                    <VoiceFormIndicator>
                        <p>🎙️ Voice input active for new {currentForm} entry</p>
                        <button 
                            onClick={() => setCurrentForm(null)}
                            className="cancel-voice"
                        >
                            Cancel Voice Input
                        </button>
                    </VoiceFormIndicator>
                )}
                
                <div className="stats-con">
                    <div className="chart-con">
                        <Chart />
                        <div className="amount-con">
                            <div className="income">
                                <h2>Total Income</h2>
                                <p>
                                    {dollar} {totalIncome()}
                                </p>
                            </div>
                            <div className="expense">
                                <h2>Total Expense</h2>
                                <p>
                                    {dollar} {totalExpenses()}
                                </p>
                            </div>
                            <div className="balance">
                                <h2>Total Balance</h2>
                                <p>
                                    {dollar} {totalBalance()}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="history-con">
                        <History />
                        
                        {/* Voice Commands Helper */}
                        <VoiceCommandsHelper>
                            <h3>Quick Voice Commands</h3>
                            <div className="commands">
                                <span>💰 "Add income"</span>
                                <span>💸 "Add expense"</span>
                                <span>📊 "Read total"</span>
                                <span>📈 "Income section"</span>
                                <span>📉 "Expenses section"</span>
                            </div>
                        </VoiceCommandsHelper>
                        
                        <h2 className="salary-title">Min <span>Salary</span>Max</h2>
                        <div className="salary-item">
                            <p>
                                ${incomes.length > 0 ? Math.min(...incomes.map(item => item.amount)) : 0}
                            </p>
                            <p>
                                ${incomes.length > 0 ? Math.max(...incomes.map(item => item.amount)) : 0}
                            </p>
                        </div>
                        <h2 className="salary-title">Min <span>Expense</span>Max</h2>
                        <div className="salary-item">
                            <p>
                                ${expenses.length > 0 ? Math.min(...expenses.map(item => item.amount)) : 0}
                            </p>
                            <p>
                                ${expenses.length > 0 ? Math.max(...expenses.map(item => item.amount)) : 0}
                            </p>
                        </div>
                    </div>
                </div>
            </InnerLayout>
        </DashboardStyled>
    );
}

const DashboardStyled = styled.div`
    .stats-con{
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 2rem;
        .chart-con{
            grid-column: 1 / 4;
            height: 400px;
            .amount-con{
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 2rem;
                margin-top: 2rem;
                .income, .expense{
                    grid-column: span 2;
                }
                .income, .expense, .balance{
                    background: beige;
                    border: 5px solid darkgreen;
                    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
                    border-radius: 20px;
                    padding: 1rem;
                    transition: transform 0.3s ease;
                    
                    &:hover {
                        transform: translateY(-2px);
                    }
                    
                    p{
                        font-size: 3.5rem;
                        font-weight: 700;
                    }
                }

                .balance{
                    grid-column: 2 / 4;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    p{
                        color: var(--color-green);
                        opacity: 0.6;
                        font-size: 4.5rem;
                    }
                }
            }
        }

        .history-con{
            grid-column: 4 / -1;
            h2{
                margin: 1rem 0;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .salary-title{
                font-size: 1.2rem;
                span{
                    font-size: 1.8rem;
                }
            }
            .salary-item{
                background: beige;
                border: 5px solid darkgreen;
                box-shadow: 0px 1px 15px darkblue;
                padding: 1rem;
                border-radius: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: transform 0.3s ease;
                
                &:hover {
                    transform: translateY(-2px);
                }
                
                p{
                    font-weight: 600;
                    font-size: 1.6rem;
                }
            }
        }
    }
`;

const VoiceFormIndicator = styled.div`
    background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
    border: 2px solid #4caf50;
    border-radius: 15px;
    padding: 1rem;
    margin: 1rem 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
    
    p {
        color: #2e7d32;
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

const VoiceCommandsHelper = styled.div`
    background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
    border: 2px solid #9c27b0;
    border-radius: 15px;
    padding: 1rem;
    margin: 1rem 0;
    
    h3 {
        color: #6a1b9a;
        margin-bottom: 0.75rem;
        font-size: 1rem;
        text-align: center;
    }
    
    .commands {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        
        span {
            background: rgba(156, 39, 176, 0.1);
            color: #6a1b9a;
            padding: 0.4rem 0.6rem;
            border-radius: 8px;
            font-size: 0.85rem;
            font-weight: 500;
            transition: all 0.3s ease;
            cursor: pointer;
            
            &:hover {
                background: rgba(156, 39, 176, 0.2);
                transform: translateX(3px);
            }
        }
    }
`;

export default Dashboard;