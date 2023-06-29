import { Injectable } from '@angular/core';
import { AngularFirestore,QueryFn } from '@angular/fire/compat/firestore';
import { Observable, filter,take, switchMap } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class MecanicoService {

  constructor(
    private firestore:AngularFirestore, 
    private afAuth:AngularFireAuth
  ) { }
  agregarMecanico(mecanico:any): Promise<any>{
    return this.firestore.collection('mecanicos').add(mecanico);//<-- agregamos un mecanico a la coleccion mecanicos de la base de datos
  }

  getMecanicos(): Observable<any>{
    return this.afAuth.authState.pipe(
      filter(user=>!!user),
      take(1),
      switchMap(user=>{
        const uid=user?.uid;
        const queryFn:QueryFn=ref=>ref
        .where('userId','==',uid)
        .orderBy('fechaCreacion','asc');
        return this.firestore.collection('mecanicos',queryFn).snapshotChanges();
      })
    )
  }

  eliminarMecanico(id:string):Promise<any>{
    return this.firestore.collection('mecanicos').doc(id).delete();//<-- Eliminamos un mecanico de la coleccion mecanicos de la base de datos 
  }
  //editar
  getMecanico(id:string):Observable<any>{
    return this.firestore.collection('mecanicos').doc(id).snapshotChanges();//<-- Obtenemos un mecanico de la coleccion mecanicos de la base de datos
  }
  actualizarMecanico(id:string, data:any):Promise<any>{
    return this.firestore.collection('mecanicos').doc(id).update(data);//<-- Actualizamos un mecanico de la coleccion mecanicos de la base de datos
  }
  verificarNumeroMecanico(fono: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const queryFn: QueryFn = ref => ref
        .where('fono', '==', fono)
        .limit(1);
      
      this.firestore.collection('mecanicos', queryFn).valueChanges({ idField: 'id' }).pipe(take(1)).subscribe(
        (mecanicos) => {
          if (mecanicos && mecanicos.length > 0) {
            // Se encontró al menos un mecánico con el mismo fono
            resolve(true);
          } else {
            // No se encontraron mecánicos con el mismo fono
            resolve(false);
          }
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  }
  
  
}
