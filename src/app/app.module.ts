import { HttpModule } from '@angular/http'
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { StompService } from 'ng2-stomp-service';

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

import { ApiService } from '../services/api';

import { MyApp } from './app.component';
import { PlayerComponent } from '../components/player/player';
import { HomePage } from '../pages/home/home';

import { ChatService } from '../services/chat';
import { GlobalService } from '../services/global';
import { MatchService } from '../services/match';
import { PlayerService } from '../services/player';
import { SharedComponents } from '../services/shared.components';
import { UserService } from '../services/user';


import { TransPipe } from '../pipes/translate/translate';
import { Config } from './app.config';
import { Scroll/*, Popup*/ } from '../helper/dom';
import { ChatHelper } from '../helper/chat';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    PlayerComponent,
    TransPipe
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    PlayerComponent
  ],
  providers: [
    Config,
    ApiService,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ChatService,
    GlobalService,
    MatchService,
    PlayerService,
    SharedComponents,
    UserService,
    StompService,
    TransPipe,
    Scroll,
    ChatHelper
  ]
})
export class AppModule {}
