import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {CalendarComponent} from "./calendar/calendar.component";
import {StudentsComponent} from "./students/students.component";
import {WeekComponent} from "./week/week.component";

const routes: Routes = [
  { path: 'schedule', component: CalendarComponent},
  { path: 'students', component: StudentsComponent},
  { path: 'week', component: WeekComponent},
  { path: '', redirectTo: '/schedule', pathMatch: 'full' },
  { path: '**', redirectTo: '/schedule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
