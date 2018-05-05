import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DeviceOrientation, DeviceOrientationCompassHeading } from '@ionic-native/device-orientation';
import { Geolocation} from '@ionic-native/geolocation';
import { Platform } from 'ionic-angular';
import { CalcLogic } from '../../providers/calcLogic';
import { DeviceInfo } from '../../shared/deviceInfo';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  
  private angle:number;
  private distance:number;
  private calcLogic:CalcLogic;
  private deviceInfo:DeviceInfo;
  private c:HTMLCanvasElement;
  private ctx:CanvasRenderingContext2D;
  private image:HTMLImageElement;
  private imgUrl = "assets/imgs/yajirushi.png";

  constructor(public navCtrl: NavController,private deviceOrientation: DeviceOrientation,private geolocation: Geolocation,private platform: Platform) {
    this.deviceInfo = new DeviceInfo();
    this.calcLogic = new CalcLogic();
    this.initDeviceInfo()
  }

  initDeviceInfo(){
    let self = this;

    //デバイスの向き設定
    self.deviceInfo.setMagneticHeading(0);

    self.platform.ready().then(() => {

      let onCompassSuccess = function(response1: DeviceOrientationCompassHeading){
        self.deviceInfo.setMagneticHeading(response1.magneticHeading)
        alert("onCompassSuccess : " + response1.magneticHeading);
      }

      let onCompassError = function(error: any){
        //alert('コンパスのエラーが発生しました: ' + error);
        console.log(error+"err");
      }

      let onCompassChange = function(response2: DeviceOrientationCompassHeading){
        alert("onCompassChange : " + response2.magneticHeading);
        //if(self.deviceInfo.getMagneticHeading()!=response2.magneticHeading){
          self.deviceInfo.setMagneticHeading(response2.magneticHeading);
          self.imgSet();
        //}
      }

      const compassOptions={
        //frequency:200
        filter:5
      };

      self.deviceOrientation.getCurrentHeading().then(onCompassSuccess,onCompassError);
    
      const watchCompassId = self.deviceOrientation.watchHeading(compassOptions);
      watchCompassId.subscribe(onCompassChange,onCompassError);

      console.log("magneticHeading:" + this.deviceInfo.getMagneticHeading());



    //デバイスの位置情報設定
    console.log("navigator.geolocation works well");

      let onLocationSuccess = function(position) {
        
        self.deviceInfo.setLoclat(position.coords.latitude)
        self.deviceInfo.setLoclng(position.coords.longitude)
        self.imgSet();
        //navigator.geolocation.watchPosition(onLocationChange, onError, locationOptions);

      };

      let onLocationChange = function(position) {

        self.deviceInfo.setLoclat(position.coords.latitude)
        self.deviceInfo.setLoclng(position.coords.longitude)

        self.imgSet();

      };
  
      // onError Callback receives a PositionError object
      //
      function onLocationError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
      }

      const locationOptions = {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 0
      };

      //navigator.geolocation.getCurrentPosition(onLocationSuccess, onLocationError,locationOptions);
      navigator.geolocation.watchPosition(onLocationChange, onLocationError, locationOptions);

    });

  }

  imgSet() {
    let self = this;
    self.angle = self.calcLogic.getMakkahAngle(self.deviceInfo.getLoclat(),self.deviceInfo.getLoclng(),self.deviceInfo.getMagneticHeading());
    self.distance = self.calcLogic.getMakkahDistance(self.deviceInfo.getLoclat(),self.deviceInfo.getLoclng());

    self.c = <HTMLCanvasElement>document.getElementById('c_1');
    self.ctx = self.c.getContext("2d");  

    self.image = new Image();

    self.image.onload = () =>{
      if(document.documentElement.clientWidth<=document.documentElement.clientHeight){
        self.c.width = document.documentElement.clientWidth - 64;
        self.c.height = document.documentElement.clientWidth - 64;
      }else{
        self.c.width = document.documentElement.clientHeight - 264;
        self.c.height = document.documentElement.clientHeight - 264;
      }
      var theta = self.angle * Math.PI / 180;
      self.ctx.clearRect(0, 0, self.c.width, self.c.height);
      self.ctx.save();
      self.ctx.translate(self.c.width / 2, self.c.height / 2);
      self.ctx.rotate(theta);
      self.ctx.drawImage(self.image, -self.c.width/2*0.8, -self.c.height/2*0.8,self.c.width*0.8,self.c.height*0.8);
      self.ctx.restore();
      
    };
    self.image.src = self.imgUrl;


  }

}

