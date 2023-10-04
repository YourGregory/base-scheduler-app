import {Component} from '@angular/core';
import {Student} from "../model/student";
import {animate, style, transition, trigger} from "@angular/animations";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Event} from "../model/event";

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
  animations: [
    trigger('load', [
      transition(':enter', [
        style({transform: 'scale(0.8)', opacity: 0}),
        animate('300ms', style({transform: 'scale(1)', opacity: 1})),
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
export class StudentsComponent {

  constructor(private modalService: NgbModal) {
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
  students: Student[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      link: 'https://example.com/johndoe',
      color: '#ff5733',
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      link: 'https://example.com/janesmith',
      color: '#33ff57',
    }
  ];

  saveNewRow() {
    this.students.push(this.newStudent);
    console.log("here")
    this.modalService.dismissAll();
    this.cancelNewRow();
  }

  openStudentModal(isNew: boolean, student: any, content: any) {
    this.isNewRow = isNew;
    if (student != null)
      this.newStudent = student;
    this.modalService.open(content, {centered: true}); // Open the modal
  }

  cancelNewRow() {
    this.newStudent =
      {
        id: 0,
        firstName: '',
        lastName: '',
        link: '',
        color: ''
      };
    this.isNewRow = false
  }
}
