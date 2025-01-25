import {Component, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {ActivatedRoute} from "@angular/router";
import {Event} from "../model/event";
import {Student} from "../model/student";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Time} from "@angular/common";
import {EventService} from "../service/event.service";
import {catchError, throwError} from "rxjs";
import {StudentService} from "../service/student.service";
import {StudentsComponent} from "../students/students.component";

@Component({
  selector: 'app-week',
  templateUrl: './week.component.html',
  styleUrls: ['./week.component.css'],
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
        animate('300ms', style({transform: 'scale(1)', opacity: 1})),
      ]),
    ]),
  ],
})
export class WeekComponent implements OnInit {
  hours: string[] = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
    '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
  ];
  days: Date[] = [];
  selectedWeek: any;
  weekStart = new Date();
  weekEnd = new Date();
  selectedDay!: Date;

  isNewRow: boolean = false;
  newEvent: any = {
    student: '',
    lessonStart: Date,
    lessonEnd: Date,
    price: 0,
  };
  selectedStudent!: Student;
  students: Student[] = [];

  events: Event[] = [];

  constructor(private modalService: NgbModal, private route: ActivatedRoute, private eventService: EventService, private studentService: StudentService) {
  }

  ngOnInit() {
    this.getAllEvents();
    this.getAllStudents();
    this.route.params.subscribe(params => {
      this.selectedWeek = new Date(params['selectedDate']);
      // Use the selectedDate to display the weekly view
      this.calculateWeekStartAndEnd(this.selectedWeek);
      for (let date = new Date(this.weekStart); date <= this.weekEnd; date.setDate(date.getDate() + 1)) {
        this.days.push(new Date(date));
      }
    });
  }

  getEventsForCell(day: Date, hour: string): Event[] {
    return this.events.filter((event) => {
      // Check if the event falls within the current cell's date and hour
      const eventDate = new Date(event.lessonStart);
      const eventHour = eventDate.getHours().toString();
      const cellDate = day;
      const cellHour = hour.split(':')[0];
      return eventDate.toLocaleDateString() === cellDate.toLocaleDateString() && eventHour === cellHour;
    });
  }

  calculateWeekStartAndEnd(date: Date) {
    // Calculate the start date (Monday) of the week
    this.weekStart = new Date(date);
    this.weekStart.setDate(date.getDate() - date.getDay() + 1);

    // Calculate the end date (Sunday) of the week
    this.weekEnd = new Date(date);
    this.weekEnd.setDate(date.getDate() - date.getDay() + 7);
  }

  openModal(date: Date, content: any, hour: string) {
    this.selectedDay = date;
    this.cancelNewRow()
    this.newEvent.lessonStart = hour;
    this.modalService.open(content, {centered: true}); // Open the modal
  }

  filterEventsByDay(selectedDay: Date | null): any[] {
    return this.events.filter((event) => {
      const eventDate = new Date(event.lessonStart);
      if (selectedDay == null)
        return [];
      return eventDate.toDateString() === selectedDay.toDateString();
    });
  }

  cancelNewRow() {
    // Clear the new event fields and hide the new row
    this.newEvent = {
      student: '',
      lessonStart: '',
      lessonEnd: '',
      price: 0,
    };
    this.isNewRow = false;
  }

  addNewRow() {
    this.isNewRow = true;
  }

  onStudentSelected(selectedStudent: string) {
    this.selectedStudent = this.findStudentById(parseInt(selectedStudent));
  }

  findStudentById(id: number): Student {
    return <Student>this.students.find((student: Student) => student.id === id);
  }

  saveNewRow() {
    if (this.isNewRow) {
      this.eventService.create(this.castNewEvent()).pipe(
        catchError((err) => {
          return this.catchAppError(err);
        })
      ).subscribe(()=> {
        this.changesSubscribe();
      });
    } else {
      this.eventService.update(this.newEvent).pipe(
        catchError((err) => {
          return this.catchAppError(err);
        })
      ).subscribe(()=> {
        this.changesSubscribe();
      });
    }
  }

  private castNewEvent() {

    console.log(this.students);
    const foundStudent =
      this.students
        .find(student =>  this.selectedStudent.id === student.id);

    console.log(foundStudent);

    const lessonStart = this.selectedDay;
    lessonStart.setHours(this.newEvent.lessonStart.split(":")[0]);
    lessonStart.setMinutes(this.newEvent.lessonStart.split(":")[1]);

    const lessonEnd = this.selectedDay;
    lessonEnd.setHours(this.newEvent.lessonEnd.split(":")[0]);
    lessonEnd.setMinutes(this.newEvent.lessonEnd.split(":")[1]);
    const price = this.newEvent.price;
    const studentToSave = foundStudent as Student;
    const studentId = studentToSave.id;
    const eventToSave = {
      studentId, lessonStart, lessonEnd, price
    }
    console.log(eventToSave);
    return eventToSave;
  }

  private catchAppError(err: any) {
    window.alert("ooops... error :(: ");
    console.error(err.error);
    return throwError(() => err);
  }

  private changesSubscribe() {
    this.getAllEvents();
    this.modalService.dismissAll();
    this.cancelNewRow();
    console.log("here")
  }


  getAllEvents() {
    this.eventService.getAllEvents().subscribe(events => {
      console.log(events);
      this.events = events;
    })
  }

  getAllStudents() {
    this.studentService.getAllStudents().subscribe(students => {
      this.students = students;
    })
  }

  deleteEvent(lesson: Event) {
    this.eventService.delete(lesson.id).pipe(
      catchError((err) => {
        return this.catchAppError(err);
      })
    ).subscribe(()=> {
      this.getAllEvents();
    });
  }
}
