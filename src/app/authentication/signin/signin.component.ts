import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "src/app/core/service/auth.service";
import { AESService } from 'src/app/private/services/AES/aes'
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../core/states/auth.states';
import * as AuthActions from '../core/states/login/auth.actions';
import { User } from '../core/models/user';
import { LoginForm } from '../core/models/login-form';

@Component({
  selector: "app-signin",
  templateUrl: "./signin.component.html",
  styleUrls: ["./signin.component.scss"],
})
export class SigninComponent

  implements OnInit
{
  authForm: FormGroup;
  loading = false;
  error = "";
  hide = true;



  submitted = false;
  user: User = new User();
  errorMessage?: string | null;
  getState: Observable<any>;
  submitBtn?: string;
  isLoadingBtn?: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private aes:AESService,
    private authService: AuthService,
    private store: Store<fromApp.PublicAppState>
  ) {
    // super();
    this.getState = this.store.select('auth');
  }

  ngOnInit() {
    this.store.dispatch( AuthActions.clearData() )
    this.getState.subscribe((state) => {
      this.errorMessage = state.errorMessage;
      this.user = state.user;
      this.submitted = state.submitBtn;
      this.loading = state.isLoadingBtn;
    });

    this.authForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    });

  }
  get f() {
    return this.authForm.controls;
  }

  adminSet() {
    this.authForm.get("username").setValue("admin@hospital.org");
    this.authForm.get("password").setValue("admin@123");
  }
  doctorSet() {
    this.authForm.get("username").setValue("doctor@hospital.org");
    this.authForm.get("password").setValue("doctor@123");
  }
  patientSet() {
    this.authForm.get("username").setValue("patient@hospital.org");
    this.authForm.get("password").setValue("patient@123");
  }

  onSubmit() {
    this.submitted = true;
    this.loading = true;
    this.error = "";

    if (this.authForm.invalid) {
      this.error = "Username and Password not valid !";
      return;
    }



    setTimeout(() => {
      let payload = new LoginForm()
   
      let ivgen=this.aes.generateKey(16,this.aes.iv)
      let ivgen2=this.aes.generateKey(16,this.aes.iv2)
      let key=this.aes.generateKey(16,this.aes.keyGen)

      let pas=this.aes.encrypt(this.f.password.value,key,ivgen2,128)
      let username=this.aes.encrypt(this.f.username.value,key,ivgen,128)
    
      payload.passakun = pas+''+ivgen2;
      payload.nameakun = username+''+ivgen;

      this.store.dispatch(
        AuthActions.login({ payload: payload })
      );
    }, 1000);

    /**
    else {
      this.subs.sink = this.authService
        .login(this.f.username.value, this.f.password.value)
        .subscribe(
          (res) => {

            if (res) {
              console.log(res)
              // setTimeout(() => {
              //   const role = this.authService.currentUserValue.role;
              //   if (role === Role.All || role === Role.Admin) {
              //     this.router.navigate(["/admin/dashboard/main"]);
              //   } else if (role === Role.Doctor) {
              //     this.router.navigate(["/doctor/dashboard"]);
              //   } else if (role === Role.Patient) {
              //     this.router.navigate(["/patient/dashboard"]);
              //   } else if (role === Role.Demo) {
              //     this.router.navigate(["/demo/dashboard"])
              //   } else {
              //     this.router.navigate(["/authentication/signin"]);
              //   }
              //   this.loading = false;
              // }, 1000);
            } else {
              this.error = "Invalid Login";
            }
          },
          (error) => {
            console.log({
              error : error
            })
            this.error = error;
            this.submitted = false;
            this.loading = false;
          }
        );
    }
     */
  }
}
