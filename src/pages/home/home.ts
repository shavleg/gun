import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PlayerComponent } from '../../components/player/player';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

}
