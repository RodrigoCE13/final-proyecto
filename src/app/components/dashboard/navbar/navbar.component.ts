import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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

  logout() {
    Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas cerrar sesión?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            this.afAuth.signOut().then(() => {
                this.router.navigate(['/login']);
            });
        }
    });
}
}
