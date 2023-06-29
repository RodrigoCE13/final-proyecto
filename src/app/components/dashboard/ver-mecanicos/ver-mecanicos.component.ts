import { Component, OnInit, ViewChild } from '@angular/core';
import { MecanicoService } from 'src/app/services/mecanico.service';
import { MantencionService } from 'src/app/services/mantencion.service';
import { ToastrService } from 'ngx-toastr';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


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
    private _mantencionServices: MantencionService
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
    // Verificar si el tipo de mantenimiento tiene mantenciones asociadas
    this._mantencionServices.verificarMecanicoAsociadas(id).then(tieneMantenciones => {
      if (tieneMantenciones) {
        console.log('No se puede eliminar el mecanico porque tiene mantenciones asociadas.');
        this.toastr.error('El mecanico que desea eliminar tiene mantenciones', 'ERROR', { positionClass: 'toast-bottom-right' });
      } else {
        // Eliminar el tipo de mantenimiento
        this._mecanicoService.eliminarMecanico(id).then(() => {
          console.log('Mecanico eliminado con éxito');
          this.toastr.info('El mecanico fue eliminado con éxito!', 'Mecanico eliminado', { positionClass: 'toast-bottom-right' });
        }).catch(error => {
          console.log(error);
        });
      }
    }).catch(error => {
      console.log(error);
    });
  }

}
