import { Injectable } from '@angular/core';
import { AngularFirestore,QueryFn } from '@angular/fire/compat/firestore';
import { Observable, filter,take, switchMap } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class TipoMantencionService {

  constructor(
    private firestore:AngularFirestore, 
    private afAuth:AngularFireAuth
  ) { }
   //agregar
   agregarTipoMantencion(tipoMantencionPreventiva:any): Promise<any>{
    return this.firestore.collection('tipoMantencionPreventiva').add(tipoMantencionPreventiva);
  }

  getTipoMantenciones(): Observable<any>{
    return this.afAuth.authState.pipe(
      filter(user=>!!user),
      take(1),
      switchMap(user=>{
        const uid=user?.uid;
        const queryFn:QueryFn=ref=>ref
        .where('userId','==',uid)
        .orderBy('fechaCreacion','asc');
        return this.firestore.collection('tipoMantencionPreventiva',queryFn).snapshotChanges();
      })
    )
  }
  // getTipoMantenciones(): Observable<any>{
  //   return this.firestore.collection('tipoMantencionPreventiva',ref => ref.orderBy('fechaCreacion','asc')).snapshotChanges(); 
  //  }

  //eliminar
  eliminarTipoMantencion(id:string):Promise<any>{
    return this.firestore.collection('tipoMantencionPreventiva').doc(id).delete();
  }

  //editar
  getTipoMantencion(id:string):Observable<any>{
    return this.firestore.collection('tipoMantencionPreventiva').doc(id).snapshotChanges();
  }
  actualizarTipoMantencion(id:string, data:any):Promise<any>{
    return this.firestore.collection('tipoMantencionPreventiva').doc(id).update(data);
  }
  // verificarNombreTipoMantencion(nombre:string):Promise<boolean> {
  //   const nombreTipoMantencion = nombre.toLowerCase().charAt(0).toUpperCase() + nombre.toLowerCase().slice(1);
  //   return new Promise<boolean>((resolve, reject) => {
  //     this.firestore
  //       .collection('tipoMantencionPreventiva', (ref) => ref.where('nombre', '==', nombreTipoMantencion))
  //       .get()
  //       .toPromise()
  //       .then((snapshot) => {
  //         if (snapshot && snapshot.empty) {
  //           // No se encontraron tipos de mantención con el mismo nombre
  //           resolve(false);
  //         } else {
  //           // Se encontró al menos una con el mismo nombre
  //           resolve(true);
  //         }
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //         reject(error);
  //       });
  //   });
  // }
  verificarNombreTipoMantencion(nombre:string):Promise<boolean> {
    const nombreTipoMantencion = nombre.toLowerCase().charAt(0).toUpperCase() + nombre.toLowerCase().slice(1);
  
    return new Promise<boolean>((resolve, reject) => {
      this.firestore
        .collection('tipoMantencionPreventiva', (ref) => ref.where('nombre', '==', nombreTipoMantencion))
        .get()
        .toPromise()
        .then((snapshot) => {
          if (snapshot && snapshot.empty) {
            // No se encontraron tipos de mantención con el mismo nombre
            resolve(false);
          } else {
            // Se encontró al menos una con el mismo nombre
            resolve(true);
          }
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  }
}
