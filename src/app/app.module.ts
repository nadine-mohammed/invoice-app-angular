import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { InvoiceItemComponent } from './invoices/invoice-item/invoice-item.component';
import { InvoiceDetailsComponent } from './invoices/invoice-details/invoice-details.component';
import { HttpClientModule } from '@angular/common/http';
import { InvoiceManageComponent } from './invoices/invoice-manage/invoice-manage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidebarComponent } from './invoices/sidebar/sidebar.component';
import { TopbarComponent } from './invoices/topbar/topbar.component';
import { ActionsBarComponent } from './invoices/invoice-details/actions-bar/actions-bar.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
// date
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
//
// dialog
import { MatDialogModule } from '@angular/material/dialog';
//
//snackbar
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DeleteDialogComponent } from './invoices/delete-dialog/delete-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    InvoicesComponent,
    InvoiceItemComponent,
    InvoiceDetailsComponent,
    InvoiceManageComponent,
    SidebarComponent,
    TopbarComponent,
    ActionsBarComponent,
    DeleteDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NoopAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
