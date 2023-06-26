import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TipoMantencionService } from 'src/app/services/tipo-mantencion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-create-tipo-mantencion',
  templateUrl: './create-tipo-mantencion.component.html',
  styleUrls: ['./create-tipo-mantencion.component.css']
})
export class CreateTipoMantencionComponent implements OnInit {
  createTipoMantencion: FormGroup;
  submitted = false;
  id:string| null;
  titulo='Agregar ';

  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private _tipoMantencionService: TipoMantencionService,//<-- Agregamos el servicio (los servicios llevan el guion bajo)
    private router: Router,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) { 
    this.createTipoMantencion = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
    });
    this.id=this.aRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.toastr.info('Los campos que contengan * son obligatorios', 'Importante', { positionClass: 'toast-bottom-right' });
    this.esEditar();
  }
  agregarEditar(){
    this.submitted = true;
    if(this.createTipoMantencion.invalid){
      return
    }
    if(this.id==null){
      this.agregarTipoMantencion();
    }else{
      this.editarTipoMantencion(this.id);
    }
  }
  editarTipoMantencion( id:string ){
    
    const tipoMantencion:any={//<-- Creamos un objeto con los datos del formulario
      nombre: this.createTipoMantencion.value.nombre,
      fechaActualizacion: new Date(),
    }
    this.spinner.show();
    
    this.afAuth.currentUser.then(user => {
      if (user) {
        tipoMantencion.userId = user.uid; // Agrega el ID del usuario al objeto vehiculo
      }

    this._tipoMantencionService.actualizarTipoMantencion(id, tipoMantencion).then(()=>{
      this.spinner.hide();
      this.toastr.info('El tipo fue modificado con exito!', 'Tipo modificada',{positionClass: 'toast-bottom-right'});
      this.router.navigate(['/dashboard/tipo-mantenciones']);
    })
  })
  }

  agregarTipoMantencion(){
    const tipoMantencion:any={
      nombre: this.createTipoMantencion.value.nombre,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    }
    this.spinner.show();
    this.afAuth.currentUser.then(user => {
      if (user) {
        tipoMantencion.userId = user.uid; // Agrega el ID del usuario al objeto vehiculo
      }
    this._tipoMantencionService.agregarTipoMantencion(tipoMantencion).then(()=>{
      console.log('Tipo creado con exito');
      this.toastr.success('El tipo fue registrada con exito!', 'Tipo registrada',{positionClass: 'toast-bottom-right'});
      this.spinner.hide();
      this.router.navigate(['/dashboard/tipo-mantenciones']);
    }).catch(error=>{
      console.log(error);
      this.spinner.hide();
    })
  })
  }

  esEditar(){
    if(this.id !== null){
      this.titulo='Editar ';
      this.spinner.show();
      this._tipoMantencionService.getTipoMantencion(this.id).subscribe(data=>{
        this.spinner.hide();
        console.log(data.payload.data()['nombre']);
        this.createTipoMantencion.setValue({
          nombre: data.payload.data()['nombre'],
        })
      })
    }
  }

}
