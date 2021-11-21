import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Invoice } from '../shared/invoice.model';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  isManageDisplayed = new Subject<boolean>();
  updatedInvoices = new Subject<Invoice[]>();
  updatedInvoice = new Subject<Invoice>();
  private invoices: Invoice[] = [];
  private isDisplayed = false;

  setInvoices(invs: Invoice[]) {
    this.invoices = invs;
  }
  //get all
  getInvoices() {
    return this.invoices.slice();
  }
  //get one
  getInvoice(id: number) {
    let inv = this.invoices[id];
    if (!inv) {
      window.location.href = '/';
    }
    return inv;
  }
  //new invoice
  addInvoice(invoice: Invoice) {
    this.invoices.push(invoice);
    this.updatedInvoices.next(this.invoices.slice());
  }
  //edit invoice
  updateInvoice(idx: number, invoice: Invoice) {
    let inv = this.invoices[idx];
    if (!inv) {
      window.location.href = '/';
      return;
    }
    this.invoices[idx] = invoice;
    this.updatedInvoice.next(invoice);
  }
  //delete invoice
  deleteInvoice(idx: number) {
    let inv = this.invoices[idx];
    if (!inv) {
      window.location.href = '/';
      return;
    }
    this.invoices = this.invoices.filter((inv, indx) => {
      return indx !== idx;
    });
    this.updatedInvoices.next(this.invoices.slice());
  }
  //--------------------------------------------------------------
  // update invoice status
  updateInvoiceStatus(idx: number, status: string) {
    let inv = this.invoices[idx];
    inv.status = status;
    this.invoices[idx] = inv;
    this.updatedInvoice.next(inv);
  }
  //filter invs by status
  filterInvoicesByStatus(
    statusList: { id: number; value: string; ischecked: boolean }[]
  ) {
    let checkStatusList = statusList.filter((status) => {
      return status.ischecked === true;
    });
    if (checkStatusList && checkStatusList.length > 0) {
      let invsList: Invoice[] = [];
      let li: Invoice[] = [];
      for (let status of checkStatusList) {
        li = this.invoices.filter((inv) => {
          return inv.status === status.value;
        });
        invsList.push(...li);
      }
      //sort from the smaller to bigger (ASC)
      invsList = invsList.sort(
        (a, b) =>
          new Date(a.paymentDue).getTime() - new Date(b.paymentDue).getTime()
      );
      this.updatedInvoices.next(invsList);
      //
    } else {
      this.updatedInvoices.next(this.invoices.slice());
    }
  }
  //------------------------------
  setDisplay(isDis?: boolean) {
    if (isDis == false) {
      this.isDisplayed = false;
    } else {
      this.isDisplayed = !this.isDisplayed;
    }
    this.isManageDisplayed.next(this.isDisplayed);
  }
  constructor() {}
}
