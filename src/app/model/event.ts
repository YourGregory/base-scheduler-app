// event.model.ts
import { Student } from './student';

export class Event {
  student: Student;
  lessonDay: any;
  lessonStart: Date;
  lessonEnd: Date;
  price: number;

  constructor(student: Student, lessonDay: number, lessonStart: Date, lessonEnd: Date, price: number) {
    this.student = student;
    this.lessonDay = lessonDay;
    this.lessonStart = lessonStart;
    this.lessonEnd = lessonEnd;
    this.price = price
  }
}
