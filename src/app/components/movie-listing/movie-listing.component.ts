import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { MatDialog } from '@angular/material/dialog';
import { AddMovieComponent } from "../add-movie/add-movie.component"
import { LoginComponent } from "../login/login.component"
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-movie-listing',
  templateUrl: './movie-listing.component.html',
  styleUrls: ['./movie-listing.component.css']
})
export class MovieListingComponent implements OnInit {

  constructor(
    private backendService: BackendService,
    public dialog: MatDialog,
    public authService:AuthService
  ) { }

  isLoggedIn=false;
  ngOnInit() {
    this.isLoggedIn=localStorage.getItem('token')?true:false;
    this.getMovies(0, 15);
    this.onGetGenreList();
  }

  movies = [];
  loadMoreFlag=false;
  getMovies(start, limit) {
    this.backendService.getMovies(start, limit).subscribe((res: any) => {
      if (res.success) {
        this.movies = res.movies;
        this.loadMoreFlag=true;
      }
    })
  }

  loadMoreMovies() {
    if(!this.sortBy){
      this.backendService.getMovies(this.movies.length, 15).subscribe((res: any) => {
        if (res.success) {
          this.movies = this.movies.concat(res.movies)
        }
      })
    }else{
      this.backendService.getSortedMovies(this.sortBy,this.movies.length,15).subscribe((res:any)=>{
        if(res.success){
          this.movies=this.movies.concat(res.movies);
        }else{
          this.movies=[];
        }
      })
    }
  }

  searchValue=""
  onSearchClick(){
    if(this.searchValue){
      this.loadMoreFlag=false;
      this.backendService.serachMovies(this.searchValue).subscribe((res:any)=>{
        if(res.success){
          this.movies=res.movies;
        }else{
          this.movies=[]
        }
      })
    }else{
      this.getMovies(0,15)
    }
  }

  onGetGenreList(){
    this.backendService.getGenreList().subscribe((res:any)=>{
      if(res.success){
        this.genreList=res.genres;
      }else{
        this.genreList=[];
      }
    })
  }

  genreList=[];
  selectedGenre=[]
  onGetMoviesByGenre(selecetedGenre){
    if(this.selectedGenre.includes(selecetedGenre)){
      
    }else{
      this.selectedGenre.push(selecetedGenre);
    }
    if(this.selectedGenre.length==1){
      this.loadMoreFlag=false;
      let post_data={
        genre:[selecetedGenre]
      }
      this.backendService.getMoviesByGenre(post_data).subscribe((res:any)=>{
        if(res.success){
          this.movies=res.movies;
        }else{
          this.movies=[];
        }
      })
    }else if(this.selectedGenre.length>1){
      this.filterMoviesByMultipleGenre(selecetedGenre);      
    }
  }
  filterMoviesByMultipleGenre(genre){
    console.log(this.movies)
    this.movies=this.movies.filter(ele=>{
      let regex = new RegExp( ele.genre.join( "|" ), "i");
      return regex.test(genre)
    })
    console.log(this.movies)
  }
  getSortedMovies(){
    this.backendService.getSortedMovies(this.sortBy,this.movies.length,15).subscribe((res:any)=>{
      if(res.success){
        this.movies=res.movies;
      }else{
        this.movies=[];
      }
    })
  }
  sortBy="";
  onSortByChange(){
    if(this.sortBy){
      this.movies=[];
      this.getSortedMovies()
    }
  }


  onClear(){
    this.searchValue="";
    this.sortBy="";
    this.getMovies(0,15) 
  }

  removeGenreFilter(){
    this.selectedGenre=[];
    this.getMovies(0,15);
  }

  onLogout(){
    localStorage.clear();
    this.isLoggedIn=false
  }
  

  onLoginClick() {
    const dialogRef = this.dialog.open(LoginComponent, {
      data: {},
      width: '300px'
    });
  }

  onMovieDelete(movie){
    if(confirm(movie.name+" will be delete")){
      let id=movie._id
    console.log(id)
    this.backendService.deleteMovie(id).subscribe((res:any)=>{
      if(res.success){
        this.movies.splice(this.movies.indexOf(movie),1)
        alert('Movie Deleted')
      }else{
        alert('Unable to delete')
      }
    })
    }
  }


  openDialog(movie) {
    const dialogRef = this.dialog.open(AddMovieComponent, {
      data: {
        movie
      },
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(res => {
      for (let i = 0; i < this.movies.length; i++) {
        if (this.movies[i]._id === res.id) {
          this.movies[i] = res.movie;
          break;
        }
      }
    })
  }

}
