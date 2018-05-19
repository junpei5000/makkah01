import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { DeviceInfo } from '../../shared/deviceInfo';
import { NG_ASYNC_VALIDATORS } from '@angular/forms';

/**
 * Generated class for the LocationSelectModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-location-select-modal',
  templateUrl: 'location-select-modal.html',
})
export class LocationSelectModalPage {
  //location = '';
  deviceInfo:DeviceInfo = new DeviceInfo();

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocationSelectModalPage');
  }

  locationSelected(selectLocation: string) {
    //this.location = selectLocation;
    this.setLoc(selectLocation);
    this.closeModal();
  }

  closeModal() {
    this.viewCtrl.dismiss(this.deviceInfo);
  }

  setLoc(selectLocation: string){
    switch(selectLocation){
      case "ny":
        this.deviceInfo.setLoclat(40.7588950);
        this.deviceInfo.setLoclng(-73.9851310);
        break;
      case "tk":
        this.deviceInfo.setLoclat(35.6247918);
        this.deviceInfo.setLoclng(139.7767100);
        break;
      case "rm":
        this.deviceInfo.setLoclat(41.9027);
        this.deviceInfo.setLoclng(12.4963);
        break;
      case "ld":
        this.deviceInfo.setLoclat(51.5073509);
        this.deviceInfo.setLoclng(-0.1277583);
        break;
      case "pr":
        this.deviceInfo.setLoclat(48.8566);
        this.deviceInfo.setLoclng(2.3522);
        break;
    }

  }

}
