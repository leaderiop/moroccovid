import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Subject } from 'rxjs';
import { DatabaseService } from '../services/database.service';
@Injectable({
  providedIn: 'root',
})
export class LocationRepository {
  private positionSubject: Subject<Location>;
  constructor(
    private platform: Platform,
    private readonly databaseService: DatabaseService,
  ) {}
}
