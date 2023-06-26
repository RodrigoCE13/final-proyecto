import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MarcaService } from 'src/app/services/marca.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

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
  eliminarMarca(id:string){
    this._marcaService.eliminarMarca(id).then(()=>{
      console.log('Marca eliminada con exito');
      this.toastr.success('La marca fue eliminads con exito!', 'Marca eliminado',{positionClass: 'toast-bottom-right'});
    }).catch(error=>{
      console.log(error);
    })
  }
}
