import { Component, OnInit } from '@angular/core';
import { EventService } from '../entities/event/service/event.service';

@Component({
  selector: 'jhi-fashion-planner',
  templateUrl: './fashion-planner.component.html',
  styleUrls: ['./fashion-planner.component.scss'],
})
export class FashionPlannerComponent implements OnInit {
  events: any;
  eventsByDay: { date: Date; events: any[] }[] = [];

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.fetchEvents();
  }

  fetchEvents() {
    this.eventService.query().subscribe(events => {
      this.events = events.body || [];
      this.groupEventsByDay();
    });
  }

  groupEventsByDay() {
    const today = new Date();
    const nextSevenDays = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() + i);
      return date;
    });

    this.eventsByDay = nextSevenDays.map(date => {
      const eventsForDay = this.events.filter((event: { dateTime: string | number | Date }) => {
        const eventDate = new Date(event.dateTime);
        return eventDate.toDateString() === date.toDateString() && eventDate >= today;
      });
      return { date, events: eventsForDay };
    });
  }
}
