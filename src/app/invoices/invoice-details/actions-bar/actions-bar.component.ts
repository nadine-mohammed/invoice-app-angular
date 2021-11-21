import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InvoiceService } from '../../invoice.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../delete-dialog/delete-dialog.component';
import { Invoice } from 'src/app/shared/invoice.model';

@Component({
  selector: 'app-actions-bar',
  templateUrl: './actions-bar.component.html',
  styleUrls: ['./actions-bar.component.css'],
})
export class ActionsBarComponent implements OnInit {
  @Input() idx!: number;
  inv!: Invoice;
  statusTxt!: string;
  isDiabled = false;
  constructor(
    private invoiceServ: InvoiceService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.inv = this.invoiceServ.getInvoice(this.idx);
    this.statusTxt = this.inv.status;
    this.statusTxt === 'paid'
      ? (this.isDiabled = true)
      : (this.isDiabled = false);
    this.invoiceServ.updatedInvoice.subscribe((inv) => {
      this.statusTxt = inv.status;
    });
  }
  onPressBack() {
    this.router.navigate(['/']);
  }
  onEditInvoice() {
    this.invoiceServ.setDisplay();
  }
  onMarkAsPaid() {
    this.invoiceServ.updateInvoiceStatus(this.idx, 'paid');
    this._snackBar.open(`this invoice marked as paid`, '', {
      duration: 2500,
      verticalPosition: 'top',
    });
    this.isDiabled = true;
  }
  onDeleteInvoice() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      invIdx: this.idx,
      invRealId: this.inv.id,
    };
    this.dialog.open(DeleteDialogComponent, dialogConfig);
  }
}
