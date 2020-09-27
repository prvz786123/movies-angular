import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';

import { MatButtonModule,MatCardModule, MatChipsModule, MatIconModule,MatDialogModule, MatInputModule } from '@angular/material';


import { AppComponent } from './app.component';
import { MovieListingComponent } from './components/movie-listing/movie-listing.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BackendService } from './services/backend.service';
import { AddMovieComponent } from './components/add-movie/add-movie.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TokenInterceptor } from './services/token.interceptor';
import { AuthService } from './services/auth.service';
import { LoginComponent } from './components/login/login.component';

const appRoutes:Routes=[
  {
    path:"",
    component:MovieListingComponent,
  },
  {
    path:"login",
    component:LoginComponent
  }
]


@NgModule({
  declarations: [
    AppComponent,
    MovieListingComponent,
    AddMovieComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule
  ],
  providers: [
    BackendService,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents:[AddMovieComponent,LoginComponent]
})
export class AppModule { }
