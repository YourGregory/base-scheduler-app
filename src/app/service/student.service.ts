import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Student} from "../model/student";
import {StudentsComponent} from "../students/students.component";

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private url = 'https://basescheduler-api.onrender.com/api/student';

  constructor(private httpClient: HttpClient) { }

  public getAllStudents(): Observable<Student[]> {
    return this.httpClient.get<Student[]>(this.url);
  }

  public create(newStudent: Student) {
    console.log(newStudent);
    return this.httpClient.post(this.url, newStudent);
  }

  update(newStudent: Student) {
    return this.httpClient.put(this.url, newStudent);
  }
}
