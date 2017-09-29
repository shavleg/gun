import { Injectable, Injector} from '@angular/core';
//import { Router } from '@angular/router';
//import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';


import { User } from './interfaces';
import { SharedComponents } from './shared.components';
import { MatchService } from '../services/match';
import { StompService } from 'ng2-stomp-service';

import { ApiService } from './api';
import { Config } from '../app/app.config';
import { Scroll } from '../helper/dom';

import { Cookie } from 'ng2-cookies';


@Injectable()
export class UserService{

	public user : User

	constructor(
		//private route: ActivatedRoute,
		private sharedComponents: SharedComponents,
		private stomp: StompService,
		private config: Config,
		private apiService: ApiService,
		//private router: Router
	){

		/**
		 * Default props
		 */
		this.user = {
			//temp
			isLogged:false, rooms : [], dataLoaded: false
		}



		/**
		 * Subscribe user
		 */
		stomp.after('init').then(()=>{
    	stomp.subscribe('/user/messages/user/profile', (data) => {
			  
	    	this[data.action](data);
		    stomp.done('user');
		    this.user.dataLoaded = true;

      });
      stomp.done('userSub');
      
    })


	}

	public getUser(){
		this.stomp.send('/app/fetch/user/profile',{})
	}

	/**
	 * Authorized user
	 */
	private ACTION_FETCH_USER(data:any){
		// Set receieved user data to user object
		if (data.user != null) {
      this.user = data['user'];
      this.user.hasVixname = this.user.vixnames.length > 0;
      this.user.initData = { newChatMsg: 0, msgsRequest: false };
      this.setUserLogged(true);
  	} else {
      this.setUserLogged(false);
      return;
  	}

		// For facebook users
		if (!this.user.hasVixname) {
      this.sharedComponents.emit('rIndex','LoadUnregHeader');
      //this.router.navigate(['match/'+window['matchSlug']+'/enter-name']);
	    return;
	  }

		this.sharedComponents.emit('rIndex','LoadRegHeader');
	}

	private updateUserData(data){
		this.user[data.key] = data.value;
	}


	/**
	 * Temporary vixname registration
	 */
	private registerTemporaryVixname(data:any){
		this.user.vixnames.push(data.vixname);
		this.user.activeVixname = 1;
		this.sharedComponents.emit('cIndex','clearComponent',{target:'targetBody'});
	}


	/**
	 * Enter vixname register facebook user
	 */
	private registerVixnameAction(data){
		//??
		location.reload();
		//this.user.vixnames.push(data.vixname);
		//this.user.activeVixname = 0;
		//this.user.hasVixname = true
		//this.sharedComponents.emit('rIndex','LoadRegHeader');
		//this.scroll.prepare('#vix-chat-msgs .chat');
		//this.sharedComponents.emit('cIndex','clearComponent',{target:'targetBody'});
	}


	/**
	 * Vixname delete action
	 */
	private deleteTemporaryVixname(){
		this.user.vixnames.splice(1, 1);
	}


	/**
	 * Vixname change action
	 */
	private changeActiveVixname(){
    this.sharedComponents.emit('cIndex','clearComponent',{target:'targetBody'});
	}


	/**
	 * Unauthorized user
	 */
	private AccessIsDenied(){
		this.unauthorized();
	}

	/**
   * Unauthorized user
   */
  private unauthorized(){
  	this.sharedComponents.emit('rIndex','LoadUnregHeader');
  }


	/**
	 * Set user logged in or not
	 */
	public setUserLogged(arg:boolean):void{
		this.user.isLogged = arg;
	}


	/**
	 * Get chosen team object from local storage
	 */
	public getChosenTeam(){

		let item = localStorage.getItem('chosenTeam'+window['matchSlug'])

		if(item){
			return JSON.parse(item);
		}else{
			return null;
		}
		
	}

	/**
	 * Set chosen team object to local storage
	 */
	public setChosenTeam(obj){
		localStorage.setItem('chosenTeam'+window['matchSlug'], JSON.stringify(obj));
	}

	/**
	 * Remove chosen team object from local storage
	 */
	public removeChosenTeam(){
		localStorage.removeItem('chosenTeam'+window['matchSlug']);
		//this.router.navigate(['match/'+window['matchSlug']+'/choose-team']);
	}

	/**
	 * Get chosen vixname from local storage
	 */
	public getChosenVixname(){
		let chosenVixname = localStorage.getItem('chosenVixname');
		if(chosenVixname){
			return chosenVixname;
		}else{
			return null;
		}
	}

	/**
	 * Set chosen Vixname to local storage
	 */
	public setChosenVixname(){
		localStorage.setItem('chosenVixname','true');
	}

	/**
	 * Get getAuthStatus
	 */
	public getAuthStatus(){
		let returnedFromRegister = localStorage.getItem('returnedFromRegister');
		if(returnedFromRegister){
			return returnedFromRegister;
		}else{
			return null;
		}
	}

	/**
	 * Set setAuthStatus
	 */
	public setAuthStatus(){
		localStorage.setItem('returnedFromRegister','true');
	}


	/**
	 * Remove removeAuthStatus
	 */
	public removeAuthStatus(){
		localStorage.removeItem('returnedFromRegister');
	}


	/**
	 * User log out
	 */
	public logOut(){
		this.apiService
      .post(this.config.get('appBase') + '/auth/logout', {})
      .subscribe(null, null, () => {
      	//this.setUserLogged(false);
      	//this.removeChosenTeam()
        localStorage.removeItem('chosenVixname');
        localStorage.removeItem('getVixname');
        window.location.reload();
      });
	}


	
}