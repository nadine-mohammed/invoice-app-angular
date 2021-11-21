import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { Invoice } from 'src/app/shared/invoice.model';
import { InvoiceService } from '../invoice.service';
@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.css'],
})
export class InvoiceDetailsComponent implements OnInit, OnDestroy {
  invoiceIdx!: number;
  invoice!: Invoice;
  currencyCode = 'GBP';
  isDisplayed: boolean = false;
  subscription!: Subscription;
  sub!: Subscription;
  constructor(
    private route: ActivatedRoute,
    private invoiceServ: InvoiceService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.invoiceIdx = +params['id'];
    });
    this.invoice = this.invoiceServ.getInvoice(this.invoiceIdx);
    this.sub = this.invoiceServ.updatedInvoice.subscribe((newInv) => {
      this.invoice = newInv;
    });
    this.subscription = this.invoiceServ.isManageDisplayed.subscribe(
      (isDis) => {
        this.isDisplayed = isDis;
      }
    );
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.sub.unsubscribe();
  }
}
