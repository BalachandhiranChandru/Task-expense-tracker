const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: {
    type: String,
    enum: ['Food', 'Transport', 'Shopping', 'Health', 'Entertainment', 'Bills', 'Education', 'Other'],
    default: 'Other'
  },
  date: { type: Date, default: Date.now },
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);