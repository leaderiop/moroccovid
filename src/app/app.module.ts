import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from './store/store.module';
import { HttpClientModule } from '@angular/common/http';

import { authInterceptorProviders } from './helpers/interceptors/http-jwt.interceptor';
import { SharedModule } from './shared/shared.module';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { DatabaseModule } from './database/database.module';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

import { AppMinimize } from '@ionic-native/app-minimize/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ReactiveFormsModule,
    StoreModule,
    HttpClientModule,
    SharedModule,
    DatabaseModule,
  ],
  providers: [
    SQLite,
    StatusBar,
    SplashScreen,
    EmailComposer,
    AppMinimize,
    authInterceptorProviders,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
  exports: [StoreModule, HttpClientModule, SharedModule, DatabaseModule],
})
export class AppModule {}
