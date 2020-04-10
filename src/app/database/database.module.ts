import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatabaseService } from './services/database.service';
export function init_database(databaseervice: DatabaseService) {
  return () => databaseervice.initialize();
}
@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [DatabaseService],
  exports: [],
})
export class DatabaseModule {}
