import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MarcaService } from 'src/app/services/marca.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-create-marca',
  templateUrl: './create-marca.component.html',
  styleUrls: ['./create-marca.component.css']
})
export class CreateMarcaComponent implements OnInit {
  createMarca: FormGroup;
  submitted = false;
  id:string| null;
  titulo='Agregar ';

  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private _marcaService: MarcaService,//<-- Agregamos el servicio (los servicios llevan el guion bajo)
    private router: Router,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) { 
    this.createMarca = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
    });
    this.id=this.aRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.toastr.info('Los campos que contengan * son obligatorios', 'Importante', { positionClass: 'toast-top-right' });
    this.esEditar();
  }
  agregarEditar(){
    this.submitted = true;
    if(this.createMarca.invalid){
      return
    }
    if(this.id==null){
      this.agregarMarca();
    }else{
      this.editarMarca(this.id);
    }
  }

  // 
  editarMarca( id:string ){
    // Realizar la validación
    const nombreMarca = this.createMarca.value.nombre;
    
    this._marcaService.verificarExistenciaMarca(nombreMarca).then((existe) => {
      if (existe) {
        // La marca ya existe
        this.toastr.error('Ya existe una marca con ese nombre', 'Error', { positionClass: 'toast-top-right' });
      } else {
        // La marca no existe, se puede guardar
        const marca: any = {
          nombre: nombreMarca.toLowerCase().charAt(0).toUpperCase() + nombreMarca.toLowerCase().slice(1),
          fechaCreacion: new Date(),
          fechaActualizacion: new Date(),
        };
        this.spinner.show();
        this.afAuth.currentUser.then((user) => {
          if (user) {
            marca.userId = user.uid;
          }
          this._marcaService.actualizarMarca(id, marca).then(()=>{
            this.spinner.hide();
            this.toastr.info('La marca fue modificada con exito!', 'Marca modificada',{positionClass: 'toast-top-right'});
            this.router.navigate(['/dashboard/marcas']);
          }).catch((error) => {
            console.log(error);
            this.spinner.hide();
          });
        });
      }
    }).catch((error) => {
      console.log(error);
    });
  }
    agregarMarca() {
      // Realizar la validación
      const nombreMarca = this.createMarca.value.nombre;
      this._marcaService.verificarExistenciaMarca(nombreMarca).then((existe) => {
        if (existe) {
          // La marca ya existe
          this.toastr.error('Ya existe una marca con ese nombre', 'Error', { positionClass: 'toast-top-right' });
        } else {
          // La marca no existe, se puede guardar
          const marca: any = {
            nombre: nombreMarca.toLowerCase().charAt(0).toUpperCase() + nombreMarca.toLowerCase().slice(1),
            fechaCreacion: new Date(),
            fechaActualizacion: new Date(),
          };
          this.spinner.show();
          this.afAuth.currentUser.then((user) => {
            if (user) {
              marca.userId = user.uid;
            }
            this._marcaService.agregarMarca(marca).then(() => {
              this.toastr.success('La marca fue registrada con éxito!', 'Marca registrada', {
                positionClass: 'toast-top-right',
              });
              this.spinner.hide();
              this.router.navigate(['/dashboard/marcas']);
            }).catch((error) => {
              console.log(error);
              this.spinner.hide();
            });
          });
        }
      }).catch((error) => {
        console.log(error);
      });
    }
  esEditar(){
    if(this.id !== null){
      this.titulo='Editar ';
      this.spinner.show();
      this._marcaService.getMarca(this.id).subscribe(data=>{
        this.spinner.hide();
        console.log(data.payload.data()['nombre']);
        this.createMarca.setValue({
          nombre: data.payload.data()['nombre'],
        })
      })
    }
  }
}
