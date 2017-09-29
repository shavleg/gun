const transObj = window['__VIX_MESSAGES__'] || {};

import { Pipe, PipeTransform } from '@angular/core';


@Pipe({name: 'trans'})

export class TransPipe implements PipeTransform {
	
	transObj : any;


	transform(value: string){
		return transObj[value];
	}



}

