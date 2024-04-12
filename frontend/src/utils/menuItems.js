import {book, dashboard, expenses, transactions, trend} from '../utils/Icons';

export const menuItems = [
    {
        id: 1,
        title: 'Dashboard',
        icon: dashboard,
        link: '/dashboard'
    },
    {
        id: 2,
        title: "View Transactions",
        icon: transactions,
        link: "/dashboard",
    },
    {
        id: 3,
        title: "Incomes",
        icon: trend,
        link: "/dashboard",
    },
    {
        id: 4,
        title: "Expenses",
        icon: expenses,
        link: "/dashboard",
    },
    {
        id: 5,
        title: "Governement Schemes",
        icon: book,
        link: "https://atypicaladvantage.in/atypical-blog/post/list-of-government-schemes-for-disabled-persons-in-india-empowerment-and-inclusion-guide",
    },
];
