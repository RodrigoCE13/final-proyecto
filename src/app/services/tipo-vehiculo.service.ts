import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoVehiculoService {

  constructor(private firestore:AngularFirestore) { }

  //agregar
  agregarTipoVehiculo(tipoVehiculo:any): Promise<any>{
    return this.firestore.collection('tipoVehiculo').add(tipoVehiculo);
  }
  //obtener
  getTipoVehiculos(): Observable<any>{
    return this.firestore.collection('tipoVehiculo',ref => ref.orderBy('fechaCreacion','asc')).snapshotChanges(); 
  }
  //eliminar
  eliminarTipoVehiculo(id:string):Promise<any>{
    return this.firestore.collection('tipoVehiculo').doc(id).delete();
  }

  //editar
  getTipoVehiculo(id:string):Observable<any>{
    return this.firestore.collection('tipoVehiculo').doc(id).snapshotChanges();
  }
  actualizarTipoVehiculo(id:string, data:any):Promise<any>{
    return this.firestore.collection('tipoVehiculo').doc(id).update(data);
  }
  verificarNombreTipoVehiculo(nombre:string):Promise<boolean> {
    const nombreTipoVehiculo = nombre.toLowerCase().charAt(0).toUpperCase() + nombre.toLowerCase().slice(1);
    return new Promise<boolean>((resolve, reject) => {
      //const nombreUpperCase = nombre.toUpperCase();
      this.firestore
        .collection('tipoVehiculo', (ref) => ref.where('nombre', '==', nombreTipoVehiculo))
        .get()
        .toPromise()
        .then((snapshot) => {
          if (snapshot && snapshot.empty) {
            // No se encontraron tipos de vehículo con el mismo nombre
            resolve(false);
          } else {
            // Se encontró al menos uno con el mismo nombre
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
