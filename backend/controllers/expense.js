const Expense = require('../models/expense');

exports.addExpense = async (req, res) => {
    try {
        const expense = new Expense(req.body);
        await expense.save();
        res.status(201).json({ message: 'Expense added successfully', expense });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;
        await Expense.findByIdAndDelete(id);
        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
