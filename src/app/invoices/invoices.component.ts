import { Component, OnDestroy, OnInit } from '@angular/core';
import { Invoice } from '../shared/invoice.model';
import { InvoiceService } from './invoice.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css'],
})
export class InvoicesComponent implements OnInit, OnDestroy {
  invoices: Invoice[] = [];
  isDisplayed: boolean = false;
  subscription!: Subscription;
  sub!: Subscription;
  constructor(private invoiceServ: InvoiceService) {}
  ngOnInit(): void {
    this.invoices = this.invoiceServ.getInvoices();
    this.subscription = this.invoiceServ.updatedInvoices.subscribe(
      (invoices: Invoice[]) => {
        this.invoices = invoices;
      }
    );
    this.sub = this.invoiceServ.isManageDisplayed.subscribe((isDis) => {
      this.isDisplayed = isDis;
    });
  }
  getRealIdx(invId: string) {
    let invsList = this.invoiceServ.getInvoices();
    let inv = invsList.filter((inv) => {
      return inv.id === invId;
    });
    let idx = invsList.indexOf(inv[0]);
    return idx;
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.sub.unsubscribe();
  }
}
