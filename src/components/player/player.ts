import {
  NgZone,
  Component,
  ElementRef,
  ComponentRef,
  OnInit,
  Input,
  ViewContainerRef,
  ComponentFactoryResolver,
  ViewChild
} from '@angular/core';

import { SharedComponents } from '../../services/shared.components';
import { Document } from '../../services/interfaces';
import { Scroll } from '../../helper/dom';
import { MatchService } from '../../services/match';
import { PlayerService } from '../../services/player';
import { ChatService } from '../../services/chat';

declare var SLDP,collectPoints,$;

declare var document: Document;
/**
 * Generated class for the PlayerComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'player',
  templateUrl: 'player.html'
})
export class PlayerComponent implements OnInit {
  @ViewChild('targetBody', { read: ViewContainerRef })
  targetBody: ViewContainerRef;
  timeout = null;
  elem: any;

  constructor(
    private cfr: ComponentFactoryResolver,
    private elRef: ElementRef,
    private player: PlayerService,
    private chatService: ChatService,
    private ngZone: NgZone,
    private sharedComponents: SharedComponents,
    private scroll: Scroll,
    private matchService: MatchService
  ) {}

  ngOnInit() {

    // Run SLDP outside of angular zone, so that it won't trigger
    // change detection on 'socket.onmessage' events,
    // which is used by SLDP to get video chunks
    this.ngZone.runOutsideAngular(() => {

      // Initialize player
      let sldpPlayer = SLDP.init({
        // log_level: 'debug',
        container: 'sldp-player',
        stream_url: this.matchService.match.streamUrl,
        initial_resolution: '720p',
        autoplay: true,
        offset: 666,
        buffering: 1121,
        latency_tolerance: 500
      });

      // Hide player control bar after 2 seconds
      setTimeout(function () {
        const sldpControlBar = window.document
          .querySelector('.sldp_cbar') as HTMLDivElement;

        sldpControlBar && (
          sldpControlBar.style.opacity = '0'
        );
      }, 2000);

      this.scroll.prepare('.sldp_player_wrp');


    });

   $(document).on('mozfullscreenchange webkitfullscreenchange fullscreenchange', () => {
   		if(document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement){

   		}else{
   			this.scroll.prepare('.sldp_player_wrp');
   		}

   })

    // TODO: We still need Video.js as a fallback player,
    // for browsers where websocket isn't supported

    // this.player.load().then(() => {
    //   // Detect if Player is on full screen
    //   $(document).on('mozfullscreenchange webkitfullscreenchange fullscreenchange', () => {
    //     $('#vix-full-chat').hide();
    //     // Change room in main chat
    //     this.chatService.changeRoom(this.chatService.chat.activeRoom, false);
    //     this['targetBody'].clear();

    //     this.timeout = setTimeout(() => {
    //       if (this.player.player.isFullscreen()) {
    //         let factory = this.cfr.resolveComponentFactory(PChatComponent);
    //         this['targetBody'].createComponent(factory);
    //         $('#vix-full-chat').show();
    //       }
    //     }, 500);
    //   });
    // });

    $('body').on('click', '#sldp-player', e => {
    	if($(e.target).hasClass('sldp_player_wrp')){
    		this.sharedComponents.emit('rChatFooter', 'defender');
    	}
    });

  }

  public scrollDown(){
  	this.scroll.bottom('#center-area',500,0);
  }

}