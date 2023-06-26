import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VehiculoService } from 'src/app/services/vehiculo.service';
import { MantencionService } from 'src/app/services/mantencion.service';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
@Component({
  selector: 'app-ver-informe',
  templateUrl: './ver-informe.component.html',
  styleUrls: ['./ver-informe.component.css']
})
export class VerInformeComponent implements OnInit {
  id:string| null;
  vehiculos: any[] = [];
  patente: string="";
  marca: string="";
  modelo: string="";
  annio: string="";
  kilometraje: string="";
  marcas: any[] = [];
  tipos: any[] = [];
  mantenciones: any[] = [];
  tiposPrev: any[] = [];
  totalGastado: number = 0;
  constructor(
    private _vehiculoServices: VehiculoService,
    private _mantencionService: MantencionService,
    private aRoute: ActivatedRoute
    ) { 
      this.id=this.aRoute.snapshot.paramMap.get('id');
    }

  ngOnInit(): void {
    this.getVehiculos()
    this.getMarcas();
    this.getTipos();
    this.getMantencionesByVehiculo();
    this.getTiposPrev();    
  }
  formatDate(timestamp: firebase.firestore.Timestamp): string {
    const date = timestamp.toDate();
    // Formatea la fecha como desees, por ejemplo:
    const formattedDate = date.toLocaleDateString(); // Formato: dd/mm/aaaa
    return formattedDate;
  }
  getVehiculos() {
    if (this.id) {
      this._vehiculoServices.getVehiculo(this.id).subscribe(data => {
        this.vehiculos = [];
        const vehiculo = data.payload.data();
        vehiculo.id = data.payload.id;
        this.vehiculos.push(vehiculo);
      });
    }
  }
  getMantencionesByVehiculo() {
    if (this.id) {
      this._mantencionService.getMantencionesByVehiculo(this.id).subscribe(data => {
        this.mantenciones = data.map((item: any) => item.payload.doc.data());
        this.mantenciones.forEach((element: any) => {
          element.fecha = this.formatDate(element.fecha);
        }
        );
        // Calcula el total gastado después de obtener las mantenciones
        this.totalGastado = this.mantenciones.reduce((total: number, mantencion: any) => {
        return total + parseFloat(mantencion.costo);
      }, 0);
      });
    }
  }

  getMarcas() {
    this._vehiculoServices.getMarcas().subscribe(data => {
      this.marcas = [];
      data.forEach((element: any) => {
        const marca = element.payload.doc.data();
        marca.id = element.payload.doc.id;
        this.marcas.push(marca);
      });
    });
  }
  getTipos() {
    this._vehiculoServices.getTipos().subscribe(data => {
      this.tipos = [];
      data.forEach((element: any) => {
        const tipo = element.payload.doc.data();
        tipo.id = element.payload.doc.id;
        this.tipos.push(tipo);
      });
    });
  }
  getTiposPrev(){
    this._mantencionService.getTipoPrev().subscribe(data => {
      this.tiposPrev = [];
      data.forEach((element: any) => {
        const tipoPrev = element.payload.doc.data();
        tipoPrev.id = element.payload.doc.id;
        this.tiposPrev.push(tipoPrev);
      });
    });
  }
  getMarcaNombre(marcaId: string): string {
    const marca = this.marcas.find(m => m.id === marcaId);
    return marca ? marca.nombre : '';
  }
  getTipoNombre(tipoId: string): string {
    const tipo = this.tipos.find(t => t.id === tipoId);
    return tipo ? tipo.nombre : '';
  }
  getTipoPrevNombre(tipoPId: string): string {
    const tipoP = this.tiposPrev.find(t => t.id === tipoPId);
    return tipoP ? tipoP.nombre : '';
  }

}
