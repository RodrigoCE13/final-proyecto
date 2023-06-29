import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VehiculoService } from 'src/app/services/vehiculo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-create-vehiculo',
  templateUrl: './create-vehiculo.component.html',
  styleUrls: ['./create-vehiculo.component.css']
})
export class CreateVehiculoComponent implements OnInit {
  createVehiculo: FormGroup;
  submitted = false;
  id:string| null;
  titulo='Agregar ';
  marcas: any[] = [];
  tipos: any[] = [];

  constructor(
    private afAuth: AngularFireAuth,
    private fb: FormBuilder,
    private _vehiculoService: VehiculoService,//<-- Agregamos el servicio (los servicios llevan el guion bajo)
    private router: Router,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) { 
    this.createVehiculo = this.fb.group({
      patente: ['', Validators.required],
      modelo: ['', Validators.required],
      precio: [],
      annio:[],
      marca: ['', Validators.required],
      tipoVehiculo: ['', Validators.required],
      kilometraje: [],
    });
    this.id=this.aRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.toastr.info('Los campos que contengan * son obligatorios', 'Importante', { positionClass: 'toast-top-right' });
    this.esEditar();

    this._vehiculoService.getTipos().subscribe(data => {
      this.tipos = [];
      data.forEach((element: any) => {
        this.tipos.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        })
      });
    });

    this._vehiculoService.getMarcas().subscribe(data=>{
      this.marcas=[];
      data.forEach((element:any) => { 
        this.marcas.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        })
      });
    })
  }

  agregarEditar(){
    this.submitted = true;
    if(this.createVehiculo.invalid){
      return
    }
    if(this.id==null){
      this.agregarVehiculo();
    }else{
      this.editarVehiculo(this.id);
    }
    
  }
  // editarVehiculo(id: string) {
  //   const vehiculo: any = {
  //     patente: this.createVehiculo.value.patente,
  //     modelo: this.createVehiculo.value.modelo,
  //     precio: this.createVehiculo.value.precio,
  //     annio: this.createVehiculo.value.annio,
  //     marca: this.createVehiculo.value.marca,
  //     tipoVehiculo: this.createVehiculo.value.tipoVehiculo,
  //     kilometraje: this.createVehiculo.value.kilometraje,
  //     fechaActualizacion: new Date(),
  //   };
  
  //   this.spinner.show();
  
  //   this.afAuth.currentUser.then(user => {
  //     if (user) {
  //       vehiculo.userId = user.uid; // Agrega el ID del usuario al objeto vehiculo
  //     }
  
  //     this._vehiculoService.actualizarVehiculo(id, vehiculo).then(() => {
  //       this.spinner.hide();
  //       this.toastr.info('El vehiculo fue modificado con exito!', 'Vehiculo modificado', { positionClass: 'toast-top-right' });
  //       this.router.navigate(['/dashboard/vehiculos']);
  //     });
  //   });
  // }
  editarVehiculo(id: string) {
    let patente = this.createVehiculo.value.patente.toUpperCase();
    const nombreModelo = this.createVehiculo.value.modelo;
    if (!this.validarPatenteFormato(patente)) {
      // La patente no está en el formato deseado, se le dará formato
      patente = this.formatPatente(patente);
    }
    const vehiculo: any = {
      patente: patente,
      modelo: nombreModelo.toLowerCase().charAt(0).toUpperCase() + nombreModelo.toLowerCase().slice(1),
      precio: this.createVehiculo.value.precio,
      annio: this.createVehiculo.value.annio,
      marca: this.createVehiculo.value.marca,
      tipoVehiculo: this.createVehiculo.value.tipoVehiculo,
      kilometraje: this.createVehiculo.value.kilometraje,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    };
  
    const yearActual = new Date().getFullYear();
    const yearIngresado = parseInt(vehiculo.annio);
  
    if (yearIngresado > yearActual) {
              this.toastr.error('El año ingresado no puede ser mayor al actual'), { positionClass: 'toast-top-right' };
              return;
            }
    this.spinner.show();
    this.afAuth.currentUser.then((user) => {
      if (user) {
        vehiculo.userId = user.uid; // Agrega el ID del usuario al objeto vehiculo
      }
      // Verificar si la patente ya existe en la base de datos
      this._vehiculoService.verificarPatenteExistente(vehiculo.patente).then((existePatente) => {
        if (existePatente) {
          this.toastr.error('La patente ya está registrada', 'Error', { positionClass: 'toast-top-right' });
          this.spinner.hide();
        } else {
          // La patente no existe, se puede agregar el vehículo
          this._vehiculoService.actualizarVehiculo(id, vehiculo).then(() => {
            this.spinner.hide();
            this.toastr.info('El vehiculo fue modificado con exito!', 'Vehiculo modificado', { positionClass: 'toast-top-right' });
            this.router.navigate(['/dashboard/vehiculos']);
          }).catch(error => {
            console.log(error);
            this.spinner.hide();
          });
        }
      }).catch(error => {
        console.log(error);
        this.spinner.hide();
      });
    });
  }
  formatPatente(patente: string): string {
    const firstPart = patente.substring(0, 2);
    const secondPart = patente.substring(2, 4);
    const thirdPart = patente.substring(4, 6);
    return `${firstPart}-${secondPart}-${thirdPart}`;
  }
  validarPatenteFormato(patente: string): boolean {
    const pattern = /^[A-Z]{2}-[A-Z]{2}-\d{2}$/;
    return pattern.test(patente);
  }
  // agregarVehiculo() {
  //   let patente = this.createVehiculo.value.patente.toUpperCase();
  //   const nombreModelo = this.createVehiculo.value.modelo;
  //   if (!this.validarPatenteFormato(patente)) {
  //     // La patente no está en el formato deseado, se le dará formato
  //     patente = this.formatPatente(patente);
  //   }
  
  //   const vehiculo: any = {
  //     patente: patente,
  //     modelo: nombreModelo.toLowerCase().charAt(0).toUpperCase() + nombreModelo.toLowerCase().slice(1),
  //     precio: this.createVehiculo.value.precio,
  //     annio: this.createVehiculo.value.annio,
  //     marca: this.createVehiculo.value.marca,
  //     tipoVehiculo: this.createVehiculo.value.tipoVehiculo,
  //     kilometraje: this.createVehiculo.value.kilometraje,
  //     fechaCreacion: new Date(),
  //     fechaActualizacion: new Date(),
  //   };
  
  //   const yearActual = new Date().getFullYear();
  //   const yearIngresado = parseInt(vehiculo.annio);
  
  //   if (yearIngresado > yearActual) {
  //             this.toastr.error('El año ingresado no puede ser mayor al actual'), { positionClass: 'toast-top-right' };
  //             return;
  //           }
  
  //   this.spinner.show();
  
  //   this.afAuth.currentUser.then((user) => {
  //     if (user) {
  //       vehiculo.userId = user.uid; // Agrega el ID del usuario al objeto vehiculo
  //     }
  //     // Verificar si la patente ya existe en la base de datos
  //     this._vehiculoService.verificarPatenteExistente(vehiculo.patente).then((existePatente) => {
  //       if (existePatente) {
  //         this.toastr.error('La patente ya está registrada', 'Error', { positionClass: 'toast-top-right' });
  //         this.spinner.hide();
  //       } else {
  //         // La patente no existe, se puede agregar el vehículo
  //         this._vehiculoService.agregarVehiculo(vehiculo).then(() => {
  //           console.log('Vehiculo creado con éxito');
  //           this.toastr.success('El vehiculo fue registrado con éxito!', 'Vehiculo registrado', { positionClass: 'toast-top-right' });
  //           this.spinner.hide();
  //           this.router.navigate(['/dashboard/vehiculos']);
  //         }).catch(error => {
  //           console.log(error);
  //           this.spinner.hide();
  //         });
  //       }
  //     }).catch(error => {
  //       console.log(error);
  //       this.spinner.hide();
  //     });
  //   });
  // }
  agregarVehiculo() {
    let patente = this.createVehiculo.value.patente.toUpperCase();
    const nombreModelo = this.createVehiculo.value.modelo;
  
    if (!this.validarPatenteFormato(patente)) {
      // La patente no está en el formato deseado, se le dará formato
      patente = this.formatPatente(patente);
    }
  
    const vehiculo: any = {
      patente: patente,
      modelo: nombreModelo.toLowerCase().charAt(0).toUpperCase() + nombreModelo.toLowerCase().slice(1),
      precio: this.createVehiculo.value.precio,
      annio: this.createVehiculo.value.annio,
      marca: this.createVehiculo.value.marca,
      tipoVehiculo: this.createVehiculo.value.tipoVehiculo,
      kilometraje: this.createVehiculo.value.kilometraje,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    };
  
    const yearActual = new Date().getFullYear();
    const yearIngresado = parseInt(vehiculo.annio);
  
    if (yearIngresado > yearActual) {
      this.toastr.error('El año ingresado no puede ser mayor al actual'), { positionClass: 'toast-top-right' };
      return;
    }
  
    this.spinner.show();
  
    this.afAuth.currentUser.then((user) => {
      if (user) {
        vehiculo.userId = user.uid; // Agrega el ID del usuario al objeto vehiculo
      }
      this._vehiculoService.verificarPatenteExistente(vehiculo.patente).then((existePatente) => {
        if (existePatente) {
          this.toastr.error('La patente ya está registrada', 'Error', { positionClass: 'toast-top-right' });
          this.spinner.hide();
        } else {
          this._vehiculoService.agregarVehiculo(vehiculo).then(() => {
            console.log('Vehiculo creado con éxito');
            this.toastr.success('El vehiculo fue registrado con éxito!', 'Vehiculo registrado', { positionClass: 'toast-top-right' });
            this.spinner.hide();
            this.router.navigate(['/dashboard/vehiculos']);
          }).catch(error => {
            console.log(error);
            this.spinner.hide();
          });
        }
      }).catch(error => {
        console.log(error);
        this.spinner.hide();
      });
    });
  }
  
  esEditar(){
    if(this.id !== null){
      this.titulo='Editar ';
      this.spinner.show();
      this._vehiculoService.getVehiculo(this.id).subscribe(data=>{
        this.spinner.hide();
        console.log(data.payload.data()['patente']);
        this.createVehiculo.setValue({
          patente: data.payload.data()['patente'],
          modelo: data.payload.data()['modelo'],
          precio: data.payload.data()['precio'],
          annio: data.payload.data()['annio'],
          marca: data.payload.data()['marca'],
          tipoVehiculo: data.payload.data()['tipoVehiculo'],
          kilometraje: data.payload.data()['kilometraje'],
        })
      })
    }
  }
}
