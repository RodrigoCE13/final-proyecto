import { Component, OnInit, ViewChild } from '@angular/core';
import { MantencionService } from 'src/app/services/mantencion.service';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

@Component({
  selector: 'app-ver-mantencion',
  templateUrl: './ver-mantencion.component.html',
  styleUrls: ['./ver-mantencion.component.css']
})
export class VerMantencionComponent implements OnInit {
  displayedColumns: string[] = ['index', 'vehiculo', 'fecha', 'costo', 'encargado', 'descripcion', 'acciones'];
  dataSource = new MatTableDataSource<any>();
  mantenciones:any[]=[];
  vehiculos: any[] = [];
  mecanicos: any[] = [];
  tiposPrev: any[] = [];
  tiposLegal: any[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _mantencionService: MantencionService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getMantenciones();
    this.getVehiculos();
    this.getMecanicos();
    this.getTiposPrev();
    this.getTiposLegal();
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
  
  getMantenciones() {
    this._mantencionService.getMantenciones().subscribe(data => {
      this.mantenciones = [];
      data.forEach((element: any) => {
        const mantencion = element.payload.doc.data();
        mantencion.id = element.payload.doc.id;
        mantencion.fecha = this.formatDate(mantencion.fecha);
        this.mantenciones.push(mantencion);
      });
      this.dataSource.data = this.mantenciones;
    });
  }
  getVehiculos(){
    this._mantencionService.getVehiculos().subscribe(data => {
      this.vehiculos = [];
      data.forEach((element: any) => {
        const vehiculo = element.payload.doc.data();
        vehiculo.id = element.payload.doc.id;
        this.vehiculos.push(vehiculo);
      });
    });
  }
  getMecanicos(){
    this._mantencionService.getMecanicos().subscribe(data => {
      this.mecanicos = [];
      data.forEach((element: any) => {
        const mecanico = element.payload.doc.data();
        mecanico.id = element.payload.doc.id;
        this.mecanicos.push(mecanico);
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
  getTiposLegal(){
    this._mantencionService.getTipoLegal().subscribe(data => {
      this.tiposLegal = [];
      data.forEach((element: any) => {
        const tipoLegal = element.payload.doc.data();
        tipoLegal.id = element.payload.doc.id;
        this.tiposLegal.push(tipoLegal);
      });
    });
  }
  getVehiculoPatente(vehiculoId: string): string {
    const vehiculo = this.vehiculos.find(t => t.id === vehiculoId);
    return vehiculo ? vehiculo.patente : '';
  }
  getMecanicoNombre(mecanicoId: string): string {
    const mecanico = this.mecanicos.find(t => t.id === mecanicoId);
    return mecanico ? mecanico.nombre : '';
  }
  getTipoPrevNombre(tipoPId: string): string {
    const tipoP = this.tiposPrev.find(t => t.id === tipoPId);
    return tipoP ? tipoP.nombre : '';
  }
  getTipoLegalNombre(tipoLId: string): string {
    const tipoL = this.tiposLegal.find(t => t.id === tipoLId);
    return tipoL ? tipoL.nombre : '';
  }

  eliminarMantencion(id:string){
    this._mantencionService.eliminarMantencion(id).then(()=>{
      console.log('Mantencion eliminada con exito');
      this.toastr.error('La mantencion fue eliminada con exito!', 'Mantencion eliminada',{positionClass: 'toast-bottom-right'});
    }).catch(error=>{
      console.log(error);
    })
  }

}
