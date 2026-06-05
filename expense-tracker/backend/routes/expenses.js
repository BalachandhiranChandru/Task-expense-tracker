const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');

// Get all expenses (with search + filter)
router.get('/', auth, async (req, res) => {
  try {
    const { search, category } = req.query;
    let filter = { user: req.user.id };

    if (category && category !== 'All') filter.category = category;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const expenses = await Expense.find(filter).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add expense
router.post('/', auth, async (req, res) => {
  try {
    const { title, amount, category, date, description } = req.body;
    if (!title || !amount) return res.status(400).json({ message: 'Title and amount required' });

    const expense = new Expense({
      user: req.user.id, title, amount, category, date, description
    });
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update expense
router.put('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete expense
router.delete('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Dashboard stats
router.get('/stats', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id });
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);

    const now = new Date();
    const monthly = expenses
      .filter(e => new Date(e.date).getMonth() === now.getMonth() &&
                   new Date(e.date).getFullYear() === now.getFullYear())
      .reduce((sum, e) => sum + e.amount, 0);

    const recent = await Expense.find({ user: req.user.id })
      .sort({ date: -1 }).limit(5);

    const categoryBreakdown = expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});

    res.json({ total, monthly, recent, categoryBreakdown });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;