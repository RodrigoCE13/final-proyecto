import { NgModule } from '@angular/core';
import { AuthGuard } from 'src/guards/auth.guards';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { InicioComponent } from './inicio/inicio.component';
import { CreateMecanicoComponent } from './create-mecanico/create-mecanico.component';
import { VerMecanicosComponent } from './ver-mecanicos/ver-mecanicos.component';
import { CreateMantencionComponent } from './create-mantencion/create-mantencion.component';
import { VerMantencionComponent } from './ver-mantencion/ver-mantencion.component';
import { CreateTipoMantencionComponent } from './create-tipo-mantencion/create-tipo-mantencion.component';
import { VerTipoMantencionComponent } from './ver-tipo-mantencion/ver-tipo-mantencion.component';
import { VerMarcaComponent } from './ver-marca/ver-marca.component';
import { CreateMarcaComponent } from './create-marca/create-marca.component';
import { CreateVehiculoComponent } from './create-vehiculo/create-vehiculo.component';
import { VerVehiculoComponent } from './ver-vehiculo/ver-vehiculo.component';
import { VerValorComponent } from './ver-valor/ver-valor.component';
import { CreateTipoVehiculoComponent } from './create-tipo-vehiculo/create-tipo-vehiculo.component';
import { VerTipoVehiculoComponent } from './ver-tipo-vehiculo/ver-tipo-vehiculo.component';
import { VerInformeComponent } from './ver-informe/ver-informe.component';

const routes: Routes = [
  {path: '', component: DashboardComponent, children: [
    {path: '', component: InicioComponent},
    //mecanico
    {path: 'create-mecanico', component: CreateMecanicoComponent},
    {path: 'edit-mecanico/:id', component: CreateMecanicoComponent},  
    {path: 'mecanicos', component: VerMecanicosComponent},
    //mantencion
    {path: 'create-mantencion', component: CreateMantencionComponent},
    {path: 'edit-mantencion/:id', component: CreateMantencionComponent},
    {path: 'mantenciones', component: VerMantencionComponent},
    //tipoMantencion
    {path: 'create-tipo-mantencion', component: CreateTipoMantencionComponent},
    {path: 'edit-tipo-mantencion/:id', component: CreateTipoMantencionComponent},
    {path: 'tipo-mantenciones', component: VerTipoMantencionComponent},
    //marca
    {path: 'create-marca', component: CreateMarcaComponent, canActivate: [AuthGuard]},
    {path: 'edit-marca/:id', component: CreateMarcaComponent, canActivate: [AuthGuard]},
    {path: 'marcas', component: VerMarcaComponent, canActivate: [AuthGuard]},
    //tipoVehiculo
    {path: 'create-tipo-vehiculo', component: CreateTipoVehiculoComponent, canActivate: [AuthGuard]},
    {path: 'edit-tipo-vehiculo/:id', component: CreateTipoVehiculoComponent, canActivate: [AuthGuard]},
    {path: 'tipo-vehiculos', component: VerTipoVehiculoComponent, canActivate: [AuthGuard]},
    //vehiculo
    {path: 'create-vehiculo', component: CreateVehiculoComponent},
    {path: 'edit-vehiculo/:id', component: CreateVehiculoComponent},
    {path: 'vehiculos', component: VerVehiculoComponent},
    {path: 'valor-vehiculo/:id', component: VerValorComponent},
    {path: 'informe-vehiculo/:id', component: VerInformeComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
