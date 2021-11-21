import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceDetailsComponent } from './invoices/invoice-details/invoice-details.component';
import { InvoiceManageComponent } from './invoices/invoice-manage/invoice-manage.component';
import { InvoicesResolverService } from './invoices/invoices-resolver.service';
import { InvoicesComponent } from './invoices/invoices.component';

const routes: Routes = [
  {
    path: '',
    component: InvoicesComponent,
    pathMatch: 'full',
    resolve: [InvoicesResolverService],
  },
  { path: 'invoices/:id', component: InvoiceDetailsComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
