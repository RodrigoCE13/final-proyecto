import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VehiculoService } from 'src/app/services/vehiculo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-ver-valor',
  templateUrl: './ver-valor.component.html',
  styleUrls: ['./ver-valor.component.css']
})

export class VerValorComponent implements OnInit {
  loading=false;
  id:string| null;
  precio=0;
  annio: number = 0;
  tipoDepreciacion: string="";
  preciofinalBj=0;
  preciofinalMd=0;
  preciofinalAl=0;

  depreciacionBj=0.9;
  depreciacionMd=0.85;
  depreciacionAl=0.8;

  devaluacionBj=0.0;
  devaluacionMd=0.0;
  devaluacionAl=0.0;

  anniosdpre=0;
  patente='';
  modelo='';
  
  fecha = new Date();
  fechaactual = this.fecha.getFullYear();

  constructor(
    private afAuth: AngularFireAuth,
    private fb: FormBuilder,
    private _vehiculoService: VehiculoService,
    private router: Router,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute
  ) { 
    this.id=this.aRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.cargarVehiculo();
  }
  cargarVehiculo(){
    if(this.id !== null){
      this.loading=true;
      this._vehiculoService.getVehiculo(this.id).subscribe(data=>{
        this.loading=false;
        console.log(data.payload.data()['precio']);
        this.precio = data.payload.data()['precio'];
        this.annio = data.payload.data()['annio'];
        this.modelo = data.payload.data()['modelo'];
        this.patente = data.payload.data()['patente'];
        this.depreciacionVehiculoBaja(this.annio, this.precio);
        this.depreciacionVehiculoMedia(this.annio, this.precio);
        this.depreciacionVehiculoAlta(this.annio, this.precio);
      })
    }
  }
  depreciacionVehiculoMedia(annio:number, precio:number){
    this.anniosdpre = parseInt(this.fechaactual.toString()) - annio;

    if(this.anniosdpre <= 1){
      this.devaluacionMd = 0.24 * precio;
      this.preciofinalMd = precio - this.devaluacionMd;
      this.devaluacionMd = Math.trunc(this.devaluacionMd);
      this.preciofinalMd = Math.trunc(this.preciofinalMd);
    }else{
      for(let i = 1; i < (this.anniosdpre - 1); i++){
        this.depreciacionMd = this.depreciacionMd * 0.85;
      }

        this.preciofinalMd = (this.depreciacionMd * 0.76) * precio;
        this.devaluacionMd = precio - this.preciofinalMd;
        
        if(this.preciofinalMd <= (precio * 0.1)){

          this.preciofinalMd = precio * 0.1;
          this.devaluacionMd = precio * 0.9;
          this.devaluacionMd = Math.trunc(this.devaluacionMd);
          this.preciofinalMd = Math.trunc(this.preciofinalMd);
          this.depreciacionMd=0.85;
        }
        else{
          this.devaluacionMd = Math.trunc(this.devaluacionMd);
          this.preciofinalMd = Math.trunc(this.preciofinalMd);
          this.depreciacionMd=0.85;
        }
    }
  }

  depreciacionVehiculoBaja(annio:number, precio:number){
    this.anniosdpre = parseInt(this.fechaactual.toString()) - annio;

    if(this.anniosdpre <= 1){
      this.devaluacionBj = 0.16 * precio;
      this.preciofinalBj = precio - this.devaluacionBj;
      this.devaluacionBj = Math.trunc(this.devaluacionBj);
      this.preciofinalBj = Math.trunc(this.preciofinalBj);
    }else{
      for(let i = 1; i < (this.anniosdpre - 1); i++){
        this.depreciacionBj = this.depreciacionBj * 0.9;
      }

        this.preciofinalBj = (this.depreciacionBj * 0.84) * precio;
        this.devaluacionBj = precio - this.preciofinalBj;
        
        if(this.preciofinalBj <= (precio * 0.1)){

          this.preciofinalBj = precio * 0.1;
          this.devaluacionBj = precio * 0.9;
          this.devaluacionBj = Math.trunc(this.devaluacionBj);
          this.preciofinalBj = Math.trunc(this.preciofinalBj);
          this.depreciacionBj = 0.9;
        }
        else{
          this.devaluacionBj = Math.trunc(this.devaluacionBj);
          this.preciofinalBj = Math.trunc(this.preciofinalBj);
          this.depreciacionBj = 0.9;
        }
    }
  }

  depreciacionVehiculoAlta(annio:number, precio:number){
    this.anniosdpre = parseInt(this.fechaactual.toString()) - annio;

    if(this.anniosdpre <= 1){
      this.devaluacionAl = 0.32 * precio;
      this.preciofinalAl = precio - this.devaluacionAl;
      this.devaluacionAl = Math.trunc(this.devaluacionAl);
      this.preciofinalAl = Math.trunc(this.preciofinalAl);
    }else{
      for(let i = 1; i < (this.anniosdpre - 1); i++){
        this.depreciacionAl = this.depreciacionAl * 0.8;
      }

        this.preciofinalAl = (this.depreciacionAl * 0.68) * precio;
        this.devaluacionAl = precio - this.preciofinalAl;
        
        if(this.preciofinalAl <= (precio * 0.1)){

          this.preciofinalAl = precio * 0.1;
          this.devaluacionAl = precio * 0.9;
          this.devaluacionAl = Math.trunc(this.devaluacionAl);
          this.preciofinalAl = Math.trunc(this.preciofinalAl);
          this.depreciacionAl=0.8;
        }
        else{
          this.devaluacionAl = Math.trunc(this.devaluacionAl);
          this.preciofinalAl = Math.trunc(this.preciofinalAl);
          this.depreciacionAl=0.8;
        }
    }
  }
  

  mostrarDiv(value:string) {
    this.tipoDepreciacion = value;
    this.tipoDepreciacion = value;
  }

}
