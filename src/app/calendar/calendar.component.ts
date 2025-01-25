import {Component, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Student} from "../model/student";
import {Event} from "../model/event";
import {animate, style, transition, trigger} from '@angular/animations';
import {Router} from "@angular/router";
import {EventService} from "../service/event.service";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  animations: [
    trigger('dayClick', [
      transition(':enter', [
        style({transform: 'scale(0.8)', opacity: 0}),
        animate('200ms', style({transform: 'scale(1)', opacity: 1})),
      ]),
    ]),
    trigger('top-load', [
      transition(':enter', [
        style({transform: 'scale(0.8)', opacity: 0}),
        animate('200ms', style({transform: 'scale(1)', opacity: 1})),
      ]),
    ]),
  ],
})
export class CalendarComponent implements OnInit {

  currentMonth: Date = new Date();
  calendarDays: ({ date: Date; disabled: boolean })[] = [];
  selectedDay!: ({ date: Date; disabled: boolean });

  students: Student[] = [
    new Student(1, 'John', 'Doe', 'https://meet.google.com/rrd-aavb-qgy', '#ff5733'),
    new Student(2, 'Jane', 'Smith', 'https://meet.google.com/rrd-aavb-qgy', '#33ffc2')
  ];

  events: Event[] = [];
  constructor(private eventService: EventService, private router: Router) {
  }

  openWeekView(selectedDate: Date) {
    // Use the router to navigate to the week view with the selected date
    this.router.navigate(['/week', {selectedDate: selectedDate.toISOString()}]);
  }

  ngOnInit(): void {
    console.log("here");
    this.getAllEvents();
    this.generateCalendar();
  }

  getAllEvents() {
    this.eventService.getAllEvents().subscribe(events => {
      console.log(events);
      this.events = events;
    })
  }

  generateCalendar() {
    const firstDayOfMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth(),
      1
    );

    // Find the day of the week for the first day of the current month (0 = Sunday, 1 = Monday, etc.)
    const startDayOfWeek = firstDayOfMonth.getDay();

    // Calculate the number of days in the current month
    const daysInMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + 1,
      0
    ).getDate();

    // Calculate the number of days to display from the previous month

    // Calculate the number of empty cells from the previous month based on the starting day of the week
    const daysFromPreviousMonth = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

// Calculate the total number of days to display in the calendar for the current month
    const totalDaysInMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0).getDate();

// Calculate the total number of cells needed to display the calendar
    const totalCells = Math.ceil((daysFromPreviousMonth + totalDaysInMonth) / 7) * 7;


    // Generate calendar days array with dates from the previous, current, and next months
    this.calendarDays = Array.from({length: totalCells}, (_, index) => {
      let date: Date;
      if (index < daysFromPreviousMonth) {
        // Display dates from the previous month
        const previousMonth = new Date(
          this.currentMonth.getFullYear(),
          this.currentMonth.getMonth() - 1,
          1
        );
        date = new Date(
          previousMonth.getFullYear(),
          previousMonth.getMonth(),
          previousMonth.getDate() + (index - daysFromPreviousMonth)
        );
      } else if (index < daysFromPreviousMonth + daysInMonth) {
        // Display dates from the current month
        date = new Date(
          this.currentMonth.getFullYear(),
          this.currentMonth.getMonth(),
          index - daysFromPreviousMonth + 1
        );
      } else {
        // Display dates from the next month and mark them as disabled
        const nextMonth = new Date(
          this.currentMonth.getFullYear(),
          this.currentMonth.getMonth() + 1,
          1
        );
        date = new Date(
          nextMonth.getFullYear(),
          nextMonth.getMonth(),
          index - (daysFromPreviousMonth + daysInMonth) + 1
        );
      }

      // Determine if the date should be disabled (dates from previous and next months)
      const isDisabled = date.getMonth() !== this.currentMonth.getMonth();

      return {
        date: date,
        disabled: isDisabled,
      };
    });
  }


  hasEventsForDay(day: Date): boolean {
    // Replace this with your actual events array and logic
    return this.events.some(event => this.isSameDay(event.lessonStart, day));
  }

  // Function to get events for the day
  getStudentsForDay(day: Date): Event[] {
    return this.events
      .filter(event => this.isSameDay(event.lessonStart, day))
      .splice(0, 5);
  }

  isSameDay(date1: Date, date2: Date): boolean {
    console.log(date1);
    date1 = new Date(date1);
    console.log(date2);
    return date1.toDateString() === date2.toDateString();
  }

  goToPreviousMonth() {
    // Move to the previous month
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() - 1,
      1
    );
    this.generateCalendar(); // Regenerate the calendar for the new month
  }

  goToNextMonth() {
    // Move to the next month
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + 1,
      1
    );
    this.generateCalendar(); // Regenerate the calendar for the new month
  }

  getFormattedTime(lessonStart: Date, lessonEnd: Date) {
    lessonStart = new Date(lessonStart);
    lessonEnd = new Date(lessonEnd);
    return lessonStart.getHours() + ":" + lessonStart.getMinutes() + "-"
      + lessonEnd.getHours() + ":" + lessonEnd.getMinutes()
  }
}
