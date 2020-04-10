import { State, Action, StateContext, Store } from '@ngxs/store';

import { TrackingService } from '../services/tracking.service';
import BackgroundGeolocation from 'cordova-background-geolocation-lt';
import {
  TrackingStartWatchingAction,
  TrackingEnableAction,
  TrackingEnableFailAction,
  TrackingEnableSuccessAction,
  TrackingStartWatchingSuccessAction,
  TrackingStartWatchingFailAction,
  TrackingStartWatchingCompleteAction,
  TrackingConfigureAction,
  TrackingStopWatchingAction,
  TrackingWatchStateAction,
  TrackingSaveLocationAction,
  TrackingSaveLocationFailAction,
  TrackingSaveLocationSuccessAction,
  TrackingGetAllTrajectAction,
  TrackingDeleteTrajectAction,
  TrackingSendTrajectAction,
  TrackingContinueTrackingAction,
  TrackingBackgroundStartAction,
  TrackingBackgroundStopAction,
} from '../actions/tracking.actions';
import { Platform } from '@ionic/angular';
import { TrajectModel } from 'src/app/database/models/traject.model';
import { DatabaseService } from 'src/app/database/services/database.service';
import { UserModel } from 'src/app/database/models/user.model';
import { EmailService } from '../services/email.service';

import { BackgroundMode } from '@ionic-native/background-mode/ngx';
class TrackingStateModel {
  IS_ENABLED: boolean;
  IS_TRACKING: boolean;
  TRAJECT: TrajectModel;
  TRAJECTS: TrajectModel[];
}
@State<TrackingStateModel>({
  name: 'tracking',
  defaults: {
    IS_ENABLED: false,
    IS_TRACKING: false,
    TRAJECT: null,
    TRAJECTS: [],
  },
})
export class TrackingState {
  constructor(
    private readonly trackingService: TrackingService,
    private readonly platform: Platform,
    private readonly databaseService: DatabaseService,
    private readonly emailSevice: EmailService,
    private readonly backgroundMode: BackgroundMode,
  ) {}

  //** Start Configure Tracking */
  @Action(TrackingConfigureAction)
  async TrackingConfigureAction() {
    await this.trackingService.configure();
  }
  //** End Configure Tracking */

  //*********************************** *****************************************//

  //** Start Watching Tracking Status */
  @Action(TrackingWatchStateAction)
  async TrackingWatchStateAction({
    dispatch,
    getState,
    patchState,
  }: StateContext<TrackingStateModel>) {
    await this.platform.ready();
    BackgroundGeolocation.onProviderChange((event) => {
      patchState({ IS_ENABLED: event.enabled });
    });

    patchState({
      IS_ENABLED: (await BackgroundGeolocation.getState()).enabled,
    });
    const state = getState();
    if (state.IS_TRACKING) {
      dispatch(new TrackingContinueTrackingAction());
    }
  }
  //** End Watching Tracking Status */

  //*********************************** *****************************************//

  //** Start Enable Tracking  */
  @Action(TrackingEnableAction)
  async TrackingEnableAction({
    dispatch,
    getState,
    patchState,
  }: StateContext<TrackingStateModel>) {
    const state = await this.trackingService.enable();
    console.log(state);
  }

  //** End Enable Tracking */

  //*********************************** *****************************************//

  //** Start Watching Tracking Locations Actions */
  @Action(TrackingStartWatchingAction)
  async TrackingStartWatchingAction(
    { dispatch, getState, patchState }: StateContext<TrackingStateModel>,
    { payload }: TrackingStartWatchingAction,
  ) {
    const IS_TRACKING = getState().IS_TRACKING;
    if (IS_TRACKING) return;
    const repo = this.databaseService.getTrajectRepository();
    const userRepo = this.databaseService.getUserRepository();
    const subject = await this.trackingService.start();
    if (subject) {
      dispatch(new TrackingBackgroundStartAction());
      subject.subscribe(
        (location) => {
          dispatch(new TrackingStartWatchingSuccessAction(location));
        },
        (error) => {
          dispatch(new TrackingStartWatchingFailAction(error));
        },
      );
      let traject = repo.create();
      traject.user_id = payload._id;
      traject = await repo.save(traject);

      patchState({ IS_TRACKING: true, TRAJECT: traject });
    }
  }

  @Action(TrackingStartWatchingSuccessAction)
  async TrackingStartWatchingSuccessAction(
    { dispatch, getState, patchState }: StateContext<TrackingStateModel>,
    { payload }: TrackingStartWatchingSuccessAction,
  ) {
    dispatch(new TrackingSaveLocationAction(payload));
  }

  @Action(TrackingStartWatchingFailAction)
  async TrackingStartWatchingFailAction(
    { dispatch, getState, patchState }: StateContext<TrackingStateModel>,
    { payload }: TrackingStartWatchingFailAction,
  ) {
    patchState({ IS_TRACKING: false });
    dispatch(new TrackingBackgroundStopAction());
  }

  @Action(TrackingStartWatchingCompleteAction)
  async TrackingStartWatchingCompleteAction({
    dispatch,
    getState,
    patchState,
  }: StateContext<TrackingStateModel>) {
    patchState({ IS_TRACKING: false });
    dispatch(new TrackingBackgroundStopAction());
  }

