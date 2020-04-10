import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { UserLogoutAction } from 'src/app/store/actions/user.actions';
import {
  TrackingConfigureAction,
  TrackingWatchStateAction,
  TrackingStartWatchingAction,
  TrackingStopWatchingAction,
  TrackingGetAllTrajectAction,
  TrackingEnableAction,
  TrackingDeleteTrajectAction,
  TrackingSendTrajectAction,
  TrackingContinueTrackingAction,
} from 'src/app/store/actions/tracking.actions';
import { UserModel } from 'src/app/store/models/user.model';
import { TrajectModel } from 'src/app/database/models/traject.model';
@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.page.html',
  styleUrls: ['./tracking.page.scss'],
})
export class TrackingPage implements OnInit {
  IS_ENABLED: false;
  IS_TRACKING: false;
  USER: UserModel;
  TRAJECTS: TrajectModel[];
  TRAJECT: TrajectModel;
  constructor(private readonly store: Store) {}

  async ngOnInit() {
    this.store
      .select(state => state.tracking.IS_TRACKING)
      .subscribe(IS_TRACKING => {
        this.IS_TRACKING = IS_TRACKING;
      });
    this.store
      .select(state => state.tracking.IS_ENABLED)
      .subscribe(IS_ENABLED => {
        this.IS_ENABLED = IS_ENABLED;
      });
    this.store
      .select(state => state.tracking.TRAJECT)
      .subscribe(TRAJECT => {
        this.TRAJECT = TRAJECT;
      });
    this.store
      .select(state => state.tracking.TRAJECTS)
      .subscribe(TRAJECTS => {
        this.TRAJECTS = TRAJECTS;
      });
    this.store
      .select(state => state.user.USER)
      .subscribe(USER => {
        this.USER = USER;
        if (USER)
          this.store.dispatch(new TrackingGetAllTrajectAction(USER._id));
      });
  }

  logout() {
    this.store.dispatch(new UserLogoutAction());
  }

  enable() {
    this.store.dispatch(new TrackingEnableAction());
  }
  start() {
    this.store.dispatch(new TrackingStartWatchingAction(this.USER));
  }
  stop() {
    this.store.dispatch(new TrackingStopWatchingAction());
  }
  delete(traject: TrajectModel) {
    this.store.dispatch(new TrackingDeleteTrajectAction(traject));
  }
  send(traject: TrajectModel) {
    this.store.dispatch(new TrackingSendTrajectAction(traject));
  }
}
