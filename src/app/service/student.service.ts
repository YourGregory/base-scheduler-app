import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Student} from "../model/student";

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private url = 'http://localhost:8080/'

  constructor(private httpClient: HttpClient) { }

  public getAllStudents(): Observable<Student[]> {
    return this.httpClient.get<Student[]>(this.url + 'api/student');
  }
}
