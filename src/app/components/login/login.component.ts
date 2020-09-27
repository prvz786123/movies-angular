import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { BackendService } from '../../services/backend.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: String = ""
  password: String = ""
  constructor(
    private backendService:BackendService,
    private router:Router
  ) { }

  ngOnInit() {
  }

  onSubmit() {
    console.log('login')
    if(this.username && this.password){
      console.log(this.username,this.password)
      this.backendService.login({username:this.username,password:this.password}).subscribe((res:any)=>{
        if(res.success){
          this.setStorage(res.user);
          this.router.navigate(['/'])
        }else{
          alert('invalid credentials')
        }
      })
    }
  }

  setStorage(user){
    localStorage.setItem('name',user.name);
    localStorage.setItem('username',user.username);
    localStorage.setItem('token',user.token);
  }

}
