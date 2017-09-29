import { Injectable, Injector } from '@angular/core';
import { SharedComponents } from '../services/shared.components';
import { ChatService } from '../services/chat';
import { Document } from '../services/interfaces';

import { Config } from '../app/app.config';

declare var $;
declare var document: Document;

@Injectable()
export class Scroll {

	private chatService

  constructor(
  	//private chatService: ChatService,
  	private config: Config,
  	injector:Injector,
  	private sharedComponents: SharedComponents
	){
  	setTimeout(() => this.chatService = injector.get(ChatService));
	}

  selector(el:string, axisParam?:string) {

    this.prepare(el);
    var axis = "y";

    ///???????????
    if (typeof axisParam != 'undefined') {
      axis = axisParam;
      //alert(axis)
    }

    let __this = this;


    $(el).mCustomScrollbar({
      scrollInertia: 60,
      theme: "minimal-dark",
      axis: axis,
      scrollbarPosition: "outside",
      mouseWheel: {
        preventDefault: true
      },
      advanced: {
        updateOnContentResize: true,
        autoExpandHorizontalScroll: true
      },
      callbacks: {
        onScroll: function() {
        	let scrollName = $(this).attr('data-name')

          switch (scrollName) {
            case 'vix-chat-scroll':
              __this.prepareFixMsgs(this);
              break;

            case 'rMatchUsers':
              __this.loadMoreTrigger(this,scrollName);
              break;

            case 'cUserLog':
              __this.loadMoreTrigger(this,scrollName);
              break;

            case 'cLeaderBoard':
              __this.loadMoreTrigger(this,scrollName);
              break;

            case 'rChatFooter':
            	__this.loadMoreTrigger(this,scrollName);
              break;
              
            case 'CQuiz':
            	if( typeof this.mcs != 'undefined'){
            		if(this.mcs.topPct > 80){
            			$('.scrollDownArrow').hide();
            		}
            	}
            	break;
          }

        },

        onInit: function() {
          //if($(this).attr('id') == 'vix-full-screen-chat-msgs') makeOpa(this);
        }
      }
    });


    /**
     * Hide fixed msgs 
     */
    setInterval(function() {

    	$($("#fixed-Msgs .toHide").get().reverse()).each(function( index ) {

    		let __self = $(this);
    		let _exTime = __self.attr('ex-time');

    		if(_exTime < new Date().getTime()){
    			setTimeout(function() { 

    				let topMergin = __self.height();

    				__self.animate({
    					"margin-top": - topMergin
    					}, 1000, function() {
    				    __self.remove();
    				});

    			}, 500);
    		}

    	});

    }, this.config.get('pmMentionWaitTime') * 1000);
  }


  /**
   * Load more action
   */
  public loadMoreTrigger(el:any,componentName:string){
  	if( typeof el.mcs != 'undefined'){
  		if(el.mcs.topPct > 80){
  			this.sharedComponents.emit(componentName, 'loadMore');
  		}
  	}
  }



  /**
   * Prepare msgs to fix
	 * Check if scroll belongs active room scroll
	 * And then if scroll is on bottom call showNewActivity function
	 */
  public prepareFixMsgs(el:any){
		if( typeof el.mcs != 'undefined'){

			if(el.mcs.topPct == 100) this.sharedComponents.emit('chatS', 'showNewActivity', false);
			
			let parentEl = '#' + $(el).parent('r-chat-room').attr('id');
			if(parentEl == '#vix-chat-room-'+this.chatService.chat.activeRoom.slug){
				let posToFix = Math.abs(el.mcs.top);
				let nowTime = new Date().getTime();
				this.fixMsgs(parentEl+' .fix-potential.tagMe, '+parentEl+' .fix-potential.pmMe',posToFix,nowTime);
			}
		}
	}


	/**
   * Fix chat msgs 
   */
  public fixMsgs(el:string, posToFix:number, nowTime:number){
		var fixChatMsgs = [];

		var stepFix = function(_self,exTime){
			if(exTime > nowTime){

				var classes = _self.attr('class');
				var parentClass = '';
				_self.hasClass('pm') ? parentClass = 'parent-pm' : parentClass = 'parent-tag';
				var hideForever = _self.attr('id');
				var html = '<div class="toHide '+parentClass+'" hide-forever="'+hideForever+'"  ex-time="'+exTime+'"><div class="'+classes+'">'+_self.html()+'</div>';

				$('#fixed-Msgs').append(html);

			}
		}
		
		$('#fixed-Msgs').html("");

		$( el ).each(function( index ) {
			var _self = $( this );
			var exTime = _self.attr('ex-time');

			//console.log( _self.position().top +'___'+posToFix  )

			if(_self.position().top - $('#fixed-Msgs').innerHeight() < posToFix ){
				stepFix(_self,exTime);
			}

		});
  }


