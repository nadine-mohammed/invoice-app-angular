import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'invoice-app';
  ngOnInit() {
    if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
      window.location.href = '/';
    }
  }
}
