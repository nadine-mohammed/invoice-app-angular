import { Component, Input, OnInit } from '@angular/core';
import { Invoice } from 'src/app/shared/invoice.model';
import { InvoiceService } from '../invoice.service';

@Component({
  selector: 'app-invoice-item',
  templateUrl: './invoice-item.component.html',
  styleUrls: ['./invoice-item.component.css'],
})
export class InvoiceItemComponent implements OnInit {
  @Input() invoice!: Invoice;
  @Input() invoiceIdx!: number;
  currencyCode: string = 'GBP';
  constructor(private invoiceServ: InvoiceService) {}

  ngOnInit(): void {
    // console.log(this.invoice);
  }
}
