import { Location } from 'cordova-background-geolocation-lt';
import { UserModel } from '../models/user.model';
import { TrajectModel } from 'src/app/database/models/traject.model';
export class TrackingConfigureAction {
  static readonly type = '[Tracking] Configure';
  constructor() {}
}

export class TrackingWatchStateAction {
  static readonly type = '[Tracking] Watch State';
  constructor() {}
}

export class TrackingStartWatchingAction {
  static readonly type = '[Tracking] Start watching';
  constructor(public readonly payload: UserModel) {}
}

export class TrackingStartWatchingSuccessAction {
  static readonly type = '[Tracking] Start watching Success';
  constructor(public readonly payload: Location) {}
}
export class TrackingStartWatchingFailAction {
  static readonly type = '[Tracking] Start watching Fail';
  constructor(public readonly payload: any) {}
}
export class TrackingStartWatchingCompleteAction {
  static readonly type = '[Tracking] Start watching Complete';
  constructor() {}
}

export class TrackingStopWatchingAction {
  static readonly type = '[Tracking] Stop watching';
  constructor() {}
}

export class TrackingSaveLocationAction {
  static readonly type = '[Tracking] Save Location';
  constructor(public readonly payload: Location) {}
}
export class TrackingSaveLocationSuccessAction {
  static readonly type = '[Tracking] Save Location Success';
  constructor() {}
}

export class TrackingSaveLocationFailAction {
  static readonly type = '[Tracking] Save Location Fail';
  constructor() {}
}

export class TrackingEnableAction {
  static readonly type = '[Tracking] Enable';
  constructor() {}
}

export class TrackingEnableSuccessAction {
  static readonly type = '[Tracking] Enable Success';
  constructor() {}
}

export class TrackingEnableFailAction {
  static readonly type = '[Tracking] Enable Fail';
  constructor() {}
}

export class TrackingGetAllTrajectAction {
  static readonly type = '[Tracking] Get All Trajects';
  constructor(public readonly payload: string) {}
}

export class TrackingDeleteTrajectAction {
  static readonly type = '[Tracking] Delete Traject';
  constructor(public readonly payload: TrajectModel) {}
}

export class TrackingSendTrajectAction {
  static readonly type = '[Tracking] Send Traject';
  constructor(public readonly payload: TrajectModel) {}
}

export class TrackingContinueTrackingAction {
  static readonly type = '[Tracking] Continue Tracking';
  constructor() {}
}

export class TrackingBackgroundStartAction {
  static readonly type = '[Tracking] Background Start';
  constructor() {}
}

export class TrackingBackgroundStopAction {
  static readonly type = '[Tracking] Background Stop';
  constructor() {}
}
