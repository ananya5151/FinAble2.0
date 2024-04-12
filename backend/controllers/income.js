const Income = require('../models/IncomeModel');


exports.addIncome = async (req, res) => {
    try {
        const income = new Income(req.body);
        await income.save();
        res.status(201).json({ message: 'Income added successfully', income });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.getIncomes = async (req, res) => {
    try {
        const incomes = await Income.find();
        res.status(200).json(incomes);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.deleteIncome = async (req, res) => {
    try {
        const { id } = req.params;
        await Income.findByIdAndDelete(id);
        res.status(200).json({ message: 'Income deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
