import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Config } from '../app/app.config';
import 'rxjs/Rx';

@Injectable()
export class SharedComponents{

	comps: any = {
		cIndex : {data:{},observer:{}},
		rIndex : {data:{},observer:{}},
		chatS : {data:{},observer:{}},
		rChatFooter : {data:{},observer:{}},
		rMatchUsers : {data:{},observer:{}},
		rUserMsgs : {data:{},observer:{}},
		rRegistered : {data:{},observer:{}},
		hErrorBox : {data:{},observer:{}},
		hBotBox : {data:{},observer:{}},
		cQuiz : {data:{},observer:{}},
		cUserLog : {data:{},observer:{}},
		cLeaderBoard : {data:{},observer:{}},
		lIndex : {data:{},observer:{}}
	}


	constructor(
		private config: Config
	){

		let comps = this.comps;

		comps.cIndex.data = new Observable(observer => {
			comps.cIndex.observer = observer;
		})

		comps.rIndex.data = new Observable(observer => {
			comps.rIndex.observer = observer;
		})

		comps.chatS.data = new Observable(observer => {
			comps.chatS.observer = observer;
		})

		comps.rChatFooter.data = new Observable(observer => {
			comps.rChatFooter.observer = observer;
		})

		comps.rMatchUsers.data = new Observable(observer => {
			comps.rMatchUsers.observer = observer;
		})

		comps.rUserMsgs.data = new Observable(observer => {
			comps.rUserMsgs.observer = observer;
		})

		comps.rRegistered.data = new Observable(observer => {
			comps.rRegistered.observer = observer;
		})

		comps.hErrorBox.data = new Observable(observer => {
			comps.hErrorBox.observer = observer;
		})

		comps.hBotBox.data = new Observable(observer => {
			comps.hBotBox.observer = observer;
		})

		comps.cQuiz.data = new Observable(observer => {
			comps.cQuiz.observer = observer;
		})

		comps.cUserLog.data = new Observable(observer => {
			comps.cUserLog.observer = observer;
		})

		comps.cLeaderBoard.data = new Observable(observer => {
			comps.cLeaderBoard.observer = observer;
		})

		comps.lIndex.data = new Observable(observer => {
			comps.lIndex.observer = observer;
		})


	}



	public emit(loc:string, method:string, data?:any):void{
		data = data || null;
		let next = {loc,method,data}
		if(this.config.get('sharedComponentsDebug'))
			console.log('send stream >>>>',next)
		if(typeof this.comps[loc].observer.next != 'undefined')
			this.comps[loc].observer.next(next);
	}


}