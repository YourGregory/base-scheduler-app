import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import { AppComponent } from './app.component';
import {adapterFactory} from "angular-calendar/date-adapters/date-fns";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { CalendarComponent } from './calendar/calendar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SidenavComponent } from './sidenav/sidenav.component';
import { AppRoutingModule } from './app-routing.module';
import {FormsModule} from "@angular/forms";
import { StudentsComponent } from './students/students.component';
import { HttpClientModule} from "@angular/common/http";
import { WeekComponent } from './week/week.component';

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    SidenavComponent,
    StudentsComponent,
    WeekComponent
  ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory,
        }),
        NgbModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
