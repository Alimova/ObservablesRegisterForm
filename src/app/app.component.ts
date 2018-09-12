import { Component, OnInit, AfterViewInit, Injectable, ElementRef, ViewChild } from '@angular/core';
import { Observable, fromEvent, combineLatest } from 'rxjs';
import { map, debounceTime, filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

@Injectable()

export class AppComponent  {
  public formControls = [];
  displayMessage = '';
  private credentials = {
    email: '',
    password: '',
  }
  formValid: boolean = false;
  @ViewChild('email') email: ElementRef<HTMLInputElement>;
  @ViewChild('password') password: ElementRef<HTMLInputElement>;
  @ViewChild('confirmation') confirmation: ElementRef<HTMLInputElement>;
  private errors = {
    email: [
      {
        type: 'pattern',
        message: 'wrong mail format',
        // validate(email): boolean {
        //   return email.match('^[\\w\\.]+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$');
        // }
      },
      {
        type: 'required',
        message: 'email is required'
      }
    ],
    password: [
      {
        type: 'minlength',
        message: 'too short password',
        // validate(pass): boolean {
        //   return pass.length > 3;
        // }
      },
      {
        type: 'required',
        message: 'password is required'
      }
    ],
    confirmation: [{
      type: '',
      message: 'passwords do not match',
      // validate(pass, confirm): boolean {
      //   return pass === confirm;
      // }
    }]
  };

  ngOnInit() {
    this.formControls.push(this.email.nativeElement);
    this.formControls.push(this.password.nativeElement);
    this.formControls.push(this.confirmation.nativeElement);
  }

  ngAfterViewInit() {
    const controlBlurs: Observable<any>[] = this.formControls
      .map(formControl => fromEvent(formControl, 'mouseout'));

    const email$ = controlBlurs[0].pipe(
      debounceTime(100),
      map((event) => event['target'].value)
    );
    const pass$ = controlBlurs[1].pipe(
      debounceTime(100),
      map(event => event['target'].value)
    );
    const confirm$ = controlBlurs[2].pipe(
      debounceTime(100),
      map(event => event['target'].value)
    );

    combineLatest(
        email$,
        pass$,
        confirm$,
    )
      .pipe(map(([email, pass, confirm]) => ({email: email, pass: pass, confirm: confirm})))
      .subscribe(res => {
        this.displayMessage = '';
         if (
          !res.email.match('^[\\w\\.]+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$')
          && res.email.length
        ) {
          this.displayMessage = 'wrong mail format';
        } else {
          if (res.pass.length && res.pass.length < 4) {
            this.displayMessage = 'too short password';
           } else {
            if (
              res.pass !== res.confirm
              && res.pass.length
              && res.confirm.length
            ) {
             this.displayMessage = 'passwords do not match';
            } else {
              this.displayMessage = '';
              this.formValid = true;
              this.credentials = {email: res.email, password: res.pass};
            }
          }
        }
      });
  }

  register() {
    alert(`
        Registration complete
        email: ${this.credentials.email},
        password: ${this.credentials.password}
    `);
  }

}
