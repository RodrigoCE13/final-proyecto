import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FirebaseCodeErrorService } from 'src/app/services/firebase-code-error.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  loading:boolean = false;

  constructor(
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private router: Router,
    private toastr: ToastrService,
    private afAuth: AngularFireAuth,
    private firebaseError: FirebaseCodeErrorService) {
    this.form = this.fb.group({
      email: ['',[Validators.required,Validators.email]],
      password: ['',Validators.required]
    });
   }

  ngOnInit(): void {
  }

  login(){
    const email = this.form.value.email;
    const password = this.form.value.password;

    this.loading = true;
    this.afAuth.signInWithEmailAndPassword(email,password).then((user)=>{
      if(user.user?.emailVerified){
        this.router.navigate(['/dashboard']);
        this.toastr.success('Bienvenido','',{
          positionClass: 'toast-top-right'
        });
        return;
      }else{
        this.mensaje();
        this.loading = false;
      }
    }).catch((error)=>{
      this.loading = false;
      this.toastr.error(this.firebaseError.codeError(error.code),'',{
        positionClass: 'toast-top-right'
      });
    })
  }

  mensaje(){
    this._snackBar.open('Hemos enviado un correo para verificar tu cuenta','aceptar',{
      duration: 10000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
}
