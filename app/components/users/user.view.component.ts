import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, ActivatedRoute} from '@angular/router';
import {LoginService} from '../../services/login.service';
import {UserService} from '../../services/users/user.services';
import {User} from '../../model/user'; 
import {globalVariables} from '../../global';



@Component({
  selector: 'viewUser',
  templateUrl: 'app/views/users/user.view.html',
  directives: [ROUTER_DIRECTIVES],
  providers:[LoginService, UserService]
})

export class UserViewComponent implements OnInit {

  public titulo;
 
  public errorMessage;
  public status;
  public code;
  public msg;
  
  public user: User;
  public groupUser;
  public response;
  public url = globalVariables['url_user_image'];
  public identity;
  public id;
 
  public pageActual;
  public searchUser;
  public page;
  public itemsPerPage;
  public loading;
  public searchString; 
  
  constructor(
   private _loginService: LoginService,
   private _userService: UserService,
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

   }

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
        this.searchString = null;
      } else {
        this.searchString = searchString;
      }
      
      if(id!=undefined){
         this.getDataUser(+id);     
      }
      
      else{
       this.getDataUser(this.identity.subEncrypted); 
      }
    });
  }

 clearFormUser(){
  
   this.user = new User(1,"","","","","",null,-1,"");
   this.status=null;
 }

getDataUser(id){
  let token = this._loginService.getToken();
  this._userService.getUserById(id,token).subscribe(
   response=>{

    this.response = response;
    this.code = this.response.code;
    if(this.response.status=="success"){

     this.groupUser = this.response.group_user
     this.user.id = this.response.user_details.id;
     this.user.name = this.response.user_details.name;
     this.user.surname = this.response.user_details.surname;
     this.user.email = this.response.user_details.email;
     this.user.password = this.response.user_details.password;
     this.user.image = this.response.user_details.image;
     this.user.role = this.response.user_details.role;
     this.titulo = "View User";
     this.loading = 'hide';

   }else{
    this.msg = this.response.msg;
   
  }
},
error=>{this.errorMessage = <any>error;

  if(this.errorMessage != null){
   console.log(this.errorMessage);         
 } 
})

}



}
