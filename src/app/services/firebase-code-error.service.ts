import { Injectable } from '@angular/core';
import { FirebaseCodeErrorEnum } from '../components/utils/firebase-code-error';

@Injectable({
  providedIn: 'root'
})
export class FirebaseCodeErrorService {

  constructor() { }
  codeError(code:string){
    switch(code){

      //Errores de autenticacion
      case FirebaseCodeErrorEnum.EmailAlreadyInUse://<-- El correo ya esta en uso
        return'El correo ya esta en uso';
      case FirebaseCodeErrorEnum.InvalidEmail://<-- El correo no es valido
        return 'El correo no es valido';
      case FirebaseCodeErrorEnum.WeakPassword://<-- La contraseña es muy debil
        return 'La contraseña es muy debil';
      //Errores de inicio de sesion
      case FirebaseCodeErrorEnum.WrongPassword://<-- La contraseña es incorrecta
        return 'La contraseña es incorrecta';
      case FirebaseCodeErrorEnum.UserNotFound://<-- El usuario no existe
        return 'El usuario no existe';
      //Errores de base de datos
      default:
        return 'Error desconocido';
    }
  }
}
