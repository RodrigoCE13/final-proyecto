import { Component, OnInit, ViewChild } from '@angular/core';
import { TipoVehiculoService } from 'src/app/services/tipo-vehiculo.service';
import { ToastrService } from 'ngx-toastr';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-ver-tipo-vehiculo',
  templateUrl: './ver-tipo-vehiculo.component.html',
  styleUrls: ['./ver-tipo-vehiculo.component.css']
})
export class VerTipoVehiculoComponent implements OnInit {
  displayedColumns: string[] = ['index', 'nombre','acciones'];
  dataSource = new MatTableDataSource<any>();
  tiposVehiculo:any[]=[];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _tipoVehiculoService: TipoVehiculoService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getTiposVehiculo();
  }
  ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getTiposVehiculo(){
    this._tipoVehiculoService.getTipoVehiculos().subscribe(data=>{
      this.tiposVehiculo=[];
      data.forEach((element:any) => {
        this.tiposVehiculo.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        })
      });
      this.dataSource.data = this.tiposVehiculo;
    });
  }
  eliminarTiposVehiculo(id: string) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas eliminar este tipo de vehículo?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            this._tipoVehiculoService.eliminarTipoVehiculo(id).then(() => {
                console.log('Tipo eliminado con éxito');
                this.toastr.error('El tipo fue eliminado con éxito!', 'Tipo eliminado', {
                    positionClass: 'toast-bottom-right'
                });
            }).catch((error) => {
                console.log(error);
            });
            Swal.fire(
              '¡Eliminado!',
              'El tipo ha sido eliminada.',
              'success'
            );
        }
    });
} 

}
