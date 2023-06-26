import { Component, OnInit, ViewChild } from '@angular/core';
import { VehiculoService } from 'src/app/services/vehiculo.service';
import { MantencionService } from 'src/app/services/mantencion.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  panelOpenState = false;
  displayedColumns: string[] = ['index', 'patente', 'marca', 'modelo','acciones'];
  dataSource = new MatTableDataSource<any>();
  vehiculos: any[] = [];
  marcas: any[] = [];
  proximasMantenciones: any[] = [];
  dataUser:any;
  tiposPrev: any[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _vehiculoServices: VehiculoService,
    private _mantencionService: MantencionService,
    private afAuth: AngularFireAuth,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.getProximasMantenciones();
    this.getVehiculos();
    this.getMarcas();
    this.getTiposPrev();
  }
  ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  formatDate(timestamp: firebase.firestore.Timestamp): string {
    const date = timestamp.toDate();
    // Formatea la fecha como desees, por ejemplo:
    const formattedDate = date.toLocaleDateString(); // Formato: dd/mm/aaaa
    return formattedDate;
  }
  getProximasMantenciones() {
    this._mantencionService.getMantencionesByFechaProx().subscribe(data => {
      this.proximasMantenciones = [];
      data.forEach((element: any) => {
        const mantencion = element.payload.doc.data();
        mantencion.id = element.payload.doc.id;
        mantencion.fechaProxMantencion = this.formatDate(mantencion.fecha);
        this.proximasMantenciones.push(mantencion);
      });
    });
  }
  getVehiculos() {
    this._vehiculoServices.getVehiculos().subscribe(data => {
      this.vehiculos = [];
      data.forEach((element: any) => {
        const vehiculo = element.payload.doc.data();
        vehiculo.id = element.payload.doc.id;
        this.vehiculos.push(vehiculo);
      });
      this.dataSource.data = this.vehiculos;
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
  
  getVehiculoPatente(patenteId: string): string {
    const vehiculo = this.vehiculos.find(v => v.id === patenteId);
    return vehiculo ? vehiculo.patente : '';
  }
  getTipoPrevNombre(tipoPId: string): string {
    const tipoP = this.tiposPrev.find(t => t.id === tipoPId);
    return tipoP ? tipoP.nombre : '';
  }
  getMarcaNombre(marcaId: string): string {
    const marca = this.marcas.find(m => m.id === marcaId);
    return marca ? marca.nombre : '';
  }

}
