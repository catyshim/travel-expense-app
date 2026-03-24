import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Expense {
  id?: string;
  amount: number;
  category: string;
  date: string;
  note?: string;
}

export interface Summary {
  total: number;
  byCategory: Record<string, number>;
}

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private apiUrl = `${environment.apiUrl}/expenses`;

  currencies = ['CAD', 'EUR', 'GBP', 'USD', 'JPY', 'AUD'];
  selectedCurrencyExpenses = 'CAD';
  selectedCurrencyDashboard = 'CAD';
  rates: Record<string, number> = {};

  constructor(private http: HttpClient) {}

  getExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.apiUrl);
  }

  addExpense(expense: Expense): Observable<Expense[]> {
    return this.http.post<Expense[]>(this.apiUrl, expense);
  }

  deleteExpense(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getSummary(): Observable<Summary> {
    return this.http.get<Summary>(`${this.apiUrl}/summary`);
  }

  getRates(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/rates/CAD`);
  }

  loadRates(): void {
    if (Object.keys(this.rates).length > 0) return;
    this.getRates().subscribe(data => {
      this.rates = data;
    });
  }

  convertAmount(amount: number, selectedCurrency: string): number {
    const rate = this.rates[selectedCurrency] || 1;
    return amount * rate;
  }
}