import { Injectable } from '@angular/core';
declare var $;
declare var videojs;

@Injectable()
export class PlayerService {

	public player : any
	
	constructor(){}

	/**
	 * load player
	 */
	public load(){
		return new Promise((resolve, reject) => {

			this.player = videojs(document.getElementById('videoSeance'),
				{techOrder: ["html5"]}, ()=>{
			 		$('.vjs-control-bar').after('<div id="FlyIconsHere"></div>');
			 		resolve();
			 	}
			);
   	 
  	});
	}

}