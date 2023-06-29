import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MarcaService } from 'src/app/services/marca.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-ver-marca',
  templateUrl: './ver-marca.component.html',
  styleUrls: ['./ver-marca.component.css']
})
export class VerMarcaComponent implements OnInit {
  displayedColumns: string[] = ['index', 'nombre','acciones'];
  dataSource = new MatTableDataSource<any>();
  marcas:any[]=[];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _marcaService: MarcaService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getMarcas();
  }
  ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getMarcas(){
    this._marcaService.getMarcas().subscribe(data=>{
      this.marcas=[];
      data.forEach((element:any) => {
        this.marcas.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        })
      });
      this.dataSource.data = this.marcas;
    });
  }
  eliminarMarca(id: string) {
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
        this._marcaService.eliminarMarca(id).then(() => {
          console.log('Marca eliminada con éxito');
          this.toastr.success('¡La marca fue eliminada con éxito!', 'Marca eliminada', { positionClass: 'toast-bottom-right' });
        }).catch(error => {
          console.log(error);
        });
        Swal.fire(
          '¡Eliminado!',
          'La marca ha sido eliminada.',
          'success'
        );
      }
    });
  }
}
