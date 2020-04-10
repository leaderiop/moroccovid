import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Subject } from 'rxjs';

import {
  createConnection,
  Connection,
  getRepository,
  Repository,
} from 'typeorm';
import { UserModel } from '../models/user.model';
import { TrajectModel } from '../models/traject.model';
import { LocationModel } from '../models/location.model';
@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private connection: Connection;
  constructor(private platform: Platform) {}

  async initialize() {
    await this.platform.ready();
    this.connection = await createConnection({
      type: 'cordova',
      database: 'test',
      location: 'default',
      logging: ['error', 'query', 'schema'],
      synchronize: true,
      entities: [UserModel, TrajectModel, LocationModel],
    });

    console.log('DATABASE GOT INITALIZED');
  }

  getUserRepository() {
    return getRepository('user') as Repository<UserModel>;
  }
  getTrajectRepository() {
    return getRepository('traject') as Repository<TrajectModel>;
  }
  getLocationRepository() {
    return getRepository('location') as Repository<LocationModel>;
  }
}
