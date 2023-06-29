  import { Component, OnInit, ViewChild } from '@angular/core';
import { TipoMantencionService } from 'src/app/services/tipo-mantencion.service';
import { MantencionService } from 'src/app/services/mantencion.service';
import { ToastrService } from 'ngx-toastr';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-ver-tipo-mantencion',
  templateUrl: './ver-tipo-mantencion.component.html',
  styleUrls: ['./ver-tipo-mantencion.component.css']
})
export class VerTipoMantencionComponent implements OnInit {
  displayedColumns: string[] = ['index', 'nombre','acciones'];
  dataSource = new MatTableDataSource<any>();
  tiposMantencion:any[]=[];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _tipoMantencionService: TipoMantencionService,
    private toastr: ToastrService,
    private _mantencionServices: MantencionService
  ) { }

  ngOnInit(): void {
    this.getTiposMantencion();
  }
  ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getTiposMantencion(){
    this._tipoMantencionService.getTipoMantenciones().subscribe(data=>{
      this.tiposMantencion=[];
      data.forEach((element:any) => {
        this.tiposMantencion.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        })
      });
      this.dataSource.data = this.tiposMantencion;
    });
  }
  eliminarTiposMantencion(id: string) {
    // Verificar si el tipo de mantenimiento tiene mantenciones asociadas
    this._mantencionServices.verificarTipoAsociadas(id).then(tieneMantenciones => {
      if (tieneMantenciones) {
        console.log('No se puede eliminar el tipo porque tiene mantenciones asociadas.');
        this.toastr.error('El tipo que desea eliminar tiene mantenciones', 'ERROR', { positionClass: 'toast-bottom-right' });
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
            this._tipoMantencionService.eliminarTipoMantencion(id).then(() => {
              console.log('Tipo eliminado con éxito');
              this.toastr.error('¡El tipo fue eliminado con éxito!', 'Tipo eliminado', { positionClass: 'toast-bottom-right' });
            }).catch(error => {
              console.log(error);
            });
            Swal.fire(
              '¡Eliminado!',
              'El tipo ha sido eliminado.',
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
