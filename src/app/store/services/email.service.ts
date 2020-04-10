import { Injectable } from '@angular/core';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  TO = 'cov-19@cloudvisioncorp.com';
  constructor(private emailComposer: EmailComposer) {}

  async send(data: string) {
    this.emailComposer.isAvailable().then((available: boolean) => {
      if (available) {
        //Now we know we can send
        console.log('is available');
      }
    });

    this.emailComposer.addAlias('gmail', 'com.google.android.gm');
    let email = {
      to: this.TO,
      subject: 'tracking info',
      body: data,
      app: 'gmail',
    };
    // Send a text message using default options
    return await this.emailComposer.open(email);
  }
}
