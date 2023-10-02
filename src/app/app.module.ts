import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import { AppComponent } from './app.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import {adapterFactory} from "angular-calendar/date-adapters/date-fns";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { CalendarComponent } from './calendar/calendar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SidenavComponent } from './sidenav/sidenav.component';
import { AppRoutingModule } from './app-routing.module';
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    SchedulerComponent,
    CalendarComponent,
    SidenavComponent
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
        FormsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
