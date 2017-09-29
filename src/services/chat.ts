import { Injectable } from '@angular/core';
import { SharedComponents } from './shared.components';
import { StompService } from 'ng2-stomp-service';
//import { ActivatedRoute } from '@angular/router';

import { UserService } from './user';
import { MatchService } from './match';
import { PlayerService } from './player';
import { ApiService } from './api';
import { User, Match, Chat } from './interfaces';
import { Config } from '../app/app.config';
import { ChatHelper } from '../helper/chat';
import { Scroll } from '../helper/dom';
import { TransPipe } from '../pipes/translate/translate';


import { BehaviorSubject } from 'rxjs/BehaviorSubject';

declare var $;

@Injectable()
export class ChatService {

  public chat: Chat;
  public roomInstance: any = [];
  private user: User = {};
  private match: Match;
  public msgsWidth: number;
  public fullMsgsWidth: number;

  

  constructor(
    private stomp: StompService,
    private userService: UserService,
    private scroll: Scroll,
    private matchService: MatchService,
    private chatHelper: ChatHelper,
    private sharedComponents: SharedComponents,
    private player: PlayerService,
    private apiService: ApiService,
    private config: Config,
    private transPipe: TransPipe
  ) {
    let defRoom = {
      index: 0,
      slug: '',
      name: this.transPipe.transform('chat-general-room'),
      newMsgNum: 0,
      newActivity: 0
    };

    this.chat = {
      activeRoom: defRoom,
      rooms: [defRoom]
    };

    this.user = this.userService.user;
    this.match = this.matchService.match;

    stomp.after('user').then(() => {
      this.user = this.userService.user;
    });

    stomp.after('matchInfoUser').then(() => {
      this.match = this.matchService.match;
    });

    /**
  	 * Subscribe to make this
  	 * methods accessable across app
  	 */
    this.sharedComponents.comps.chatS.data.subscribe(data => {
      this[data.method](data.data);
    });
  }

  /**
   * Build chat Rooms using user data
   */
  public buildRoomsFromMatchInfo(rooms: any) {
    let l = rooms.length;
    if (l > 0) {
      for (let i = 0; i < l; i++) {
        this.buildRoomAction(rooms[i]);
      }
    }
  }

  /**
   * Data prepare
	 */
  private buildRoomAction(data) {
    this.buildRoom(data.slug, data.name);
  }

  /**
   * Builds chat room
   */
  private buildRoom(slug: string, name: string) {
    let index = this.chat.rooms.length;
    let newMsgNum = 0;
    let newActivity = 0;
    let data = { index, slug, name, newMsgNum, newActivity };
    this.chat.rooms.push(data);
    this.prepareRoomCont();
  }

  /**
   * Prepears room chat container
   */
  public prepareRoomCont() {
    this.msgsWidth = $('#vix-chat-cont').width();
    this.fullMsgsWidth = $('#vix-full-chat').width();

    let roomCount = this.chat.rooms.length;
    $('#vix-chat-msgs').width(this.msgsWidth * roomCount);

    // full
    $('#vix-full-chat-msgs').width(this.fullMsgsWidth * roomCount);

    setTimeout(() => {
      $('#vix-chat-footer .chosen-groups').mCustomScrollbar('update');
    }, 400);
  }

  /**
	 * changes chat room
	 */
  public changeRoom(room: any, full: boolean) {
    this.chat.activeRoom = room;

    //Fullscreen
    if (full) {
      var mrLeft = this.fullMsgsWidth * room.index;
      $('#vix-full-chat-msgs').css('margin-left', -mrLeft);
      let scrollSelector = '#vix-full-chat-room-' + room['slug'] + ' .chat';
      // check if scroll is up (return true or false)
      if (this.scroll.check(scrollSelector)) {
        this.scroll.bottom(scrollSelector, 100, 10);
      }
    } else {
      let mrLeft = this.msgsWidth * room.index;
      $('#vix-chat-msgs').css('margin-left', -mrLeft);
      //$rootScope.$emit('showHideProfileTab',1);
      this.chat.rooms[room.index]['newMsgNum'] = 0;

      //Full screen bug
      //if(args.scroll) this.scroll.bottom('#vix-chat-msgs .chat',100,10);

      //console.log( this.chatService.chat.activeRoom )
    }
  }

  /**
   * Close - remove room
   */
  public closeRoom(room) {
    let data = {
      slug: room.slug,
      matchId: this.match.id
    };

    this.apiService
      .post(this.config.get('apiBase') + '/match/removeRoom', data)
      .subscribe(
        response => {
          this.chat.rooms.splice(room.index, 1);
          this.indexingRoomList();
          this.prepareRoomCont();

          if (room.slug == 'away' || room.slug == 'home') {
            this.userService.removeChosenTeam();
            this.sharedComponents.emit('lIndex', 'updateChosenTeam');
          }

          //change room
          //let roomIndex = this.chat.rooms[room.index - 1].index;
          this.changeRoom(this.chat.rooms[0], false);
        },
        error => {
          //
        }
      );
  }

  /**
	 * Indexing room list array
	 */
  private indexingRoomList() {
    for (var i = 0; i < this.chat.rooms.length; i++) {
      this.chat.rooms[i]['index'] = i;
    }
  }

  /**
	 * Chat notification click function
	 */
  private showNewActivity(scroll) {
    let activeRoomId = '#vix-chat-room-' + this.chat.activeRoom['slug'];
    if (scroll) this.scroll.bottom(activeRoomId + ' .chat');
    this.chat.rooms[this.chat.activeRoom.index].newActivity = 0;

    //this.chat.rooms[index]['msg'] = false;
    //this.chat.rooms[index]['pmTag'] = false;
  }

