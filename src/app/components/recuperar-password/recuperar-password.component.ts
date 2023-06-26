import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FirebaseCodeErrorService } from 'src/app/services/firebase-code-error.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperar-password',
  templateUrl: './recuperar-password.component.html',
  styleUrls: ['./recuperar-password.component.css']
})
export class RecuperarPasswordComponent implements OnInit {
  recuperarUsuario: FormGroup;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth, 
    private toastr: ToastrService,
    private router: Router,
    private firebaseError: FirebaseCodeErrorService
  ) {
    this.recuperarUsuario = this.fb.group({
      email: ['',[Validators.required, Validators.email]]

     });
   }

  ngOnInit(): void {
  }
  recuperar(){
    this.loading = true;
    const email =this.recuperarUsuario.value.email;
    this.afAuth.sendPasswordResetEmail(email).then(()=>{
      this.loading = false;
      this.toastr.info('Se ha enviado un correo para restablecer la contraseña');
      this.router.navigate(['/login']);
    }).catch(error=>{
      this.loading = false;
      this.toastr.error(this.firebaseError.codeError(error.code));
    })
  }

}
