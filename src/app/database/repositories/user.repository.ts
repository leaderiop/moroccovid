import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Subject } from 'rxjs';
import { DatabaseService } from '../services/database.service';
import { Connection } from 'typeorm';
@Injectable({
  providedIn: 'root',
})
export class TrajectRepository {
  constructor(
    private platform: Platform,
    private readonly databaseService: DatabaseService,
  ) {}
}
