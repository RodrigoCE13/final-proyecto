import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MecanicoService } from 'src/app/services/mecanico.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-create-mecanico',
  templateUrl: './create-mecanico.component.html',
  styleUrls: ['./create-mecanico.component.css']
})
export class CreateMecanicoComponent implements OnInit {
  createMecanico: FormGroup;
  submitted = false;
  id:string| null;//<-- Variable para almacenar el id del mecanico
  titulo='Agregar ';
  tipo:string[]=['Interno','Externo','Taller'];

  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private _mecanicoService: MecanicoService,//<-- Agregamos el servicio (los servicios llevan el guion bajo)
    private router: Router,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute,//<-- Agregamos el modulo ActivatedRoute para obtener el id del mecanico
    private spinner: NgxSpinnerService
  ) {
    this.createMecanico = this.fb.group({
      nombre: ['', [Validators.required,Validators.maxLength(50)]],
      fono: [],
      direccion: ['',Validators.maxLength(50)],
      tipoMecanico:['', Validators.required],
    });
    this.id=this.aRoute.snapshot.paramMap.get('id');//<-- Obtenemos el id del mecanico que viene por la url
   }

  ngOnInit(): void {
    this.toastr.info('Los campos que contengan * son obligatorios', 'Importante', { positionClass: 'toast-top-right' });
    this.esEditar();
  }

  agregarEditar(){//<-- Metodo para agregar un mecanico
    this.submitted = true;
    if(this.createMecanico.invalid){//<-- Si el formulario es invalido no hacemos nada
      return
    }
    if(this.id==null){
      this.agregarMecanico();
    }else{
      this.editarMecanico(this.id);
    }
  }

  // editarMecanico( id:string ){
    
  //   const mecanico:any={//<-- Creamos un objeto con los datos del formulario
  //     nombre: this.createMecanico.value.nombre,
  //     fono: this.createMecanico.value.fono,
  //     direccion: this.createMecanico.value.direccion,
  //     tipoMecanico: this.createMecanico.value.tipoMecanico,
  //     fechaActualizacion: new Date(),
  //   }
  //   this.spinner.show();
  //   this.afAuth.currentUser.then(user=>{
  //     if(user){
  //       mecanico.userId=user.uid;
  //     }

  //     this._mecanicoService.actualizarMecanico(id, mecanico).then(()=>{
  //       this.spinner.hide();
  //      this.toastr.info('El mecanico fue modificado con exito!', 'Mecanico modificado',{positionClass: 'toast-top-right'});
  //      this.router.navigate(['/dashboard/mecanicos']);
  //     })
  //   })
  // }
  editarMecanico(id: string) {
    const mecanico: any = {
      nombre: this.createMecanico.value.nombre,
      fono: this.createMecanico.value.fono,
      direccion: this.createMecanico.value.direccion,
      tipoMecanico: this.createMecanico.value.tipoMecanico,
      fechaActualizacion: new Date(),
    };
  
    this.spinner.show();
    this.afAuth.currentUser.then(user => {
      if (user) {
        mecanico.userId = user.uid;
      }
  
      // Verificar si el número de teléfono ya existe en otro mecánico
      this._mecanicoService.verificarNumeroMecanico(mecanico.fono).then(existeTelefono => {
        if (existeTelefono) {
          this.spinner.hide();
          this.toastr.error('El número de teléfono ya está registrado en otro mecánico.', 'Error');
        } else {
          this._mecanicoService.actualizarMecanico(id, mecanico).then(() => {
            this.spinner.hide();
            this.toastr.info('El mecánico fue modificado con éxito!', 'Mecánico modificado', { positionClass: 'toast-top-right' });
            this.router.navigate(['/dashboard/mecanicos']);
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
  
  agregarMecanico() {
    const mecanico: any = {
      nombre: this.createMecanico.value.nombre,
      fono: this.createMecanico.value.fono,
      direccion: this.createMecanico.value.direccion,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
      tipoMecanico: this.createMecanico.value.tipoMecanico,
    };
    this.spinner.show();
    this.afAuth.currentUser.then(user => {
      if (user) {
        mecanico.userId = user.uid;
      }
      // Verificar si el número de teléfono ya existe
      this._mecanicoService.verificarNumeroMecanico(mecanico.fono).then(existeTelefono => {
        if (existeTelefono) {
          this.spinner.hide();
          this.toastr.error('El número de teléfono ya está registrado.', 'Error');
        } else {
          this._mecanicoService.agregarMecanico(mecanico).then(() => {
            console.log('Mecanico creado con éxito');
            this.toastr.success('El mecánico fue registrado con éxito!', 'Mecánico registrado', { positionClass: 'toast-top-right' });
            this.spinner.hide();
            this.router.navigate(['/dashboard/mecanicos']);
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
      this._mecanicoService.getMecanico(this.id).subscribe(data=>{
        this.spinner.hide();
        console.log(data.payload.data()['nombre']);
        this.createMecanico.setValue({
          nombre: data.payload.data()['nombre'],
          fono: data.payload.data()['fono'],
          direccion: data.payload.data()['direccion'],
          tipoMecanico: data.payload.data()['tipoMecanico'],
        })
      })
    }
  }
}
