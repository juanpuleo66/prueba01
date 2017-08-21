import {Component, OnInit, Input} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, ActivatedRoute} from '@angular/router';
import {LoginService} from '../../services/login.service';
import {UserService} from '../../services/users/user.services';
import {UploadService} from '../../services/users/upload.services';
import {User} from '../../model/user'; 
import {globalVariables} from '../../global';


@Component({
  selector: 'editUser',
  templateUrl: 'app/views/users/user.edit.html',
  directives: [ROUTER_DIRECTIVES],
  providers:[LoginService, UserService, UploadService]

})

export class UserEditComponent implements OnInit {

  public titulo = "Edit User";

  public errorMessage;
  public status;
  public code;
  public msg;
  
  public user: User;
  public userUpdated: User;
  public emailVerify;
  public passwordVerify;
  public response;
  public url = globalVariables['url_user_image'];
  public identity;
  public id;

  public pageActual;
  public searchUser;
  public page;
  public itemsPerPage;
  public loading;

  public userGroups;
  public idGroup;

  constructor(
    private _loginService: LoginService,
    private _userService: UserService,
    private _uploadService: UploadService,
    private _route: ActivatedRoute,
    private _router: Router

    ){}

  ngOnInit(){  
    this.clearFormUser();
    this.identity = this._loginService.getIdentity();
    if(this.identity==null){
      this._router.navigate(["/index"]);
    } else {

      this.getUser();
      this.getUserGroups();
    }

  }

  getUserGroups(){


    let token = this._loginService.getToken();

    this._userService.getUserGroups(token).subscribe(
      response => {
        //this.status = response.status;

        if ( response.status != "success" ){
          this.loading = 'hide';
          this.code = response.code;
          this.msg = response.msg;           
        } else {

          this.userGroups = response.data;


        }         
      },
      error => {
        this.errorMessage = <any>error;

        if (this.errorMessage != null){
          alert('Error: '+this.errorMessage);
        }
      }
      );    
  }
  getUser(){
    //console.warn('C-1:script.edit.componenet.ts-getScript');    
    this.loading = 'show';

    this._route.params.subscribe(params => {
      let id = params["id"];
      this.id = id;
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

      if(id!=undefined){
        this.getDataUser(+id);     
      }

      else{
        this.getDataUser(this.identity.sub); 
      }
    });
  }

  clearFormUser(){
    this.idGroup=-1;
    this.user = new User(1,"","","","","",null,-1,"");
    this.userUpdated = new User(1,"","","","","",null,-1,"");
    this.filesToUpload = new Array<File>();
    this.status=null;
  }

  onSubmit(){
   //this.checkSesion();
    this.loading = 'show';
    if(this.emailVerify==this.user.email&&this.passwordVerify==this.user.password){
      
      let token = this._loginService.getToken();     
      this.user.idGroup = this.idGroup;

      this._userService.edit(this.user,token,this.id).subscribe(
        response=>{

          if(response.status=="success"){
            
            this.status=response.status;

            let url = globalVariables['base_api_url']+"/users/upload-image-user";
            this.passwordVerify = "**********";
            this.user.password = "**********";
            this.userUpdated.name = this.user.name;
            this.userUpdated.surname = this.user.surname; 
            if(this.filesToUpload.length>0){

              this._uploadService.makeFileRequest(token,url,['image'], this.filesToUpload,this.id).then(
                (result)=>{
                  this.resultUpload = result;
                  if(this.resultUpload.status=="success"){
                    this.user.image = this.resultUpload.user_details.image; 

                  }
                  // window.location.href = "/";  CAMBIAR VALORES DE LA CABECERA SIN EJECUTAR LA SENTENCIA ANTERIOR
                },
                (error)=>{console.log(error)}

                );

            }

           

            if ( this.searchUser == null) {
              if(this.id != undefined)
                 this._router.navigate(['/users', this.pageActual]);
               else
                  this._router.navigate(['/']);
            } else {
               if(this.id != undefined)
                 this._router.navigate(['/users', this.pageActual, this.searchUser]);
                else
                  this._router.navigate(['/']);
            }

           
          } else {
             this.status=response.status;
             this.msg=response.msg;
             this.code = response.code;
          }
          this.loading = 'hide';
         
        },
        error=>{this.errorMessage = <any>error;

          if(this.errorMessage != null){
            console.log(this.errorMessage);         
          } 
        })

    } else{
      if(this.emailVerify==this.user.email){
        this.code = "400";
        this.msg = "Data is wrong verify password values these need be the same. Thank you"
        this.status="error";
        
      }else{
         this.code = "400";
         this.msg = "Data is wrong verify email values these need be the same. Thank you"
         this.status="error";
         
       }
       this.loading = 'hide';
    }

  }


  getDataUser(id){
    let token = this._loginService.getToken();
    this._userService.getUserById(id,token).subscribe(
      response=>{

        this.response = response;
        this.code = this.response.code;
        if(this.response.status=="success"){

          this.user.id = this.response.user_details.id;
          this.user.name = this.response.user_details.name;
          this.user.surname = this.response.user_details.surname;
          this.user.email = this.response.user_details.email;
          this.user.password = this.response.user_details.password;
          this.user.image = this.response.user_details.image;
          this.user.role = this.response.user_details.role;
          this.user.idGroup = this.response.user_details.idGroup;
          this.passwordVerify = this.response.user_details.password;
          this.emailVerify = this.response.user_details.email;
          this.idGroup = this.user.idGroup;
          this.loading = 'hide';

        }
      },
      error=>{this.errorMessage = <any>error;

        if(this.errorMessage != null){
          console.log(this.errorMessage);         
        } 
      })

  }

  public filesToUpload:Array<File>;
  public resultUpload;

  fileChangeEvent(fileInput: any){

    this.filesToUpload = <Array<File>>fileInput.target.files;
    if(this.filesToUpload.length>0){
      document.getElementById("upload-progress-bar").setAttribute("value","100");
      document.getElementById("upload-progress-bar").setAttribute("aria-valuenow","100");
      document.getElementById("upload-progress-bar").style.width = "100%";
    } else{
      document.getElementById("upload-progress-bar").setAttribute("value","0%");
      document.getElementById("upload-progress-bar").setAttribute("aria-valuenow","0%");
      document.getElementById("upload-progress-bar").style.width = "0%";
    } 
  }


}
