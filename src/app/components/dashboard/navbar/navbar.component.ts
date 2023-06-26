import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  userEmail: string='';
  isCollapsed : boolean = true;
  
  constructor(
    private afAuth: AngularFireAuth,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        const emailParts = user.email?.split('@');
        this.userEmail = emailParts?.shift()??'';
      } else {
        this.userEmail = '';
      }
    });
  }

  logout(){
    this.afAuth.signOut().then(()=>this.router.navigate(['/login']));//<-- Cerramos sesion y redireccionamos al login
  }
}
