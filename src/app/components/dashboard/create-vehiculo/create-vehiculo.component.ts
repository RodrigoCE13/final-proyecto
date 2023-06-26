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
    this.toastr.info('Los campos que contengan * son obligatorios', 'Importante', { positionClass: 'toast-bottom-right' });
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
  editarVehiculo(id: string) {
    const vehiculo: any = {
      patente: this.createVehiculo.value.patente,
      modelo: this.createVehiculo.value.modelo,
      precio: this.createVehiculo.value.precio,
      annio: this.createVehiculo.value.annio,
      marca: this.createVehiculo.value.marca,
      tipoVehiculo: this.createVehiculo.value.tipoVehiculo,
      kilometraje: this.createVehiculo.value.kilometraje,
      fechaActualizacion: new Date(),
    };
  
    this.spinner.show();
  
    this.afAuth.currentUser.then(user => {
      if (user) {
        vehiculo.userId = user.uid; // Agrega el ID del usuario al objeto vehiculo
      }
  
      this._vehiculoService.actualizarVehiculo(id, vehiculo).then(() => {
        this.spinner.hide();
        this.toastr.info('El vehiculo fue modificado con exito!', 'Vehiculo modificado', { positionClass: 'toast-bottom-right' });
        this.router.navigate(['/dashboard/vehiculos']);
      });
    });
  }

  agregarVehiculo() {
    const vehiculo: any = {
      patente: this.createVehiculo.value.patente,
      modelo: this.createVehiculo.value.modelo,
      precio: this.createVehiculo.value.precio,
      annio: this.createVehiculo.value.annio,
      marca: this.createVehiculo.value.marca,
      tipoVehiculo: this.createVehiculo.value.tipoVehiculo,
      kilometraje: this.createVehiculo.value.kilometraje,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    };
  
    const yearActual = new Date().getFullYear();
    const yearIngresado = parseInt(vehiculo.año);
  
    if (yearIngresado > yearActual) {
      console.log('El año ingresado no puede ser mayor al año actual')
      this.toastr.error('El año ingresado no puede ser mayor al actual'), { positionClass: 'toast-bottom-right' };
      return;
    }
  
    this.spinner.show();
  
    this.afAuth.currentUser.then((user) => {
      if (user) {
        vehiculo.userId = user.uid; // Agrega el ID del usuario al objeto vehiculo
      }
  
      this._vehiculoService.agregarVehiculo(vehiculo).then(() => {
        console.log('Vehiculo creado con exito');
        this.toastr.success('El vehiculo fue registrado con exito!', 'Vehiculo registrado', { positionClass: 'toast-bottom-right' });
        this.spinner.hide();
        this.router.navigate(['/dashboard/vehiculos']);
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
