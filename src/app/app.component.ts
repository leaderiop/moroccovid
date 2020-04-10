import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { DatabaseService } from './database/services/database.service';

import { createConnection } from 'typeorm';
import { UserModel } from './database/models/user.model';
import { TrajectModel } from './database/models/traject.model';
import { LocationModel } from './database/models/location.model';
import {
  TrackingConfigureAction,
  TrackingWatchStateAction,
} from './store/actions/tracking.actions';
import { Store } from '@ngxs/store';

import { AppMinimize } from '@ionic-native/app-minimize/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  on: boolean = false;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private readonly database: DatabaseService,
    private readonly store: Store,
    private appMinimize: AppMinimize,
  ) //private backgroundMode: BackgroundMode,
  {
    this.initializeApp();
  }
  ngOnInit() {}

  initializeApp() {
    this.platform.ready().then(async () => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      //this.backgroundMode.enable();

      this.platform.backButton.subscribe(() => {
        this.appMinimize.minimize();
      });
      await this.database.initialize();

      this.store.dispatch(new TrackingConfigureAction());
      this.store.dispatch(new TrackingWatchStateAction());

      this.on = true;
    });
  }
}
