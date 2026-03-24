import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseService, Summary } from '../../services/expense';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  summary: Summary = {
    total: 0,
    byCategory: {},
  };

  budget: number = 2000;
  remaining: number = 0;
  categories: string[] = [];

  constructor(
    public expenseService: ExpenseService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadSummary();
    this.expenseService.loadRates();
  }

  loadSummary() {
    this.expenseService.getSummary().subscribe((data) => {
      this.summary = data;
      this.remaining = this.budget - data.total;
      this.categories = Object.keys(data.byCategory);
      this.cdr.detectChanges();
    });
  }

  isOverBudget(amount: number): boolean {
    return amount > this.budget;
  }
}
