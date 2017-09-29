export interface User{
	dataLoaded ?: boolean,
	id ?: number,
	email ?: string,
	temporary ?: number,
	isLogged ?: boolean,
	vixnames ?: any,
	hasVixname ?: boolean,
	activeVixname ?: number,
	rooms ?: any,
	initData ?: any,
	activated ?: number,
	points ?: number,
	notifications ?: {
		main ?: number,
		log ?: number
	},
	meta ?: {
		age : string,
		imageUrl : string,
		sex : string,
	}
}

export interface Chat {
	activeRoom:{
		index : number,
		slug : string,
		name : string,
		newMsgNum : number,
		newActivity : number
	},
	rooms:{
		index : number,
		slug : string,
		name : string,
		newMsgNum : number,
		newActivity : number
	}[]
}

export interface Message {
  id: number;
  fromId: number;
  privateId: number;
  seanceId: number;
  roomId: string;
  message: string;
  createdAt: number;
}

export interface Team {
  id?: number;
  name?: string;
  slug?: string;
  logo?: string;
  colorPrimary?: string;
  colorSecondary?: string;
  colorAccent?: string;
}

export interface Match{
	id?: number;
  slug?: string;
  homeTeam?: Team;
  awayTeam?: Team;
  neutral?: any;
  userSupportedTeam?: string;
  userRooms?: any;
  streamUrl?: any;
  backgroundComponent?: boolean
}


export interface Document {
  exitFullscreen: any;
  mozCancelFullScreen: any;
  webkitExitFullscreen: any;
  fullscreenElement: any;
  mozFullScreenElement: any;
  webkitFullscreenElement: any;
  msFullscreenElement: any;
  documentElement: any;
  activeElement: any;
  body: any;
  selection: any;
  createRange: any;
}

// export interface Array<T> {
//   pushIfNotExist(comparer: T): Array<T>;
// }


