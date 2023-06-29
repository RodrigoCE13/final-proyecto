import { Component, OnInit, ViewChild} from '@angular/core';
import { VehiculoService } from 'src/app/services/vehiculo.service';
import { MantencionService } from 'src/app/services/mantencion.service';
import { ToastrService } from 'ngx-toastr';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-ver-vehiculo',
  templateUrl: './ver-vehiculo.component.html',
  styleUrls: ['./ver-vehiculo.component.css']
})
export class VerVehiculoComponent implements OnInit {
  displayedColumns: string[] = ['index', 'patente', 'marca', 'modelo', 'tipo', 'annio', 'valor', 'acciones'];
  dataSource = new MatTableDataSource<any>();
  vehiculos:any[]=[];
  marcas: any[] = [];
  tipos: any[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _vehiculoServices: VehiculoService,
    private toastr: ToastrService,
    private _mantencionServices: MantencionService
  ) { }

  ngOnInit(): void {
    this.getMarcas();
    this.getTipos();
    this.getVehiculos();
  }

  ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

  getMarcaNombre(marcaId: string): string {
    const marca = this.marcas.find(m => m.id === marcaId);
    return marca ? marca.nombre : '';
  }

  getTipoNombre(tipoId: string): string {
    const tipo = this.tipos.find(t => t.id === tipoId);
    return tipo ? tipo.nombre : '';
  }

  //eliminarVehiculo(id:string){
  //  this._vehiculoServices.eliminarVehiculo(id).then(()=>{
  //    console.log('Vehiculo eliminado con exito');
  //    this.toastr.error('El vehiculo fue eliminado con exito!', 'Vehiculo eliminado',{positionClass: 'toast-bottom-right'});
  //  }).catch(error=>{
  //    console.log(error);
  //  })
  //}
  eliminarVehiculo(id: string) {
    // Verificar si el vehículo tiene mantenimientos asociados
    this._mantencionServices.verificarMantencionesAsociadas(id).then(tieneMantenciones => {
      if (tieneMantenciones) {
        console.log('No se puede eliminar el vehículo porque tiene mantenimientos asociados.');
        this.toastr.error('El vehículo que desea eliminar tiene mantenciones', 'ERROR', { positionClass: 'toast-bottom-right' });
      } else {
        Swal.fire({
          title: '¿Estás seguro?',
          text: '¡No podrás revertir esto!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, eliminarlo'
        }).then((result) => {
          if (result.isConfirmed) {
            this._vehiculoServices.eliminarVehiculo(id).then(()=>{
              console.log('Vehiculo eliminado con exito');
              this.toastr.error('El vehiculo fue eliminado con exito!', 'Vehiculo eliminado',{positionClass: 'toast-bottom-right'});
            }).catch(error=>{
              console.log(error);
            });
            Swal.fire(
              '¡Eliminado!',
              'El vehiculo ha sido eliminada.',
              'success'
            );
          }
        });
      }
    }).catch(error => {
      console.log(error);
    });
  }
}
