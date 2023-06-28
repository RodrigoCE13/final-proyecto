import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TipoVehiculoService } from 'src/app/services/tipo-vehiculo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-create-tipo-vehiculo',
  templateUrl: './create-tipo-vehiculo.component.html',
  styleUrls: ['./create-tipo-vehiculo.component.css']
})
export class CreateTipoVehiculoComponent implements OnInit {
  createTipoVehiculo: FormGroup;
  submitted = false;
  id:string| null;
  titulo='Agregar ';

  constructor(
    private fb: FormBuilder,
    private _tipoVehiculoService: TipoVehiculoService,//<-- Agregamos el servicio (los servicios llevan el guion bajo)
    private router: Router,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.createTipoVehiculo = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
    });
    this.id=this.aRoute.snapshot.paramMap.get('id');
   }

  ngOnInit(): void {
    this.esEditar();
  }

  agregarEditar(){
    this.submitted = true;
    if(this.createTipoVehiculo.invalid){
      return
    }
    if(this.id==null){
      this.agregarTipoVehiculo();
    }else{
      this.editarTipoVehiculo(this.id);
    }
  }

  editarTipoVehiculo( id:string ){
    
    const tipoVehiculo:any={//<-- Creamos un objeto con los datos del formulario
      nombre: this.createTipoVehiculo.value.nombre,
      fechaActualizacion: new Date(),
    }
    this.spinner.show();
    
    this._tipoVehiculoService.actualizarTipoVehiculo(id, tipoVehiculo).then(()=>{
      this.spinner.hide();
      this.toastr.info('El tipo fue modificado con exito!', 'Tipo modificada',{positionClass: 'toast-top-right'});
      this.router.navigate(['/dashboard/tipo-vehiculos']);
    })
  }

  // agregarTipoVehiculo(){
  //   const nombreTipoVehiculo = this.createTipoVehiculo.value.nombre;
  //   const tipoVehiculo:any={
  //     nombre: nombreTipoVehiculo.toLowerCase().charAt(0).toUpperCase() + nombreTipoVehiculo.toLowerCase().slice(1),
  //     fechaCreacion: new Date(),
  //     fechaActualizacion: new Date(),
  //   }
  //   this.spinner.show();
  //   this._tipoVehiculoService.agregarTipoVehiculo(tipoVehiculo).then(()=>{
  //     console.log('Tipo creado con exito');
  //     this.toastr.success('El tipo fue registrada con exito!', 'Tipo registrada',{positionClass: 'toast-top-right'});
  //     this.spinner.hide();
  //     this.router.navigate(['/dashboard/tipo-vehiculos']);
  //   }).catch(error=>{
  //     console.log(error);
  //     this.spinner.hide();
  //   })
  // }
  agregarTipoVehiculo() {
    const nombreTipoVehiculo = this.createTipoVehiculo.value.nombre.toUpperCase();
    
    // Verificar si el nombre del tipo de vehículo ya existe
    this._tipoVehiculoService.verificarNombreTipoVehiculo(nombreTipoVehiculo).then((existe) => {
    if (existe) {
      //El tipo de vehículo ya existe, no se puede guardar
      this.toastr.error('El tipo de vehículo ya existe', 'Error', { positionClass: 'toast-top-right' });
      return;
    }else{
      //el tipo de vehículo existe, se puede guardar
      const tipoVehiculo: any = {
        nombre:  nombreTipoVehiculo.toLowerCase().charAt(0).toUpperCase() + nombreTipoVehiculo.toLowerCase().slice(1),
        fechaCreacion: new Date(),
        fechaActualizacion: new Date(),
      };
      this.spinner.show();
    
    this._tipoVehiculoService.agregarTipoVehiculo(tipoVehiculo).then(() => {
      console.log('Tipo creado con éxito');
      this.toastr.success('El tipo fue registrado con éxito!', 'Tipo registrado', { positionClass: 'toast-top-right' });
      this.spinner.hide();
      this.router.navigate(['/dashboard/tipo-vehiculos']);
    }).catch(error => {
      console.log(error);
      this.spinner.hide();
    });
  }
  });
}

  esEditar(){
    if(this.id !== null){
      this.titulo='Editar ';
      this.spinner.show();
      this._tipoVehiculoService.getTipoVehiculo(this.id).subscribe(data=>{
        this.spinner.hide();
        console.log(data.payload.data()['nombre']);
        this.createTipoVehiculo.setValue({
          nombre: data.payload.data()['nombre'],
        })
      })
    }
  }

}
