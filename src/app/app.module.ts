import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {GoalsGraphsComponent} from './goals-graphs/goals-graphs.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule, MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatListModule} from '@angular/material/list';
import {HttpClientModule} from '@angular/common/http';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {DatePipe} from '@angular/common';
import {EditStatusValuesDialogComponent} from './edit-status-values-dialog/edit-status-values-dialog.component';
import {MatTableModule} from '@angular/material/table';
import {ErrorMessageComponent} from './error-message/error-message.component';

@NgModule({
  declarations: [
    AppComponent,
    GoalsGraphsComponent,
    EditStatusValuesDialogComponent,
    ErrorMessageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    FormsModule,
    HttpClientModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule
  ],
  providers: [DatePipe,
    {provide: MatDialogRef, useValue: {}}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
