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
}
