import { Component, OnInit, AfterViewInit, ElementRef, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/reduce';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

@Injectable()

export class AppComponent {
  public formValid = false;
  public formControls = [];
  displayMessage = [];
  subject = new Subject();

  private form = {
    email: {
      value: '',
      valid: false,
      errorMessage: 'wrong mail format',
      validate(val): boolean {
        return val.email.value.match('^[\\w\\.]+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$');
      }
    },
    password: {
      value: '',
      valid: false,
      errorMessage: 'too short password',
      validate(val): boolean {
        return val.password.value.length > 3;
      }
    },
    confirmation: {
      value: '',
      valid: false,
      errorMessage: 'passwords do not match',
      validate(val): boolean {
        return val.password.value === val.confirmation.value;
      }
    }
  };

  ngOnInit() {
    this.formControls.push(document.querySelector('#email'));
    this.formControls.push(document.querySelector('#password'));
    this.formControls.push(document.querySelector('#confirmation'));
  }

  ngAfterViewInit() {
    const controlBlurs: Observable<any>[] = this.formControls
      .map(formControl => Observable.fromEvent(formControl, 'blur'));

    Observable.merge(...controlBlurs).debounceTime(1000).subscribe(event => {
      const val = this.form[event.target.id];
      val.value = event.target.value;
      val.valid = val.validate(this.form) ? true : false;
      if(!val.valid) {
        this.displayMessage[event.target.id] = val.errorMessage;
      } else {
        delete this.displayMessage[event.target.id];
      }
      this.formValid = !!this.form.email.value && !!this.form.password.value && !!this.form.confirmation.value;
    });
  }

  register() {
    const credentials = `email: ${this.form.email.value}, password: ${this.form.password.value}`;
    alert(
      this.form.email.valid && this.form.password.valid && this.form.confirmation.valid
      ? `Registration complete ${credentials}`
      : this.displayMessage['email'] || this.displayMessage['password'] || this.displayMessage['confirmation']
    );
  }

}
