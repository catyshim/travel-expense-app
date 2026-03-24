import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseService, Expense } from '../../services/expense';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expenses.html',
  styleUrl: './expenses.scss',
})
export class ExpensesComponent implements OnInit {
  expenses: Expense[] = [];

  newExpense: Expense = {
    amount: 0,
    category: '',
    date: '',
    note: '',
  };

  categories = ['Food', 'Transport', 'Hotel', 'Activities', 'Shopping', 'Other'];

  constructor(
    public expenseService: ExpenseService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadExpenses();
    this.expenseService.loadRates();
  }

  loadExpenses() {
    this.expenseService.getExpenses().subscribe((data) => {
      this.expenses = data;
      this.cdr.detectChanges();
    });
  }

  addExpense() {
    if (!this.newExpense.amount || !this.newExpense.category || !this.newExpense.date) return;
    const expenseToAdd = { ...this.newExpense };
    const inputCurrency = this.expenseService.selectedCurrencyExpenses;
    const inputRate = this.expenseService.rates[inputCurrency] || 1;
    // convert input currency to CAD
    expenseToAdd.amount = expenseToAdd.amount / inputRate;
    this.expenseService.addExpense(expenseToAdd).subscribe(() => {
      this.newExpense = { amount: 0, category: '', date: '', note: '' };
      this.loadExpenses();
    });
  }

  deleteExpense(id: string) {
    this.expenseService.deleteExpense(id).subscribe(() => {
      this.loadExpenses();
    });
  }
}
