import { Injectable } from '@angular/core';
import BackgroundGeolocation, {
  Location,
} from 'cordova-background-geolocation-lt';
import { Platform } from '@ionic/angular';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TrackingService {
  private positionSubject: Subject<Location>;
  constructor(private platform: Platform) {}
  async configure() {
    await this.platform.ready();
    const state = await BackgroundGeolocation.ready({
      reset: true,
      debug: true,
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 10,
      autoSync: true,
      stopOnTerminate: false,
      startOnBoot: true,
    });
  }
  async start() {
    try {
      if (!this.positionSubject) {
        this.positionSubject = new Subject<Location>();
        await BackgroundGeolocation.start();
        await BackgroundGeolocation.watchPosition(
          location => {
            this.positionSubject.next(location);
          },
          error => {
            this.positionSubject.error(error);
          },
        );
      }
      return this.positionSubject;
    } catch (e) {
      return null;
    }
  }
  async stop() {
    if (this.positionSubject) this.positionSubject.complete();
    this.positionSubject = null;
    await BackgroundGeolocation.stopWatchPosition();
  }

  async enable() {
    await this.platform.ready();
    try {
      await BackgroundGeolocation.requestPermission();
      return true;
    } catch (e) {
      return false;
    }
  }
}
