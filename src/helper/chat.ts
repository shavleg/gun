import { Injectable, Injector } from '@angular/core';
import { Config } from '../app/app.config';

import { UserService } from '../services/user';
import { User } from '../services/interfaces';
import { StompService } from 'ng2-stomp-service';

declare var $;

@Injectable()

export class ChatHelper {

	private user : User

  constructor(
  	private config : Config,
  	private userService: UserService,
  	private stomp: StompService
  ){

  	stomp.after('user').then(()=>{
  		this.user = userService.user;
  	})
  }

  /**
   * Generate PM Mention message execution time
   */
  public setMsgExTime(){
  	return new Date(new Date().getTime() + 1000 * this.config.get('pmMentionExecutionTime')).getTime();
  }

  /**
   * Generate unic id
   */
  public getUnicId(){
  	let s4 = function(){
  		return Math.floor((1 + Math.random()) * 0x10000)
  	      .toString(16)
  	      .substring(1);
  	};
  	return s4() + s4() + '-' + s4() + '-' + s4();
  }


  /**
   * Create chat msg
   */
  public createMessage(data:any,exTime?:boolean){
  	
  	
  	let exTimeProp = 0;

  	if(exTime == true){
  		exTimeProp = this.setMsgExTime();
  	}

  	let mentionToMe = false;

  	if(data.mentionToIds){
  		for (var i = 0; i < data.mentionToIds.length; ++i) {
  			if(data.mentionToIds[i] == this.user.id){
  				mentionToMe = true;
  				break
  			}
  		}
  	}

  	let userId = data.from.id;
  	let classes = data.from.vixname;

  	let classNames = {
			'me':this.user.id == userId,
			'other':this.user.id != userId,
			'pm':data.pmTo != null,
			'pmMe':this.user.id === data.pmTo,
			'tag':data.mentionToIds != null,
			'tagMe':mentionToMe === true
		}
  	
  	for (var el in classNames) {			
			if(classNames[el]) classes += ' '+el;
  	}

  	
  	return {
		  'newMessage': 1,
	    'vixname' : data.from.vixname,
	    'id' : userId,
	    'message' : data.message,
	    'teamSlug': data.teamSlug,
	    'imageUrl': data.from.meta.imageUrl,
	    'exTime': exTimeProp,
	    'createdAt': data.createdAt,
	    'classes': classes,
	    'me':classNames.me,
	    'shirtColor':data.from.shirtColor
  	}
  }



  /**
   * Find object by key in an array of JavaScript objects
   */
  public getObjectBy(array,key,value){
   	return $.grep(array, function(e){ return e[key] == value; });
  }


  /**
   * Store marked vixname color
   */
  public setMarkedVixname(vixname,cl){

  	let markedVixnames = JSON.parse(localStorage.getItem('markedVixnames'));
  	if(markedVixnames){
  		markedVixnames[vixname] = cl;
  	}else{
  		markedVixnames = {};
  		markedVixnames[vixname] = cl;
  	}
  	localStorage.setItem('markedVixnames',JSON.stringify(markedVixnames));
  	this.colorizeMarkedVixname(vixname,cl);
  }


  /**
   * Colorize marked vixnames
   */
  public colorizeMarkedVixnames(){
  	let markedVixnames = JSON.parse(localStorage.getItem('markedVixnames'));
  	if(markedVixnames){
  		let animationCss = '';
  		
  		for (let key in markedVixnames){
				animationCss += '.vix-chat-msgs .msg.'+key+' .vix-name{'+
					'color:'+markedVixnames[key]+
				'}';
  		}

			let styleElement = $('<style type="text/css">').appendTo('head');
		 	styleElement.text(animationCss);
  	}
  }


  /**
   * Colorize single vixname
   */
  public colorizeMarkedVixname(vixname,cl){
		let animationCss = '.vix-chat-msgs .msg.'+vixname+' .vix-name{'+
			'color:'+cl+
		'}';

		let styleElement = $('<style type="text/css">').appendTo('head');
	 	styleElement.text(animationCss);
  }

}
