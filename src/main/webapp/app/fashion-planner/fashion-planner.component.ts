import { Component, OnInit } from '@angular/core';
import { EntityArrayResponseType, EventService } from '../entities/event/service/event.service';
import { Router } from '@angular/router';
import { ProfileService } from '../layouts/profiles/profile.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from '../core/auth/account.model';
import { WeatherDataService } from './weather-c/weather-data.service';

@Component({
  selector: 'jhi-fashion-planner',
  templateUrl: './fashion-planner.component.html',
  styleUrls: ['./fashion-planner.component.scss'],
})
export class FashionPlannerComponent implements OnInit {
  events: any;
  data: any;
  eventsByDay: { date: Date; events: any[] }[] = [];
  account: Account | null = null;

  constructor(
    private eventService: EventService,
    private router: Router,
    private profileService: ProfileService,
    private accountService: AccountService,
    private weatherService: WeatherDataService
  ) {}

  ngOnInit(): void {
    this.fetchEvents();

    this.accountService.getAuthenticationState().subscribe(account => {
      this.account = account;
    });

    this.weatherService.getData().subscribe(data => {
      this.data = data;
      console.log(data);
    });
  }

  fetchEvents() {
    this.eventService.query().subscribe(events => {
      this.events = events.body || [];
      this.groupEventsByDay();
    });
  }

  groupEventsByDay() {
    const nextSevenDays = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return date;
    });

    this.eventsByDay = nextSevenDays.map(date => {
      const eventsForDay = this.events
        .filter((event: { dateTime: string | number | Date }) => {
          const eventDate = new Date(event.dateTime);
          return eventDate.toDateString() === date.toDateString();
        })
        .sort((a: { dateTime: string | number | Date }, b: { dateTime: string | number | Date }) => {
          // Sort events based on their start times
          const startTimeA = new Date(a.dateTime).getTime();
          const startTimeB = new Date(b.dateTime).getTime();
          return startTimeA - startTimeB;
        });
      return { date, events: eventsForDay };
    });
  }

  viewEvent(id: string): void {
    this.router.navigate(['/event/' + id + '/edit']);
  }

  viewClothing(id: string): void {
    this.router.navigate(['/outfit/' + id + '/edit']);
  }

  addEvent(): void {
    this.router.navigate(['/event/new']);
  }

  currentTime() {
    return new Date();
  }
}
