import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { EditoriaisModule } from './modules/editoriais/editoriais.module';
import { HomeModule } from './modules/home/home.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { ColeconsModule } from './modules/colecons/colecons.module';
import { AppRoutingModule } from './app-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { LayoutModule } from './layout/layout.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpClientModule, BrowserModule, BrowserAnimationsModule, AppRoutingModule,
    LayoutModule, CoreModule, HomeModule, EditoriaisModule, ColeconsModule,
    MatDialogModule, // Para o Dialog
    MatIconModule,
    MatSidenavModule, // Ppara o menú despregavel
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
