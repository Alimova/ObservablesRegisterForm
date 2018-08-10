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
  private form = {
    email: {
      value: '',
      hasValue: false,
      valid: false,
      validate(val): boolean {
        return !!val.email.value.match('^[\\w\\.]+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$')
      }
    },
    password: {
      value: '',
      hasValue: false,
      valid: false,
      validate(val): boolean {
        return val.password.value.length > 3
      }
    },
    confirmation: {
      value: '',
      hasValue: false,
      valid: false,
      validate(val): boolean {
        return val.password.value == val.confirmation.value
      }
    }
  }

  onBlurMethod(target) {
    let val = this.form[target.id]
    val.value = target.value;
    val.valid = val.validate(this.form) ? true : false;
  }

  register() {}

}
