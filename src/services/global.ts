import { Injectable, Injector} from '@angular/core';

@Injectable()

export class GlobalService{
	public globals = {mainNav:{active:'clearComponent'}}

	constructor(){
	}

	//deprecated
	public setMainNav(nav:string){
		this.globals.mainNav.active = nav;
	}

}