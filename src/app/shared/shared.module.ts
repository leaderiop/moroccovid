import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormInputComponent } from './form-input/form-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginPageRoutingModule } from '../pages/login/login-routing.module';

@NgModule({
  declarations: [FormInputComponent],
  imports: [
    CommonModule,
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
  ],
  exports: [FormInputComponent],
})
export class SharedModule {}
