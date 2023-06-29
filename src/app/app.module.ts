import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';

import { SharedModule } from './components/shared/shared.module';
import { environment } from '../environments/environment';
import { ToastrModule } from 'ngx-toastr';
import { RegistrarUsuarioComponent } from './components/registrar-usuario/registrar-usuario.component';
import { RecuperarPasswordComponent } from './components/recuperar-password/recuperar-password.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ServiceWorkerModule } from '@angular/service-worker';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrarUsuarioComponent,
    RecuperarPasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    ToastrModule.forRoot(), // ToastrModule added
    CollapseModule.forRoot(),
    BsDropdownModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
