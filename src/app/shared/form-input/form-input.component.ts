import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.scss'],
})
export class FormInputComponent implements OnInit {
  @Input() controler: FormControl;
  @Input() placeHolder: string;
  @Input() validationMessages: any;
  @Input() type?: string = 'text';
  keys = Object.keys;
  constructor() {}

  ngOnInit() {}
}
