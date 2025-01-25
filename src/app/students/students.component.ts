import {Component, OnInit} from '@angular/core';
import {Student} from "../model/student";
import {animate, style, transition, trigger} from "@angular/animations";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {StudentService} from "../service/student.service";
import {catchError, throwError} from "rxjs";

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
  animations: [
    trigger('load', [
      transition(':enter', [
        style({transform: 'scale(0.8)', opacity: 0}),
        animate('400ms', style({transform: 'scale(1)', opacity: 1})),
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
export class StudentsComponent implements OnInit {

  ngOnInit() {
    this.getAllStudents();
  }

  constructor(private modalService: NgbModal, private studentService: StudentService) {
  }

  getAllStudents() {
    this.studentService.getAllStudents().subscribe(students => {
      console.log('entered in get all')
      this.students = students;
      console.log(this.students);
    });
  }

  isNewRow: boolean = false;
  newStudent: any =
    {
      id: 0,
      firstName: '',
      lastName: '',
      link: '',
      color: ''
    };
  students: Student[] = [];

  saveNewRow() {
    if (this.isNewRow) {
      this.studentService.create(this.newStudent).pipe(
        catchError((err) => {
          return this.catchAppError(err);
        })
      ).subscribe(value => {
        this.changesSubscribe();
      });
    } else {
      this.studentService.update(this.newStudent).pipe(
        catchError((err) => {
          return this.catchAppError(err);
        })
      ).subscribe(value => {
        this.changesSubscribe()
      });
    }
  }

  private catchAppError(err: any) {
    window.alert("ooops... error :(: ");
    console.error(err.error);
    return throwError(() => err);
  }

  private changesSubscribe() {
    this.getAllStudents();
    this.modalService.dismissAll();
    this.cancelNewRow();
    console.log("here")
  }

  openStudentModal(isNew: boolean, student: any, content: any) {
    this.isNewRow = isNew;
    if (student != null)
      this.newStudent = student;
    else
      this.emptyStudent();
    this.modalService.open(content, {centered: true}); // Open the modal
  }

  cancelNewRow() {
    this.emptyStudent()
    this.isNewRow = false
  }

  private emptyStudent() {
    this.newStudent =
      {
        id: 0,
        firstName: '',
        lastName: '',
        link: '',
        color: ''
      };
  }
}
