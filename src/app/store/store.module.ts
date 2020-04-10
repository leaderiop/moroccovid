import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxsModule } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { UserState } from './states/user.state';
import { UserService } from './services/user.service';
import { TrackingService } from './services/tracking.service';
import { TrackingState } from './states/tracking.state';
import { EmailService } from './services/email.service';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgxsModule.forRoot([UserState, TrackingState]),
    NgxsStoragePluginModule.forRoot({
      key: [UserState],
    }),
    NgxsLoggerPluginModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsRouterPluginModule.forRoot(),
  ],
  providers: [BackgroundMode, UserService, TrackingService, EmailService],
})
export class StoreModule {}
