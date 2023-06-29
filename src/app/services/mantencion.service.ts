import { Injectable } from '@angular/core';
import { AngularFirestore,QueryFn,DocumentChangeAction  } from '@angular/fire/compat/firestore';
import { Observable, filter,take, switchMap } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MantencionService {

  constructor(
    private firestore:AngularFirestore, 
    private afAuth:AngularFireAuth
  ) { }
  
  //agregar
  agregarMantencion(mantencion:any): Promise<any>{
    return this.firestore.collection('mantencion').add(mantencion);
  }
  //fk
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
  getTipoLegal(): Observable<any>{
    return this.firestore.collection('tipoMantencionLegal').snapshotChanges(); 
  }
  getTipoPrev(): Observable<any>{
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
  getMarcas(): Observable<any>{
    return this.firestore.collection('marcas').snapshotChanges(); 
  }
  //obtener
  getMantenciones(): Observable<any>{
    return this.afAuth.authState.pipe(
      filter(user=>!!user),
      take(1),
      switchMap(user=>{
        const uid=user?.uid;
        const queryFn:QueryFn=ref=>ref
        .where('userId','==',uid)
        .orderBy('fechaCreacion','asc');
        return this.firestore.collection('mantencion',queryFn).snapshotChanges();
      })
    )
  }
    //eliminar
    eliminarMantencion(id:string):Promise<any>{
      return this.firestore.collection('mantencion').doc(id).delete();
    }
  
    //editar
    getMantencion(id:string):Observable<any>{
      return this.firestore.collection('mantencion').doc(id).snapshotChanges();
    }
    actualizarMantencion(id:string, data:any):Promise<any>{
      return this.firestore.collection('mantencion').doc(id).update(data);
    }
    //traer solo mantenciones que tengan fechaProxMantencion
  
  
    getMantencionesByFechaProx(): Observable<any> {
      return this.afAuth.authState.pipe(
        filter(user => !!user),
        take(1),
        switchMap(user => {
          const uid = user?.uid;
          const queryFn: QueryFn = ref => ref
            .where('fechaProxMantencion', '!=', null)
            .where('userId', '==', uid)
            .orderBy('fechaProxMantencion', 'asc');
          
          return this.firestore.collection('mantencion', queryFn).snapshotChanges();
        })
      );
    }

    getMantencionesByVehiculo(vehiculoId: string): Observable<any> {
      return this.afAuth.authState.pipe(
        filter(user => !!user),
        take(1),
        switchMap(user => {
          const uid = user?.uid;
          const queryFn: QueryFn = ref => ref
            .where('vehiculo', '==', vehiculoId)
            .where('userId', '==', uid)
            .orderBy('fechaCreacion', 'asc');
    
          return this.firestore.collection('mantencion', queryFn).snapshotChanges();
        })
      );
    }

    verificarMantencionesAsociadas(vehiculoId: string): Promise<boolean> {
      const queryFn: QueryFn<any> = ref => ref.where('vehiculo', '==', vehiculoId).limit(1);
    
      return new Promise<boolean>((resolve, reject) => {
        this.firestore.collection('mantencion', queryFn)
          .valueChanges()
          .pipe(
            take(1),
            map((mantenciones: any[]) => {
              return mantenciones.length > 0;
            })
          )
          .subscribe(
            (result: boolean) => {
              resolve(result);
            },
            (error: any) => {
              reject(error);
            }
          );
      });
    }
    verificarTipoAsociadas(tipoId: string): Promise<boolean> {
      const queryFn: QueryFn<any> = ref => ref.where('tipoMantencionPreventiva', '==', tipoId).limit(1);
    
      return new Promise<boolean>((resolve, reject) => {
        this.firestore.collection('mantencion', queryFn)
          .valueChanges()
          .pipe(
            take(1),
            map((mantenciones: any[]) => {
              return mantenciones.length > 0;
            })
          )
          .subscribe(
            (result: boolean) => {
              resolve(result);
            },
            (error: any) => {
              reject(error);
            }
          );
      });
    }
    verificarMecanicoAsociadas(mecanicoId: string): Promise<boolean> {
      const queryFn: QueryFn<any> = ref => ref.where('mecanico', '==', mecanicoId).limit(1);
    
      return new Promise<boolean>((resolve, reject) => {
        this.firestore.collection('mantencion', queryFn)
          .valueChanges()
          .pipe(
            take(1),
            map((mantenciones: any[]) => {
              return mantenciones.length > 0;
            })
          )
          .subscribe(
            (result: boolean) => {
              resolve(result);
            },
            (error: any) => {
              reject(error);
            }
          );
      });
    }
    
}