  /**
	 * Install chat room
	 */
  public installRoom(room) {

  	
    $('#vix-chat-msgs .chat').width($('#vix-chat-cont').width());

    //create instancesds
    this.roomInstance[room.slug] = {};
    let roomInstance = this.roomInstance[room.slug];

    roomInstance.chatMessages = [];
    roomInstance.msgId = this.chatHelper.getUnicId();

    //for loader 
    roomInstance.msgsLoaded = new BehaviorSubject<boolean>(false);
    roomInstance.msgsLoaded$ = roomInstance.msgsLoaded.asObservable();


    //shuld be moved
    this.scroll.selector('#vix-chat-msgs .chat');

    //** Create request Url
    room.slug != ''
      ? (roomInstance.reqUrl = this.match.slug + '/' + room.slug)
      : (roomInstance.reqUrl = this.match.slug);

    /**
     * Subscribe global and user chat
     */
    this.stomp.after('user').then(() => {
      roomInstance.gSubscription = this.stomp.subscribe(
        '/topic/chat/global/' + roomInstance.reqUrl,
        data => {
          this.callAction(data);
        }
      );

      roomInstance.uSubscription = this.stomp.subscribe(
        '/user/topic/chat/global/' + roomInstance.reqUrl,
        data => {
          this.callAction(data);
        }
      );
      this.stomp.send('/app/chat/global/' + roomInstance.reqUrl, {
        oldMessages: 'get'
      });
    });
  }

  private callAction(data: any) {
    'function' === typeof this[data.action] && this[data.action](data);
  }

  /**
	 * Simple new message action
	 */
  private newMessageAction(data) {
    this.buildMessage(data);
  }

  /**
   * build single message object
   */
  private buildMessage(data) {
    if (data.message == null) return;

    let newMessage = this.chatHelper.createMessage(data.message, true);

    let roomSlug = data.slug;

    let scrollSeletor = '#vix-chat-room-' + roomSlug;
    let fullScrollSelector = '#vix-full-chat-room-' + roomSlug;
    let roomObj = this.chatHelper.getObjectBy(
      this.chat.rooms,
      'slug',
      roomSlug
    )[0];

    this.roomInstance[roomSlug].chatMessages.push(newMessage);

    /**
     * New message at inactive room
     */
    if (this.chat.activeRoom.slug != roomSlug) {
      this.chat.rooms[roomObj.index]['newMsgNum'] += 1;
    }

    let scrolling = true;

    /**
     * Check player is fullscreen or not
     * Check if scroll is up (return true or false)
     */
    // if(this.player.player.isFullscreen()){
    //   scrolling = this.scroll.check(fullScrollSelector+' .chat');
    // }else{
    scrolling = this.scroll.check(scrollSeletor + ' .chat');
    //}

    /**
     * Make chat notification when scroll is up
     * and have recived new message
     */
    if (data.message.fromId == this.user.id) {
      scrolling = true;
    }

    if (scrolling) {
      // if(this.player.player.isFullscreen()){
      //   this.scroll.bottom(fullScrollSelector+' .chat',100,10);
      // }
      // else{
      this.scroll.bottom(scrollSeletor + ' .chat', 100, 10);

      //}
    } else {
      /**
  		 * Chat notification action when scroll isn't bottom
  		 * and have recived new message
  		 */
      this.chat.rooms[roomObj.index].newActivity += 1;
      // if(data['mention'] == 1 || data['pm'] == 1) this.chat.rooms[index]['pmTag'] = true;
    }
  }

  /**
   * Get old messages action
   */
  private oldMessageListAction(data) {
    let roomSlug = data.slug;
    let scrollSeletor = '#vix-chat-room-' + roomSlug;

    let msgs = [];

    for (var i = data.messages.length - 1; i >= 0; i--) {
      msgs[i] = this.chatHelper.createMessage(data.messages[i]);
    }

    this.roomInstance[roomSlug].chatMessages = msgs;

    //helper.loader(scope.scrollSeletor+' .chat').stop(1);
    this.scroll.bottom(scrollSeletor + ' .chat', 5, 600);

    this.roomInstance[roomSlug].msgsLoaded.next(true);
    
  }

  /**
   * Mention message
   */
  private mentionMessageAction(data) {
    this.buildMessage(data);

    let mentionToIds = data.message.mentionToIds;

    //For count new messages and push new message to user messages
    if (mentionToIds) {
      for (var i = 0; i < mentionToIds.length; ++i) {
        if (mentionToIds[i] == this.user.id) {
          this.sharedComponents.emit('rUserMsgs', 'pushNewMsg', data);
          //if(this.chat.activeRoom.slug != roomSlug){
          this.sharedComponents.emit('rRegistered', 'updateChatMsgNum');
          break;
        }
      }
    }
  }

  /**
   * Pm message action
   */
  private pmMessageAction(data) {
    this.buildMessage(data);
    //For count new messages and push new message to user messages
    if (data.message.pmTo == this.user.id) {
      this.sharedComponents.emit('rUserMsgs', 'pushNewMsg', data);
      this.sharedComponents.emit('rRegistered', 'updateChatMsgNum');
    }
  }

  /**
   * Send chat message 
   */
  public sendMessage(message) {
    if (message !== '') {
      let roomSlug = this.chat.activeRoom.slug;
      let data = { message: message, roomName: this.chat.activeRoom.name };
      this.stomp.send(
        '/app/chat/global/' + this.roomInstance[roomSlug].reqUrl,
        data
      );
      return true;
    }
    return true;
  }

  /**
   * Uninstall chat room
   */
  public unInstallRoom(slug: string) {
    this.roomInstance[slug].gSubscription.unsubscribe();
    this.roomInstance[slug].uSubscription.unsubscribe();
    this.roomInstance[slug] = {};
  }
}
