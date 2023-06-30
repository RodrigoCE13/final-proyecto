import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MantencionService } from 'src/app/services/mantencion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-mantencion',
  templateUrl: './create-mantencion.component.html',
  styleUrls: ['./create-mantencion.component.css']
})
export class CreateMantencionComponent implements OnInit {
  createMantencion: FormGroup;
  submitted = false;
  id:string| null;
  titulo='Agregar ';
  vehiculos: any[] = [];
  mecanicos: any[] = [];
  tipoPrev: any[] = [];
  tipoLegal: any[] = [];
  marcas: any[] = [];
  mostrarProxFecha= false;
  mostrarTipoPrev: boolean = false;
  mostrarTipoLegal: boolean = false;

  constructor(
    private afAuth: AngularFireAuth,
    private fb: FormBuilder,
    private _mantencionService: MantencionService,//<-- Agregamos el servicio (los servicios llevan el guion bajo)
    private router: Router,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) { 
    this.createMantencion = this.fb.group({
      descripcion: ['', Validators.required],
      costo: ['', Validators.required],
      fecha: ['', Validators.required],
      vehiculo: ['', Validators.required],
      mecanico: ['', Validators.required],
      tipoMantencionPreventiva: [],
      tipoMantencionLegal: [],
      fechaProxMantencion: [],
    });
    this.id=this.aRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.toastr.info('Los campos que contengan * son obligatorios', 'Importante', { positionClass: 'toast-top-right' });
    this.esEditar();
    this.getMarcas();

    this._mantencionService.getVehiculos().subscribe(data => {
      this.vehiculos = [];
      data.forEach((element: any) => {
        this.vehiculos.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        })
      });
    });
    this._mantencionService.getTipoLegal().subscribe(data => {
      this.tipoLegal = [];
      data.forEach((element: any) => {
        this.tipoLegal.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        })
      });
    });
    this._mantencionService.getTipoPrev().subscribe(data => {
      this.tipoPrev = [];
      data.forEach((element: any) => {
        this.tipoPrev.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        })
      });
    });
    this._mantencionService.getMecanicos().subscribe(data => {
      this.mecanicos = [];
      data.forEach((element: any) => {
        this.mecanicos.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        })
      });
    });
    this.mostrarProxFecha = false;
    this.mostrarTipoPrev = false;
    this.mostrarTipoLegal = false;
  }
  agregarEditar(){
    this.submitted = true;
    if(this.createMantencion.invalid){
      return
    }
    if(this.id==null){
      this.agregarMantencion();
    }else{
      this.editarMantencion(this.id);
    }
    this.mostrarTipoLegal = false;
    this.mostrarTipoPrev = false;
    this.mostrarProxFecha = false;
  }
  agregarMantencion() {
    const mantencion: any = {
      descripcion: this.createMantencion.value.descripcion,
      costo: this.createMantencion.value.costo,
      fecha: this.createMantencion.value.fecha,
      vehiculo: this.createMantencion.value.vehiculo,
      mecanico: this.createMantencion.value.mecanico,
      tipoMantencionPreventiva: this.createMantencion.value.tipoMantencionPreventiva,
      tipoMantencionLegal: this.createMantencion.value.tipoMantencionLegal,
      fechaProxMantencion: this.createMantencion.value.fechaProxMantencion,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    };
  
    const fechaActual = new Date();
    const fechaIngresada = new Date(mantencion.fecha);
  
    // Se obtienen los años, meses y días de las fechas
    const yearIngresado = fechaIngresada.getFullYear();
    const monthIngresado = fechaIngresada.getMonth();
    const dayIngresado = fechaIngresada.getDate();
    const yearActual = fechaActual.getFullYear();
    const monthActual = fechaActual.getMonth();
    const dayActual = fechaActual.getDate();
  
    // Verificar si se ha ingresado una fecha de próxima mantención
    if (mantencion.fechaProxMantencion) {
      const fechaProxMantencion = new Date(mantencion.fechaProxMantencion);
      const yearProxMantencion = fechaProxMantencion.getFullYear();
      const monthProxMantencion = fechaProxMantencion.getMonth();
      const dayProxMantencion = fechaProxMantencion.getDate();
  
      if (
        yearProxMantencion < yearActual ||
        (yearProxMantencion === yearActual && monthProxMantencion < monthActual) ||
        (yearProxMantencion === yearActual && monthProxMantencion === monthActual && dayProxMantencion < dayActual)
      ) {
        this.toastr.error('La fecha de próxima mantención debe ser mayor a la fecha actual', 'Error', { positionClass: 'toast-top-right' });
        if (this.mostrarTipoPrev) {
          this.mostrarProxFecha = true;
        }
        this.createMantencion.reset(); // Limpiar el formulario
        return;
      }
  
      mantencion.fechaProxMantencion = fechaProxMantencion;
    }
  
    if (
      yearIngresado > yearActual ||
      (yearIngresado === yearActual && monthIngresado > monthActual) ||
      (yearIngresado === yearActual && monthIngresado === monthActual && dayIngresado > dayActual)
    ) {
      this.toastr.error('No se permite guardar mantenciones futuras', 'Error', { positionClass: 'toast-top-right' });
      this.createMantencion.reset(); // Limpiar el formulario
      return;
    }
  
    this.spinner.show();
    this.afAuth.currentUser.then(user => {
      if (user) {
        mantencion.userId = user.uid; // Agrega el ID del usuario al objeto vehiculo
      }
      this._mantencionService.agregarMantencion(mantencion)
        .then(() => {
          console.log('Mantencion creada con éxito');
          this.toastr.success('La mantencion fue registrada exitosamente!', 'Mantencion Registrada', { positionClass: 'toast-top-right' });
          this.spinner.hide();
          this.router.navigate(['/dashboard/mantenciones']);
        })
        .catch(error => {
          console.log(error);
          this.spinner.hide();
        });
    });
  }
  
  

  mostrarProximaFecha() {
    const tipoMantencionPreventiva = this.createMantencion.get('tipoMantencionPreventiva');
    const tipoMantencionLegal = this.createMantencion.get('tipoMantencionLegal');
  
    if (tipoMantencionPreventiva && tipoMantencionPreventiva.value) {
      this.mostrarProxFecha = true;
    } else if (tipoMantencionLegal && tipoMantencionLegal.value) {
      this.mostrarProxFecha = false;
    }
  }
  mostrarLegal() {
    this.mostrarTipoLegal = !this.mostrarTipoLegal;
    if(this.mostrarTipoLegal==true){
      this.mostrarTipoPrev = false;
    }
    
  }
  mostrarPrev() {
    this.mostrarTipoPrev = true;
    this.mostrarTipoLegal = false;
    this.mostrarProxFecha = !this.mostrarTipoPrev;
  }

  editarMantencion(id: string) {
    const mantencion: any = {
      descripcion: this.createMantencion.value.descripcion,
      costo: this.createMantencion.value.costo,
      fecha: this.createMantencion.value.fecha,
      vehiculo: this.createMantencion.value.vehiculo,
      mecanico: this.createMantencion.value.mecanico,
      tipoMantencionPreventiva: this.createMantencion.value.tipoMantencionPreventiva,
      tipoMantencionLegal: this.createMantencion.value.tipoMantencionLegal,
      fechaProxMantencion: this.createMantencion.value.fechaProxMantencion,
      fechaCreacion: new Date(),
    };
  
    this.spinner.show();
  
    this.afAuth.currentUser.then(user => {
      if (user) {
        mantencion.userId = user.uid; // Agrega el ID del usuario al objeto vehiculo
      }
  
      this._mantencionService.actualizarMantencion(id, mantencion).then(() => {
        this.spinner.hide();
        this.toastr.info('La mantencion fue modificada con exito!', 'Mantencion modificada', { positionClass: 'toast-top-right' });
        this.router.navigate(['/dashboard/mantenciones']);
      });
    });
  }

  esEditar() {
    if (this.id !== null) {
      this.titulo = 'Editar ';
      this.spinner.show();
      this._mantencionService.getMantencion(this.id).subscribe(data => {
        this.spinner.hide();
        console.log(data.payload.data()['descripcion']);
        const fecha = data.payload.data()['fecha'].toDate(); // Obtener la fecha como objeto Date
        this.createMantencion.patchValue({
          descripcion: data.payload.data()['descripcion'],
          costo: data.payload.data()['costo'],
          fecha: fecha, // Establecer la fecha utilizando patchValue()
          vehiculo: data.payload.data()['vehiculo'],
          mecanico: data.payload.data()['mecanico'],
          tipoMantencionPreventiva: data.payload.data()['tipoMantencionPreventiva'],
          tipoMantencionLegal: data.payload.data()['tipoMantencionLegal'],
          fechaProxMantencion: data.payload.data()['fechaProxMantencion'],
        })
      })
    }
  }
  

  getMarcas() {
    this._mantencionService.getMarcas().subscribe(data => {
      this.marcas = [];
      data.forEach((element: any) => {
        const marca = element.payload.doc.data();
        marca.id = element.payload.doc.id;
        this.marcas.push(marca);
      });
      console.log(this.marcas);
    });
  }

  getMarcaNombre(marcaId: string): string {
    const marca = this.marcas.find(m => m.id === marcaId);
    return marca ? marca.nombre : '';
  }

}
