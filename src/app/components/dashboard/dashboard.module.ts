import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../shared/shared.module';
import { InicioComponent } from './inicio/inicio.component';
import { NavbarComponent } from './navbar/navbar.component';
import { CreateMecanicoComponent } from './create-mecanico/create-mecanico.component';
import { VerMecanicosComponent } from './ver-mecanicos/ver-mecanicos.component';
import { DashboardComponent } from './dashboard.component';
import { CreateTipoMantencionComponent } from './create-tipo-mantencion/create-tipo-mantencion.component';
import { VerTipoMantencionComponent } from './ver-tipo-mantencion/ver-tipo-mantencion.component';
import { CreateMarcaComponent } from './create-marca/create-marca.component';
import { VerMarcaComponent } from './ver-marca/ver-marca.component';
import { CreateVehiculoComponent } from './create-vehiculo/create-vehiculo.component';
import { VerVehiculoComponent } from './ver-vehiculo/ver-vehiculo.component';
import { CreateMantencionComponent } from './create-mantencion/create-mantencion.component';
import { VerMantencionComponent } from './ver-mantencion/ver-mantencion.component';
import { VerValorComponent } from './ver-valor/ver-valor.component';
import { VerTipoVehiculoComponent } from './ver-tipo-vehiculo/ver-tipo-vehiculo.component';
import { CreateTipoVehiculoComponent } from './create-tipo-vehiculo/create-tipo-vehiculo.component';
import { VerInformeComponent } from './ver-informe/ver-informe.component';



@NgModule({
  declarations: [
    InicioComponent,
    CreateMecanicoComponent,
    VerMecanicosComponent,
    NavbarComponent,
    DashboardComponent,
    CreateTipoMantencionComponent,
    VerTipoMantencionComponent,
    CreateMarcaComponent,
    VerMarcaComponent,
    CreateVehiculoComponent,
    VerVehiculoComponent,
    CreateMantencionComponent,
    VerMantencionComponent,
    VerValorComponent,
    VerTipoVehiculoComponent,
    CreateTipoVehiculoComponent,
    VerInformeComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule
  ]
})
export class DashboardModule { }
