import {Component, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Student} from "../model/student";
import {Event} from "../model/event";
import {animate, style, transition, trigger} from '@angular/animations';
import {FileService} from "../service/file.service";

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
    ],
})
export class CalendarComponent implements OnInit {
    isNewRow: boolean = false;
    newEvent: any = {
        student: '',
        lessonStart: '',
        lessonEnd: '',
        price: 0,
    };
    currentMonth: Date = new Date();
    calendarDays: ({ date: Date; disabled: boolean })[] = [];
    selectedDay!: ({ date: Date; disabled: boolean });
    selectedStudent!: Student;
    students: Student[] = [
        new Student(1, 'John', 'Doe', 'https://meet.google.com/rrd-aavb-qgy', '#ff5733'),
        new Student(2, 'Jane', 'Smith', 'https://meet.google.com/rrd-aavb-qgy', '#33ffc2')
    ];

    events: Event[] = [
        new Event(this.students[0], 1, new Date('2023-10-01T09:00:00'), new Date('2023-10-01T10:00:00'), 50.00),

        new Event(this.students[0], 1, new Date('2023-10-02T09:00:00'), new Date('2023-10-01T10:00:00'), 50.00),

        new Event(this.students[1], 2, new Date('2023-10-04T14:00:00'), new Date('2023-10-02T15:30:00'), 100.00),

        new Event(this.students[1], 2, new Date('2023-10-10T14:00:00'), new Date('2023-10-09T15:30:00'), 100.00),
        new Event(this.students[1], 2, new Date('2023-10-10T14:00:00'), new Date('2023-10-09T15:30:00'), 100.00),

        new Event(this.students[1], 2, new Date('2023-10-20T14:00:00'), new Date('2023-10-16T15:30:00'), 100.00),
        new Event(this.students[1], 2, new Date('2023-10-20T14:00:00'), new Date('2023-10-16T15:30:00'), 100.00),

        new Event(this.students[1], 2, new Date('2023-10-23T14:00:00'), new Date('2023-10-16T15:30:00'), 100.00),
        new Event(this.students[1], 2, new Date('2023-10-23T14:00:00'), new Date('2023-10-16T15:30:00'), 100.00),

        new Event(this.students[1], 2, new Date('2023-10-31T14:00:00'), new Date('2023-10-16T15:30:00'), 100.00),
        new Event(this.students[1], 2, new Date('2023-10-31T14:00:00'), new Date('2023-10-16T15:30:00'), 100.00)
    ];

    constructor(private modalService: NgbModal, private fileService: FileService) {
    }

    ngOnInit(): void {
        this.generateCalendar();
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

        const daysFromPreviousMonth = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

        // Calculate the total number of cells to display in the calendar (previous + current + next)
        const totalCells = daysFromPreviousMonth + daysInMonth + 5; // Add 6 days from the next month

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

    openModal(day: { date: Date; disabled: boolean }, content: any) {
        this.selectedDay = day;
        this.cancelNewRow()
        this.modalService.open(content, {centered: true}); // Open the modal
    }

    filterEventsByDay(selectedDay: ({ date: Date; disabled: boolean }) | null): any[] {
        return this.events.filter((event) => {
            const eventDate = new Date(event.lessonStart);
            if (selectedDay == null)
                return [];
            return eventDate.toDateString() === selectedDay.date.toDateString();
        });
    }

    hasEventsForDay(day: Date): boolean {
        // Replace this with your actual events array and logic
        return this.events.some(event => this.isSameDay(event.lessonStart, day));
    }

    // Function to get events for the day
    getStudentsForDay(day: Date): Student[] {
        let students = this.events
            .filter(event => this.isSameDay(event.lessonStart, day))
            .map(event => event.student).splice(0, 5);
        return students;
    }

    isSameDay(date1: Date, date2: Date): boolean {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        );
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

    addNewRow() {
        this.isNewRow = true;
    }

    onStudentSelected(selectedStudent: string) {
        console.log(selectedStudent);
        this.selectedStudent = this.findStudentById(parseInt(selectedStudent));
        console.log(this.selectedStudent)
    }

    findStudentById(id: number): Student {
        return <Student>this.students.find((student: Student) => student.id === id);
    }
    saveNewRow() {
        // Validate and save the new event, then hide the new row
        if (
            this.newEvent.student &&
            this.newEvent.lessonStart &&
            this.newEvent.lessonEnd &&
            this.newEvent.price !== null
        ) {

            const lessonStart = new Date(this.selectedDay.date);
            var startArr = this.newEvent.lessonStart.replace(" AM", "").split(":");
            lessonStart.setHours(startArr[0]);
            lessonStart.setMinutes(startArr[1]);

            const lessonEnd = new Date(this.selectedDay.date);
            var endArr = this.newEvent.lessonEnd.replace(" AM", "").split(":");
            lessonEnd.setHours(endArr[0]);
            lessonEnd.setMinutes(endArr[1]);

            this.events.push(new Event(this.selectedStudent, this.selectedDay.date.getDate(), lessonStart, lessonEnd, this.newEvent.price));
            // this.fileService.saveEventsToFile(this.events, 'events.json')
            this.newEvent = {
                student: '',
                lessonStart: '',
                lessonEnd: '',
                price: 0,
            };
            this.isNewRow = false;
        }
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
}
