import { OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
//import { Router} from '@angular/router';

import { Match, User } from './interfaces';
import { SharedComponents } from './shared.components';
import { UserService } from './user';
import { GlobalService } from './global';
import { StompService } from 'ng2-stomp-service';
import { ApiService } from './api';
import { Config } from '../app/app.config';


declare var $;

@Injectable()
export class MatchService{

	public match : Match
	private user : User

	constructor(
		private sharedComponents: SharedComponents,
		private stomp: StompService,
		private userService : UserService,
		private apiService: ApiService,
		private config: Config,
		private globalService : GlobalService,
		//private router : Router
	){

		/**
  	 * Default
  	 */
		this.match = {
			slug : ''
		}


	}

	public initSubscribes(){
		this.user = this.userService.user;

		/**
		 * User subscibe
		 */
		this.stomp.subscribe('/user/messages/match/'+ this.match.slug +'/info',(data) => {
			this[data.action](data);
			this.stomp.done('matchInfoUser');
		});

		/**
		 * Global subscribe
		 */
		this.stomp.subscribe('/topic/match/'+ this.match.slug +'/pool',(data) => {
			this[data.action](data);
		})
		
		this.getMatchInfo();
	}

	public getMatchInfo(){
		this.apiService
      .get(this.config.get('appBase')+'/api/match/info?slug='+this.match.slug, {})
      .subscribe(
        response => {
        	this.stomp.done('matchInfoUser');
        	this.ACTION_FETCH_MATCH_INFO(response);
        	console.log(response)
        }
      );
	}


	/**
	 * Live emotion action
	 */
	private liveSupportAction(data){
		let me = false;
		if(data.userId == this.user.id) me = true;
		
		$('.sldp_player_wrp').flyIcons('letsFly',{
			'iconSrc':this.config.get('imageServer') + data["logo"],
			'me':me
		});

	}

	private liveOnlineUsers(data){
		this.sharedComponents.emit('rRegistered','updateOnlineUserNum',data.users);
	}


	/**
	 * Quiz publish action
	 */
	private competitionPublishedAction(data){
		this.sharedComponents.emit('cIndex','loadQuiz',data.competition);
  	this.sharedComponents.emit('hBotBox', 'showBot', {botName:'quizStarted'});
  	setTimeout(()=>{
  		let sH = $('#center-area .mCSB_dragger').height();
  		if(this.globalService.globals.mainNav.active != 'clearComponent'){
  			this.user.notifications.main = 1;
  		}else if (sH < 695 && sH != 0 ){
  			$('.scrollDownArrow').show();
  		}
  	},100)
	}


	/**
	 * Quiz update
	 */
	private competitionUpdate(data){
		this.sharedComponents.emit('cQuiz', 'updateQuizData', data.competition);
	}


	/**
	 * Quiz complate
	 */
	private competitionComplete(){
		this.sharedComponents.emit('hBotBox', 'showBot',{botName:'quizResult'});
		//??
		this.apiService
      .get(this.config.get('appBase')+'/api/users/me/notifications', {})
      .subscribe(
        response => {
        	this.user.notifications.log = response.count
        }
      );
	}

	/**
   * Users live list actions
   */
	private matchUsersAutocomplateAction(data){
		this.sharedComponents.emit('rChatFooter','usersAutocomplateResult',data.users);
	}

	private matchUsersSearchAction(data){
		this.sharedComponents.emit('rMatchUsers','searchUsersResult',data.users);
	}

	private matchUsersLoadmoreAction(data){
		this.sharedComponents.emit('rMatchUsers','loadMoreResult',data.users);
	}

	/**
	 * User pm and mention messages
	 */
	private getUserMessagesAction(data){
		this.sharedComponents.emit('rUserMsgs','getPmMentionMsgs',data);
	}

	/**
	 * Room creation action
	 */
	private roomCreationAction(data){
		this.sharedComponents.emit('chatS','buildRoomAction',data.room);
	}

	/**
	 * Receive match info
	 */
	private ACTION_FETCH_MATCH_INFO(data){
  	this.match = data.match;
  	this.sharedComponents.emit('cIndex','loadPlayer');


  	if(!this.userService.getChosenTeam()){
  		//this.router.navigate(['match/'+window['matchSlug']+'/choose-team']);
  	}
  	else if(
  		this.user.isLogged &&
  		!this.userService.getChosenVixname() &&
  		this.user.hasVixname &&
  		this.userService.getAuthStatus()){
  		//this.router.navigate(['match/'+window['matchSlug']+'/choose-name']);
  	}
  	// Build rooms
  	if(this.match.userRooms != null)
  		this.sharedComponents.emit('chatS','buildRoomsFromMatchInfo',this.match.userRooms);
  }


  /**
   * Send choose team 
   */
  public chooseSupportedTeam(data) {
    return this.apiService.post(
      this.config.get('apiBase') + '/match/chooseSupportedTeam',data);
  }


  //old

  // public sendChooseTeamRequest(data){
  // 	this.stomp.send('/app/ws/chat/global/' + this.match.slug + '/choose', data);
  // }


}