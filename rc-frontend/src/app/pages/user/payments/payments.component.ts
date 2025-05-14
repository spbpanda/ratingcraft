import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { RcBackendService } from '../../../services/rc-backend.service';
import { Transaction } from '../../../common/interfaces/transaction';
import { CurrencyPipe, DatePipe, NgIf, SlicePipe } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'rc-payments',
  standalone: true,
  imports: [
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    DatePipe,
    SlicePipe,
    CurrencyPipe,
    NgIf
  ],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.scss'
})
export class PaymentsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  rcBackend = inject(RcBackendService);
  
  // Table setup
  displayedColumns: string[] = ['index', 'serverName', 'amount', 'ratingAdded', 'paymentMethod', 'date', 'status'];
  dataSource = new MatTableDataSource<Transaction>();
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  isLoading = true;

  constructor() {}

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions() {
    this.isLoading = true;
    this.rcBackend.loadTransactions()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (transactions) => {
          this.dataSource.data = transactions;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    // Custom sorting for date column
    this.dataSource.sortingDataAccessor = (item, property): any => {
      switch (property) {
        case 'date': return new Date(item.date).getTime();
        default: return item[property as keyof Transaction];
      }
    };
  }

  // Метод для получения индекса с учетом пагинации
  getDisplayedIndex(index: number): number {
    if (this.paginator) {
      return index + 1 + (this.paginator.pageIndex * this.paginator.pageSize);
    }
    return index + 1;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getStatusName(status: string): string {
    const statusNames: Record<string, string> = {
      'pending': 'В обработке',
      'completed': 'Завершено',
      'failed': 'Ошибка'
    };
    return statusNames[status] || status;
  }
  
  getPaymentMethodName(method: string): string {
    const methodNames: Record<string, string> = {
      'card': 'Карта',
      'crypto': 'Криптовалюта',
      'balance': 'Баланс'
    };
    return methodNames[method] || method;
  }
}