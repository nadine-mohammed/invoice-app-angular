import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Invoice } from 'src/app/shared/invoice.model';
import { InvoiceService } from '../invoice.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-invoice-manage',
  templateUrl: './invoice-manage.component.html',
  styleUrls: ['./invoice-manage.component.css'],
})
export class InvoiceManageComponent implements OnInit, OnDestroy {
  @Input() invRealID!: string;
  invIdx!: number;
  currentInvoice!: Invoice;
  invoiceForm!: FormGroup;
  @ViewChild('invFormRef') invFormRef!: ElementRef;
  //
  formHeader: string = 'New Invoice';
  selectedPayment = 'Net 30 Days';
  paymentOptions = ['Net 1 Day', 'Net 7 Days', 'Net 14 Days', 'Net 30 Days'];
  optionsDisplay: boolean = false;
  editMode: boolean = false;
  isInvalidFormSubmitted = false;
  //
  subscription!: Subscription;
  subscrib!: Subscription;
  constructor(
    private invoiceServ: InvoiceService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.invIdx = +params['id'];
    });
    if (!isNaN(this.invIdx)) {
      this.currentInvoice = this.invoiceServ.getInvoice(this.invIdx);
      // initialize form again if updated
      this.subscription = this.invoiceServ.updatedInvoice.subscribe((inv) => {
        this.currentInvoice = inv;
        this.initForm();
      });
    }
    // initialize form again if closed
    this.subscrib = this.invoiceServ.isManageDisplayed.subscribe((isDis) => {
      if (isDis) {
        this.initForm();
      }
    });
    this.initForm();
  }
  initForm() {
    let street = '';
    let city = '';
    let postCode = '';
    let country = '';
    let clientName = '';
    let clientEmail = '';
    let clientStreet = '';
    let clientCity = '';
    let clientPostCode = '';
    let clientCountry = '';
    let invoiceDate = '';
    let paymentTerms = '';
    let projectDescription = '';
    let itemList = new FormArray([]);
    //edit mode
    if (!isNaN(this.invIdx)) {
      this.editMode = true;
      this.formHeader = 'Edit Invoice';
      this.selectedPayment = `Net ${this.currentInvoice.paymentTerms} Days`;
      street = this.currentInvoice.senderAddress.street;
      city = this.currentInvoice.senderAddress.city;
      postCode = this.currentInvoice.senderAddress.postCode;
      country = this.currentInvoice.senderAddress.country;
      clientName = this.currentInvoice.clientName;
      clientEmail = this.currentInvoice.clientEmail;
      clientStreet = this.currentInvoice.clientAddress.street;
      clientCity = this.currentInvoice.clientAddress.city;
      clientPostCode = this.currentInvoice.clientAddress.postCode;
      clientCountry = this.currentInvoice.clientAddress.country;
      invoiceDate = this.currentInvoice.createdAt;
      paymentTerms = this.currentInvoice.paymentTerms;
      projectDescription = this.currentInvoice.description;
      for (let i = 0; i < this.currentInvoice.items.length; i++) {
        itemList.push(
          new FormGroup({
            name: new FormControl(
              this.currentInvoice.items[i].name,
              Validators.required
            ),
            quantity: new FormControl(
              this.currentInvoice.items[i].quantity,
              Validators.required
            ),
            price: new FormControl(
              this.currentInvoice.items[i].price.toString(),
              [Validators.required, this.checkPriceValidation]
            ),
            total: new FormControl(
              this.currentInvoice.items[i].total.toString()
            ),
          })
        );
      }
    }
    this.invoiceForm = new FormGroup({
      street: new FormControl(street, Validators.required),
      city: new FormControl(city, Validators.required),
      postCode: new FormControl(postCode, Validators.required),
      country: new FormControl(country, Validators.required),
      clientName: new FormControl(clientName, Validators.required),
      clientEmail: new FormControl(clientEmail, [
        Validators.required,
        Validators.email,
      ]),
      clientStreet: new FormControl(clientStreet, Validators.required),
      clientCity: new FormControl(clientCity, Validators.required),
      clientPostCode: new FormControl(clientPostCode, Validators.required),
      clientCountry: new FormControl(clientCountry, Validators.required),
      invoiceDate: new FormControl(invoiceDate, Validators.required),
      paymentTerms: new FormControl(paymentTerms, Validators.required),
      projectDescription: new FormControl(
        projectDescription,
        Validators.required
      ),
      itemList: itemList,
    });
    this.invoiceForm.get('paymentTerms')?.setValue(this.selectedPayment);
  }

  checkPriceValidation(control: FormControl): { [s: string]: boolean } | null {
    let reg = /^\d*\.?\d*$/;
    if (control.value && control.value.length > 0) {
      if (!reg.test(control.value)) {
        return { validPrice: false };
      }
    }
    return null;
  }
  calculateTotal(priceControl: any, quantityControl: any, totalControl: any) {
    if (priceControl.valid && quantityControl.value) {
      let q = +quantityControl.value;
      let p = +priceControl.value;
      let total = p * q;
      totalControl.setValue(total.toString());
    }
  }

  getItems() {
    return (<FormArray>this.invoiceForm.get('itemList')).controls;
  }
  onAddItem() {
    (<FormArray>this.invoiceForm.get('itemList')).push(
      new FormGroup({
        name: new FormControl('', Validators.required),
        quantity: new FormControl('', Validators.required),
        price: new FormControl('', [
          Validators.required,
          this.checkPriceValidation,
        ]),
        total: new FormControl('0'),
      })
    );
  }
  onDeleteItem(idx: number) {
    (<FormArray>this.invoiceForm.get('itemList')).removeAt(idx);
  }
  onSubmit(isDraft: boolean) {
    // console.log(this.invoiceForm);
    if (!this.invoiceForm.invalid) {
      let pTerms = this.invoiceForm.get('paymentTerms')?.value;
      let PTermsNum = +pTerms.match(/(\d+)/)[0];
      //
      let invoiceId = this.editMode ? this.invRealID : this.generateNewId(6);
      // to string
      let createdatDate = new Date(this.invoiceForm.get('invoiceDate')?.value);
      let formattedCreatedAt = this.formatDate(createdatDate);
      let paymentDate = new Date();
      paymentDate.setDate(createdatDate.getDate() + PTermsNum);
      let formattedPaymentDate = this.formatDate(paymentDate);
      //
      let desc = this.invoiceForm.get('projectDescription')?.value;
      let clientName = this.invoiceForm.get('clientName')?.value;
      let clientEmail = this.invoiceForm.get('clientEmail')?.value;
      let status = isDraft ? 'draft' : 'pending';
      let senderAdd = {
        street: this.invoiceForm.get('street')?.value,
        city: this.invoiceForm.get('city')?.value,
        postCode: this.invoiceForm.get('postCode')?.value,
        country: this.invoiceForm.get('country')?.value,
      };
      let clientAdd = {
        street: this.invoiceForm.get('clientStreet')?.value,
        city: this.invoiceForm.get('clientCity')?.value,
        postCode: this.invoiceForm.get('clientPostCode')?.value,
        country: this.invoiceForm.get('clientCountry')?.value,
      };
      let items = this.invoiceForm.get('itemList')?.value;
      let allCost = 0;
      let newItems = items.map((item: any) => {
        let name = item.name;
        let price = +item.price;
        let quantity = +item.quantity;
        let total = +item.total;
        allCost += total;
        return { name, quantity, price, total };
      });
      let newInvoice = new Invoice(
        invoiceId,
        formattedCreatedAt.toString(),
        formattedPaymentDate.toString(),
        desc,
        PTermsNum.toString(),
        clientName,
        clientEmail,
        status,
        senderAdd,
        clientAdd,
        newItems,
        allCost
      );
      if (this.editMode) {
        this.invoiceServ.updateInvoice(this.invIdx, newInvoice);
      } else {
        this.invoiceServ.addInvoice(newInvoice);
      }
      this.onCloseForm();
    } else {
      this.isInvalidFormSubmitted = true;
    }
  }
  onCloseForm() {
    if (this.editMode) {
      this.router.navigate(['/invoices', this.invIdx]);
    } else {
      this.invoiceForm.reset();
      this.router.navigate(['/']);
    }
    //-------------------------------
    this.invFormRef.nativeElement.scrollTo(0, 0);
    this.optionsDisplay = false;
    this.editMode = false;
    this.isInvalidFormSubmitted = false;
    //-----------------------------
    this.invoiceServ.setDisplay(false);
  }
  generateNewId(idLen: number) {
    let newId = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < idLen; i++) {
      newId += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return newId;
  }
  formatDate(userDateInp: Date) {
    let month = '' + (userDateInp.getMonth() + 1),
      day = '' + userDateInp.getDate(),
      year = userDateInp.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }
  onTogglePayment() {
    this.optionsDisplay = !this.optionsDisplay;
  }
  onSetPayment(payment: any) {
    this.selectedPayment = payment;
    this.invoiceForm.get('paymentTerms')?.setValue(payment);
    this.onTogglePayment();
  }
  ngOnDestroy() {
    if (this.invIdx) {
      this.subscription.unsubscribe();
    }
    this.subscrib.unsubscribe();
  }
}
