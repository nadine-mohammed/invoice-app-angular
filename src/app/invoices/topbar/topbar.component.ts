import { Component, Input, OnInit } from '@angular/core';
import { InvoiceService } from '../invoice.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css'],
})
export class TopbarComponent implements OnInit {
  @Input() invCount!: number;
  displayVal = 'none';
  statusList: { id: number; value: string; ischecked: boolean }[] = [
    { id: 0, value: 'draft', ischecked: false },
    { id: 1, value: 'pending', ischecked: false },
    { id: 2, value: 'paid', ischecked: false },
  ];
  constructor(private invoiceServ: InvoiceService) {}

  ngOnInit(): void {}

  onToggleOptions() {
    if (this.displayVal === 'none') {
      this.displayVal = 'block';
    } else {
      this.displayVal = 'none';
    }
  }
  onFilterInvoices() {
    this.invoiceServ.filterInvoicesByStatus(this.statusList);
  }
  onAddInvoice() {
    this.invoiceServ.setDisplay();
  }
}
