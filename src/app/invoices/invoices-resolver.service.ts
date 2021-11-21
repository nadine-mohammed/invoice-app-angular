import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { DataStorageService } from '../shared/data-storage.service';
import { Invoice } from '../shared/invoice.model';
import { InvoiceService } from './invoice.service';

@Injectable({
  providedIn: 'root',
})
export class InvoicesResolverService implements Resolve<Invoice[]> {
  constructor(
    private dataserv: DataStorageService,
    private invoiceServ: InvoiceService
  ) {}
  resolve(route: ActivatedRouteSnapshot, status: RouterStateSnapshot) {
    const invoices: Invoice[] = this.invoiceServ.getInvoices();
    if (invoices.length === 0) {
      return this.dataserv.fetchInvoices();
    } else {
      return invoices;
    }
  }
}
