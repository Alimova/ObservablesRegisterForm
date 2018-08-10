import { Component, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

@Injectable()

export class AppComponent {
  public valid = new Subject<string>();
  public validators = {
    email:{
      hasValue: false,
      valid: false,
      validate(value): boolean {
        return true
      }
    },
    password: {
      hasValue: false,
      valid: false,
      validate(value): boolean {
        if (value.length > 3) { return true } else { return false }
      }
    },
    confirmation: {
      hasValue: false,
      valid: false,
      validate(value): boolean {
        return true
      },
    }
  }

  onBlurMethod(target) {
    console.log(`id: ${target.id}, val: ${target.value}`);
    this.validators[target.id].hasValue = target.value ? true : false;
    this.validators[target.id].valid = this.validators[target.id].validate(target.value) ? true : false;
  }

}
