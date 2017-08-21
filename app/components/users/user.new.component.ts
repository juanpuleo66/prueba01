import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, ActivatedRoute} from '@angular/router';
import {LoginService} from '../../services/login.service';
import {UserService} from '../../services/users/user.services';
import {globalVariables} from '../../global';
import {User} from '../../model/user'; 

@Component({
  selector: 'register',
  templateUrl: 'app/views/users/user.new.html',
  directives: [ROUTER_DIRECTIVES],
  providers:[LoginService, UserService]
})

export class UserRegisterComponent implements OnInit{

  public titulo = "New User";
  public user: User;
  public userRegistered: User;
  public errorMessage;
  public status;
  public msg;
  public emailVerify;
  public passwordVerify;
  public response;
  public code; 
  public url = globalVariables['url_user_image'];
  public identity;

  public userGroups;
  public idGroup;

  public pageActual;
  public searchUser;
  public page;
  public itemsPerPage;
  public loading;


  constructor(
   private _loginService: LoginService,
   private _userService: UserService,
   private _route: ActivatedRoute,
   private _router: Router           
   ){}

  ngOnInit(){

    this.loading = 'show'; 
    this.identity = this._loginService.getIdentity();
    if(this.identity==null){
      this._router.navigate(["/index"]);
    } else {
     this.getUser();
     this.getUserGroups();
     this.clearFormUser();
     
   }
 } 

 getUser(){
//console.warn('C-1:script.new.componenet.ts-getScript');   
    this._route.params.subscribe(params => {
      let id = +params["id"];
      let pageActual = +params["pageActual"];
      this.pageActual = pageActual;
      let itemsPerPage = params["itemsPerPage"];
      this.itemsPerPage = itemsPerPage;
      let searchString = params["search"];
       
      if ( !searchString || searchString.trim().length == 0 ){
        this.searchUser = null;
      } else {
        this.searchUser = searchString;
      }
    });
console.log('this.itemsPerPage: '+this.itemsPerPage);
 } 

getUserGroups(){
  let token = this._loginService.getToken();

  this._userService.getUserGroups(token).subscribe(
    response => {
      this.status = response.status;

      if ( this.status != "success" ){
        this.loading = 'hide';
        this.code = response.code;
        this.msg = response.msg;           
      } else {

        this.userGroups = response.data;
        this.idGroup = this.userGroups[0].id;       
      }         
    },
    error => {
      this.errorMessage = <any>error;

      if (this.errorMessage != null){
        alert('Error: '+this.errorMessage);
      }
    });    
  }
  
  onSubmit(){
    this.loading = 'show';
   //this.checkSesion();
    
    if ( this.emailVerify==this.user.email&&this.passwordVerify==this.user.password ) {
      this.loading = 'show'; 
      this.user.idGroup = this.idGroup;
      this._userService.register(this.user,this._loginService.getToken()).subscribe(
        response=>{
          this.status = response.status;
          this.msg = response.msg;
          this.code = response.code;
          
          if ( this.status=="success" ) {
            this.userRegistered = this.user;
            
            if ( this.searchUser == null ) {
              this._router.navigate(['/users', this.pageActual]);
            } else {
              this._router.navigate(['/users', this.pageActual, this.searchUser]);
            }
            this.loading = 'hide';
          } else {
            this.loading = 'hide';
          }
        },
        error=>{this.errorMessage = <any>error;
           
          if ( this.errorMessage != null ) {
            console.log(this.errorMessage);         
          } 
        })
    } else {

      if ( this.emailVerify==this.user.email ) {
        this.code = "400";
        this.msg = "Data is wrong verify password values these need be the same. Thank you"
        this.status="error";
      } else {
        this.code = "400";
        this.msg = "Data is wrong verify email values these need be the same. Thank you"
        this.status="error";
      }
      this.loading = 'hide';
    }
  }

  clearFormUser() {
    this.user = new User(1,"user","","","","",null,-1,"");
    this.passwordVerify="";
    this.emailVerify="";
    this.loading = 'hide';
  }

  public filesToUpload:Array<File>;
  public resultUpload;

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;

    if ( this.filesToUpload.length>0 ) {
      document.getElementById("upload-progress-bar").setAttribute("value","100");
      document.getElementById("upload-progress-bar").setAttribute("aria-valuenow","100");
      document.getElementById("upload-progress-bar").style.width = "100%";
    } else {
      document.getElementById("upload-progress-bar").setAttribute("value","0%");
      document.getElementById("upload-progress-bar").setAttribute("aria-valuenow","0%");
      document.getElementById("upload-progress-bar").style.width = "0%";
    } 
  }

}
