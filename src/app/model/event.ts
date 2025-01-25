// event.model.ts
import { Student } from './student';

export class Event {
  id: number;
  student: Student;
  lessonStart: Date;
  lessonEnd: Date;
  price: number;

  constructor(id: number, student: Student, lessonStart: Date, lessonEnd: Date, price: number) {
    this.id = id;
    this.student = student;
    this.lessonStart = lessonStart;
    this.lessonEnd = lessonEnd;
    this.price = price
  }
}
