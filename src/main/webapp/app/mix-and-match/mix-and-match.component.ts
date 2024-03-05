import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jhi-mix-and-match',
  templateUrl: './mix-and-match.component.html',
  styleUrls: ['./mix-and-match.component.scss'],
})
export class MixAndMatchComponent implements OnInit {
  currentDateStr: string = '';
  currentTimeStr: string = '';
  constructor() {}

  ngOnInit(): void {
    this.getCurrentDateTime(); // Call the method initially
    setInterval(() => {
      this.getCurrentDateTime(); // Call the method every second
    }, 1000);
  }
  getCurrentDateTime(): void {
    const currentDate = new Date();
    this.currentDateStr = currentDate.toDateString();
    this.currentTimeStr = currentDate.toLocaleTimeString();
  }
}
