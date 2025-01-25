import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Event} from "../model/event";

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private url = "http://localhost:8080/api/lesson";

  constructor(private httpClient: HttpClient) { }

  public getAllEvents(): Observable<Event[]> {
    return this.httpClient.get<Event[]>(this.url)
  }

  public create(newEvent: any) {
    return this.httpClient.post(this.url, newEvent);
  }

  public update(newEvent: Event) {
    return this.httpClient.put(this.url, newEvent)
  }

  delete(id: number) {
    const endPoint = "/delete?id="+id;
    console.log("entered delete on endpoint ", endPoint);
    return this.httpClient.delete<Event>(this.url+endPoint);
  }
}