  /**
   * Scroll bottom
   */
  public bottom(el:string, interia?:number, timeout?:number){

  	if(typeof interia == 'undefined') interia = this.config.get('defaultScrollInteria');
		if(typeof timeout == 'undefined') timeout = this.config.get('defaultScrollTimeout');

		setTimeout(()=>{
			$(el).mCustomScrollbar("scrollTo", "bottom" ,{ scrollInertia:interia, scrollEasing:"easeOut", moveDragger:true, timeout:100 });
		},timeout)
  }

  public top(el:string, interia?:number, timeout?:number){
  	if(typeof interia == 'undefined') interia = this.config.get('defaultScrollInteria');
		if(typeof timeout == 'undefined') timeout = this.config.get('defaultScrollTimeout');

		setTimeout(()=>{
			$(el).mCustomScrollbar("scrollTo", "top" ,{ scrollInertia:interia, scrollEasing:"easeOut", moveDragger:true, timeout:100 });
		},timeout)
  }

  public toSelector(el:string,selector:string){
  	setTimeout(()=>{
  		$(el).mCustomScrollbar("scrollTo",$(selector),{ scrollInertia:this.config.get('defaultScrollInteria'), scrollEasing:"easeOut" });
  	},this.config.get('defaultScrollTimeout'))
  }






  /**
   * Check 
   */
  public check(el:string){
  	if(typeof $(el)[0].mcs != 'undefined'){//empty chat 
  		if( $(el)[0].mcs.topPct <= 100 && $(el)[0].mcs.topPct > 86){
  			return true;
  		}
  		else{
  			return false;
  		}
  	}
  	else{
  		return true;
  	}
  }

  /**
   * Doom prepare
   */
  public prepare(el:string) {

    let minusH = $('#vix-chat-footer').height() + $('#vix-chat-nav').height();
    let documentHeight = $(window).height();
    switch (el) {

    	case '#front-scroll':
        $(el).height((documentHeight - 140));
        break;

    	case '#center-area':
    		
    		if($('#vix-chat-footer').height()){
    			$(el).height(documentHeight - $('#vix-chat-footer').height())
    		}else{
    			$(el).height(documentHeight)
    		}
    		break;

      case '#vix-chat-msgs .chat':
        $(el).height(documentHeight - minusH);
        $('r-chat-room').height(documentHeight - minusH);
        //console.log($(el).height())
        break;

      case '.pm-chat-msgs':
        $(el).height(documentHeight - 63);
        break;

      case '#vix-chat-footer .chosen-groups':
        $(el).width($('#vix-chat-cont').width());
        break;

      case '#vix-full-chat-footer .chosen-groups':
        $(el).width(Math.round($('#vix-full-chat-footer').width() - 36));
        break;

      case '#vix-full-screen-chat-msgs':
        $(el).height(documentHeight / 2);
        break;

      case '#match-users-list':
        $(el).height((documentHeight - minusH + 5));
        break;

      case '.sldp_player_wrp':
      	//??
      	if(document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement){
      		
      	}else{
      		$(el).width( $('#center-area').width() )
      		//$(el).height( $('#center-area').width()/1.9 );
      	}

      	break;
      case '.gifFinder .gifContent':
      	$(el).height(295);
      	break;

      // case '#center-area':
      //   //temp
      //   $(el).height(documentHeight - $('#center-area-footer').height());
      //   break;

      default:
        $(el).height(documentHeight);
        break;
    }
  }

}


@Injectable()

export class Popup{
	center(url:string, title:string, w:number, h:number){
		// Fixes dual-screen position                         Most browsers      Firefox
		let dualScreenLeft = window.screenLeft;
		let dualScreenTop = window.screenTop;

		let width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
		let height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

		let left = ((width / 2) - (w / 2)) + dualScreenLeft;
		let top = ((height / 2) - (h / 2)) + dualScreenTop;
		let newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

		// Puts focus on the newWindow
		if (window.focus) {
		    newWindow.focus();
		}
	}
	

}


