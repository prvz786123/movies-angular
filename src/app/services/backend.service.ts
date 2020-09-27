import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment"
import { HttpClient } from "@angular/common/http"


@Injectable()
export class BackendService {
  env=environment;
  constructor(private http:HttpClient) { }

  login(credentials){
    let url=`${this.env.origin}/user/login`;
    return this.http.post(url,credentials)
  }

  getMovies(startLimit,endLimit){
    let url=`${this.env.origin}/movies?startLimit=${startLimit}&endLimit=${endLimit}`
    return this.http.get(url)
  }

  addMovie(newMovie){
    let url=`${this.env.origin}/movies/add`
    return this.http.post(url,newMovie)
  }

  updateMovie(updatedMovie){
    let url=`${this.env.origin}/movies/update`;
    return this.http.patch(url,updatedMovie);
  }

  serachMovies(searchValue:string){
    let serachValueEncoded = encodeURI(searchValue)
    let url=`${this.env.origin}/movies/search?movieName=${serachValueEncoded}`;
    return this.http.get(url);
  }

  getMoviesByGenre(genre){
    let url=`${this.env.origin}/movies/search/genre`;
    return this.http.post(url,genre);
  }

  getGenreList(){
    let url=`${this.env.origin}/movies/genre`;
    return this.http.get(url);
  }

  addGenre(genre){
    let url=`${this.env.origin}/movies/add/genre`;
    return this.http.post(url,genre);
  }

}
