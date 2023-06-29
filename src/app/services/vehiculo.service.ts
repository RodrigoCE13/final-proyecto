import { Injectable } from '@angular/core';
import { AngularFirestore, QueryFn } from '@angular/fire/compat/firestore';
import { Observable, filter,take, switchMap } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {

  constructor(
    private firestore:AngularFirestore, 
    private afAuth:AngularFireAuth
  ) { }

    //agregar
    agregarVehiculo(vehiculo:any): Promise<any>{
      return this.firestore.collection('vehiculo').add(vehiculo);
    }
    //obtener
    getVehiculos(): Observable<any>{
      return this.afAuth.authState.pipe(
        filter(user=>!!user),
        take(1),
        switchMap(user=>{
          const uid=user?.uid;
          const queryFn:QueryFn=ref=>ref
          .where('userId','==',uid)
          .orderBy('fechaCreacion','asc');
          return this.firestore.collection('vehiculo',queryFn).snapshotChanges();
        })
      )
    }
  //fk
  getMarcas(): Observable<any>{
    return this.firestore.collection('marcas').snapshotChanges();
  }
  getTipos(): Observable<any>{
    return this.firestore.collection('tipoVehiculo').snapshotChanges(); 
  }
  //eliminar
  eliminarVehiculo(id:string):Promise<any>{
    return this.firestore.collection('vehiculo').doc(id).delete();
  }
  //editar
  getVehiculo(id:string):Observable<any>{
    return this.firestore.collection('vehiculo').doc(id).snapshotChanges();
  }
  actualizarVehiculo(id:string, data:any):Promise<any>{
    return this.firestore.collection('vehiculo').doc(id).update(data);
  }
  verificarPatenteExistente(patente: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const nombreUpperCase = patente.toUpperCase();
      this.firestore
        .collection('vehiculo', (ref) => ref.where('patente', '==', nombreUpperCase))
        .get()
        .toPromise()
        .then((snapshot) => {
          if (snapshot && snapshot.empty) {
            // No se encontraron patentes con el mismo nombre
            resolve(false);
          } else {
            // Se encontró al menos una patente con el mismo nombre
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
