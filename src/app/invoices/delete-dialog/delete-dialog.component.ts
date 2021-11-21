import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { InvoiceService } from '../invoice.service';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.css'],
})
export class DeleteDialogComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { invIdx: number; invRealId: string },
    private invoiceServ: InvoiceService,
    private router: Router
  ) {}

  ngOnInit(): void {}
  deleteInvoice() {
    this.invoiceServ.deleteInvoice(this.data.invIdx);
    this.close();
    this.router.navigate(['/']);
  }
  close() {
    this.dialogRef.close();
  }
}
