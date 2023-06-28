import { Injectable } from '@angular/core';
import { AngularFirestore, QueryFn } from '@angular/fire/compat/firestore';
import { Observable, filter, take, switchMap } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class MarcaService {

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth
  ) { }

  agregarMarca(marca: any): Promise<any> {
    return this.firestore.collection('marcas').add(marca);
  }
  getMarcas(): Observable<any>{
   return this.firestore.collection('marcas',ref => ref.orderBy('fechaCreacion','asc')).snapshotChanges(); 
  }
  eliminarMarca(id: string): Promise<any> {
    return this.firestore.collection('marcas').doc(id).delete();
  }
  //editar
  getMarca(id: string): Observable<any> {
    return this.firestore.collection('marcas').doc(id).snapshotChanges();
  }
  actualizarMarca(id: string, data: any): Promise<any> {
    return this.firestore.collection('marcas').doc(id).update(data);
  }
  // 
  verificarExistenciaMarca(nombre: string): Promise<boolean> {
    const nombreMarca = nombre.toLowerCase().charAt(0).toUpperCase() + nombre.toLowerCase().slice(1);
  
    return new Promise<boolean>((resolve, reject) => {
      this.afAuth.authState.pipe(
        filter(user => !!user),
        take(1),
        switchMap(user => {
          const uid = user?.uid;
          const queryFn: QueryFn = ref => ref
            .where('userId', '==', uid)
            .where('nombre', '==', nombreMarca);
          return this.firestore.collection('marcas', queryFn).valueChanges({ idField: 'id' }).pipe(take(1));
        })
      ).toPromise()
      .then((marcas) => {
        if (marcas && marcas.length > 0) {
          // Se encontró al menos una marca con el mismo nombre
          resolve(true);
        } else {
          // No se encontraron marcas con el mismo nombre
          resolve(false);
        }
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
    });
  }
  
}
