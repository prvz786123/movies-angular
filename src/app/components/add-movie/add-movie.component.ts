import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-add-movie',
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.css']
})
export class AddMovieComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    private fb:FormBuilder,
    private backendService:BackendService,
    public dialogRef: MatDialogRef<AddMovieComponent>,
    ) {}

  isEdit=false;
  newMovieForm:FormGroup;

  
  ngOnInit() {
    console.log(this.data)
    if(this.data.movie){
      this.setUpdateForm()
      this.isEdit=true;
    }else{
      this.setNewForm();
      this.isEdit=false;
    }
    this.onGetGenreList();
  }

  setUpdateForm(){
    if(this.data.movie){
      this.newMovieForm=this.fb.group({
        name:[{value:this.data.movie.name,disabled:true},Validators.required],
        director:[this.data.movie.director,Validators.required],
        popularity:[this.data.movie.popularity,[Validators.required,Validators.min(0),Validators.max(100)]],
        imdb_score:[this.data.movie.imdb_score,[Validators.required,Validators.min(0),Validators.max(10)]],
        // genre:[[],Validators.required],
      })
      this.genres=this.data.movie.genre
    }
  }

  setNewForm(){
    this.newMovieForm=this.fb.group({
      name:['',Validators.required],
      director:['',Validators.required],
      popularity:[0,[Validators.required,Validators.min(0),Validators.max(100)]],
      imdb_score:[0,[Validators.required,Validators.min(0),Validators.max(10)]],
      // genre:[[],Validators.required],
    })
  }

  genreList=[];
  onGetGenreList(){
    this.backendService.getGenreList().subscribe((res:any)=>{
      if(res.success){
        this.genreList=res.genres;
      }else{
        this.genreList=[];
      }
    })
  }

  onSubmit(form:NgForm){
    if(form.valid && this.genres.length>0){
      form.value.genre=this.genres
      console.log(form.value);
      if(this.data.movie){
        let updatedmovie = {
          id:this.data.movie._id,
          movie:form.value
        }
        this.updateMovie(updatedmovie);
      }else{
        let newMovie = {
          movie:form.value
        }
        this.addMovie(newMovie)
      }
    }
  }

  updateMovie(updatedMovie){
    this.backendService.updateMovie(updatedMovie).subscribe((res:any)=>{
      if(res.success){
        alert(res.message);
        this.onCloseDialog(updatedMovie);
      }else{
        alert(res.message)
      }
    })
    this.addUniqueGenre()
  }

  addMovie(newMovie){
    this.backendService.addMovie(newMovie).subscribe((res:any)=>{
      if(res.success){
        alert(res.message);
        this.onCloseDialog(this.addMovie);
      }else{
        alert(res.message)
      }
    })
    this.addUniqueGenre()
  }

  addUniqueGenre(){
    if(this.genres.length>0){
      this.genres.forEach((genre:string) => {
          if(!this.genreList.includes(genre)){
            this.backendService.addGenre({genre:genre.toLowerCase()}).subscribe(res=>{
              console.log('Genre '+genre+' added')
            })
          }
      });
    }  
  }

  onNumberInput(event,field,min,max){
    if(this.newMovieForm.get(field).value>max){
      event.preventDefault()
    }
  }

  // Chips Input
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  genres:any=[];

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add genre
    if ((value || '').trim()) {
      this.genres.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(genre): void {
    const index = this.genres.indexOf(genre);

    if (index >= 0) {
      this.genres.splice(index, 1);
    }
  }

  onCloseDialog(updatedMovie){
    this.dialogRef.close(updatedMovie);
  }


}
