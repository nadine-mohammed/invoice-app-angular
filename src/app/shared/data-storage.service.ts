import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs'; //to subscribe
import { tap, catchError } from 'rxjs/operators'; //also map
import { HttpClient } from '@angular/common/http'; //to fetch data
import { Invoice } from './invoice.model';
import { InvoiceService } from '../invoices/invoice.service';
@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  constructor(private http: HttpClient, private InvoiceServ: InvoiceService) {}
  fetchInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>('../assets/data.json').pipe(
      catchError(this.handleError),
      tap((invoices) => {
        this.InvoiceServ.setInvoices(invoices);
      })
    );
  }

  handleError(error: any) {
    return Observable.throw(error);
  }
}
