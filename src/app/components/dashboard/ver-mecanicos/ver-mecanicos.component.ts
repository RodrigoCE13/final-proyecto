import { Component, OnInit, ViewChild } from '@angular/core';
import { MecanicoService } from 'src/app/services/mecanico.service';
import { ToastrService } from 'ngx-toastr';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-ver-mecanicos',
  templateUrl: './ver-mecanicos.component.html',
  styleUrls: ['./ver-mecanicos.component.css']
})
export class VerMecanicosComponent implements OnInit {
  displayedColumns: string[] = ['index', 'nombre', 'fono', 'direccion', 'tipoMecanico', 'acciones'];
  dataSource = new MatTableDataSource<any>();
  mecanicos:any[]=[];//<-- Arreglo para almacenar los mecanicos
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _mecanicoService: MecanicoService,//<-- Agregamos el servicio (los servicios llevan el guion bajo)
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getMecanicos();
  }
  ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  getMecanicos(){//<-- Metodo para obtener los mecanicos
    this._mecanicoService.getMecanicos().subscribe(data=>{//<-- Nos suscribimos al observable para obtener los mecanicos
      this.mecanicos=[];//<-- Inicializamos el arreglo
      data.forEach((element:any) => {//<-- Recorremos los elementos de la coleccion
        this.mecanicos.push({//<-- Agregamos los elementos al arreglo
          id: element.payload.doc.id,//<-- Obtenemos el id del documento
          ...element.payload.doc.data()//con ... accedemos a los datos del documento
        })
      });
      this.dataSource.data = this.mecanicos;
    });
  }
  eliminarMecanico(id: string) {
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
        this._mecanicoService.eliminarMecanico(id).then(() => {
          console.log('Mecánico eliminado con éxito');
          this.toastr.error('¡El mecánico fue eliminado con éxito!', 'Mecánico eliminado', { positionClass: 'toast-bottom-right' });
        }).catch(error => {
          console.log(error);
        });
        Swal.fire(
          '¡Eliminado!',
          'Tu archivo ha sido eliminado.',
          'success'
        );
      }
    });
  }

}