  @Action(TrackingContinueTrackingAction)
  async TrackingContinueTrackingAction({
    dispatch,
    getState,
    patchState,
  }: StateContext<TrackingStateModel>) {
    let traject = await this.databaseService
      .getTrajectRepository()
      .createQueryBuilder()
      .orderBy('startedAt', 'DESC')
      .execute();
    if (traject.length == 0) {
      dispatch(new TrackingStopWatchingAction());
      return;
    }
    console.log('Traject', traject);
    const subject = await this.trackingService.start();

    if (subject) {
      subject.subscribe(
        (location) => {
          dispatch(new TrackingStartWatchingSuccessAction(location));
        },
        (error) => {
          dispatch(new TrackingStartWatchingFailAction(error));
        },
      );

      patchState({ IS_TRACKING: true, TRAJECT: traject });
    }
  }
  //** End Watching Tracking Locations Actions */

  //*********************************** *****************************************//

  @Action(TrackingStopWatchingAction)
  async TrackingStopWatchingAction({
    dispatch,
    getState,
    patchState,
  }: StateContext<TrackingStateModel>) {
    const state = getState();
    const IS_TRACKING = state.IS_TRACKING;
    const TRAJECTS = state.TRAJECTS;
    if (!IS_TRACKING) {
      patchState({
        IS_TRACKING: false,
        TRAJECT: null,
      });
      return;
    }
    await this.trackingService.stop();
    const repo = this.databaseService.getTrajectRepository();
    const traject = await repo.findOneOrFail({
      where: { id: getState().TRAJECT.id },
    });
    traject.endAt = new Date();
    patchState({
      IS_TRACKING: false,
      TRAJECT: null,
      TRAJECTS:
        TRAJECTS && TRAJECTS.length == 0
          ? [await repo.save(traject)]
          : [...TRAJECTS, await repo.save(traject)],
    });
  }

  @Action(TrackingSaveLocationAction)
  async TrackingSaveLocationAction(
    { dispatch, getState, patchState }: StateContext<TrackingStateModel>,
    { payload }: TrackingSaveLocationAction,
  ) {
    try {
      const traject = getState().TRAJECT;
      const repo = this.databaseService.getLocationRepository();
      const location = repo.create();
      Object.keys(payload.coords).forEach((key) => {
        location[key] = payload.coords[key];
      });
      location.trajectId = traject.id;
      await repo.save(location);
    } catch (e) {
      await this.trackingService.stop();
      patchState({ IS_TRACKING: false, TRAJECT: null });
    }
  }
  @Action(TrackingGetAllTrajectAction)
  async TrackingGetAllTrajectAction(
    { dispatch, getState, patchState }: StateContext<TrackingStateModel>,
    { payload }: TrackingGetAllTrajectAction,
  ) {
    const myTraject = getState().TRAJECT;
    let trajects: TrajectModel[] = [];
    try {
      const repo = await this.databaseService.getTrajectRepository();
      trajects = await repo.find({ where: { user_id: payload } });
    } catch (e) {
    } finally {
      if (myTraject) {
        trajects = trajects.filter((traject) => traject.id != myTraject.id);
      }
      patchState({
        TRAJECTS: trajects,
      });
    }
  }

  @Action(TrackingDeleteTrajectAction)
  async TrackingDeleteTrajectAction(
    { dispatch, getState, patchState }: StateContext<TrackingStateModel>,
    { payload }: TrackingDeleteTrajectAction,
  ) {
    const repo = this.databaseService.getTrajectRepository();
    let trajects = await repo.delete(payload.id);
    this.databaseService
      .getLocationRepository()
      .createQueryBuilder()
      .delete()
      .where('trajectId = :trajectId', { trajectId: payload.id })
      .execute();
    dispatch(new TrackingGetAllTrajectAction(payload.user_id));
  }

  @Action(TrackingSendTrajectAction)
  async TrackingSendTrajectAction(
    { dispatch, getState, patchState }: StateContext<TrackingStateModel>,
    { payload }: TrackingSendTrajectAction,
  ) {
    const userRepo = this.databaseService.getUserRepository();
    const locationRepo = this.databaseService.getLocationRepository();
    const trajectRepo = this.databaseService.getTrajectRepository();
    const user = await userRepo.findOne({ where: { _id: payload.user_id } });
    const locations = await locationRepo.find({
      where: { trajectId: payload.id },
    });
    const traject = payload;

    const result = await this.emailSevice.send(
      JSON.stringify({
        user,
        traject,
        locations,
      }),
    );
    if (result == 'OK') {
      let traject = await trajectRepo.findOne({ where: { id: payload.id } });
      traject.uploaded = true;
      await trajectRepo.save(traject);
      dispatch(new TrackingGetAllTrajectAction(user._id));
    }
  }

  @Action(TrackingBackgroundStartAction)
  async TrackingBackgroundStartAction(
    { dispatch, getState, patchState }: StateContext<TrackingStateModel>,
    { payload }: TrackingSendTrajectAction,
  ) {
    this.backgroundMode.enable();
    BackgroundGeolocation.setConfig({ stopOnTerminate: false });
  }

  @Action(TrackingBackgroundStopAction)
  async TrackingBackgroundStopAction(
    { dispatch, getState, patchState }: StateContext<TrackingStateModel>,
    { payload }: TrackingSendTrajectAction,
  ) {
    this.backgroundMode.disable();
    BackgroundGeolocation.setConfig({ stopOnTerminate: true });
  }
}
