import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { DeviceOrientation, DeviceOrientationCompassHeading } from '@ionic-native/device-orientation';
import { Geolocation} from '@ionic-native/geolocation';
import { Platform } from 'ionic-angular';
import { CalcLogic } from '../../providers/calcLogic';
import { DeviceInfo } from '../../shared/deviceInfo';
import { LocationSelectModalPage } from '../location-select-modal/location-select-modal';

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

  private elm_yajirushi:any;
  private elm_compass:any;
  private magneticHeading:number;
  private loc_lat: number;
  private loc_lng: number;

  constructor(
    public navCtrl: NavController,
    private deviceOrientation: DeviceOrientation,
    private geolocation: Geolocation,
    private platform: Platform,
    private modalCtrl: ModalController
  ) {
    //this.deviceInfo = new DeviceInfo();
    this.calcLogic = new CalcLogic();
    this.initDeviceInfo()
  }

  initDeviceInfo(){
    let self = this;

    //デバイスの向き設定
    //self.deviceInfo.setMagneticHeading(0);
    self.magneticHeading = 0;
    self.loc_lat = 0;
    self.loc_lng = 0;

    self.platform.ready().then(() => {

      let onCompassSuccess = function(response1: DeviceOrientationCompassHeading){
        //self.deviceInfo.setMagneticHeading(response1.magneticHeading)
        self.magneticHeading = response1.magneticHeading;
        self.angle = self.calcLogic.getMakkahAngle(self.loc_lat,self.loc_lng,self.magneticHeading);
        self.distance = self.calcLogic.getMakkahDistance(self.loc_lat,self.loc_lng);
      }

      let onCompassChange = function(response2: DeviceOrientationCompassHeading){
        //alert("onCompassChange : " + response2.magneticHeading);
        //if(self.deviceInfo.getMagneticHeading()!=response2.magneticHeading){
          //self.deviceInfo.setMagneticHeading(response2.magneticHeading);
          self.magneticHeading = response2.magneticHeading;
          self.angle = self.calcLogic.getMakkahAngle(self.loc_lat,self.loc_lng,self.magneticHeading);
          self.distance = self.calcLogic.getMakkahDistance(self.loc_lat,self.loc_lng);
          self.imgSet();
        //}
      }

      let onCompassError = function(error: any){
        //alert('コンパスのエラーが発生しました: ' + error);
        console.log(error+"err");
      }

      const compassOptions={
        //frequency:10
        filter:1
      };

      self.deviceOrientation.getCurrentHeading().then(onCompassSuccess,onCompassError);
    
      const watchCompassId = self.deviceOrientation.watchHeading(compassOptions);
      watchCompassId.subscribe(onCompassChange,onCompassError);

      //console.log("magneticHeading:" + self.magneticHeading);



    //デバイスの位置情報設定
    //console.log("navigator.geolocation works well");

      let onLocationSuccess = function(position) {
        
        self.loc_lat = position.coords.latitude;
        self.loc_lng = position.coords.longitude;
        //self.deviceInfo.setLoclat(position.coords.latitude)
        //self.deviceInfo.setLoclng(position.coords.longitude)
        
        //self.angle = self.calcLogic.getMakkahAngle(self.loc_lat,self.loc_lng,self.magneticHeading);
        //self.distance = self.calcLogic.getMakkahDistance(self.loc_lat,self.loc_lng);
        
        //self.imgSet();
        //navigator.geolocation.watchPosition(onLocationChange, onError, locationOptions);

      };

      let onLocationChange = function(position) {

        self.loc_lat = position.coords.latitude;
        self.loc_lng = position.coords.longitude;
        //self.deviceInfo.setLoclat(position.coords.latitude)
        //self.deviceInfo.setLoclng(position.coords.longitude)
        
        //self.angle = self.calcLogic.getMakkahAngle(self.loc_lat,self.loc_lng,self.magneticHeading);
        //self.distance = self.calcLogic.getMakkahDistance(self.loc_lat,self.loc_lng);

        //self.imgSet();

      };
  
      // onError Callback receives a PositionError object
      //
      function onLocationError(error) {
        self.openModal() 
        console.log('code: ' + error.code + ', message: ' + error.message);
      }

      const locationOptions = {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 0
      };

      //navigator.geolocation.getCurrentPosition(onLocationSuccess, onLocationError,locationOptions);
      navigator.geolocation.watchPosition(onLocationChange, onLocationError, locationOptions);


      self.elm_yajirushi = document.getElementById("yajirushi");
      self.elm_compass = document.getElementById("compass");
      self.setScreen();
    });

  }

  setScreen(){
    let self = this;
    if(document.documentElement.clientWidth<=document.documentElement.clientHeight){
      self.elm_compass.style.width = document.documentElement.clientWidth - 64 + "px";
      self.elm_compass.style.height = document.documentElement.clientWidth - 64 + "px";
    }else{
      self.elm_compass.style.width = document.documentElement.clientHeight - 264 + "px";
      self.elm_compass.style.height = document.documentElement.clientHeight - 264; + "px"
    }
  }

  imgSet() {
    let self = this;
    //alert(self.elm_yajirushi);

    

    if (typeof self.elm_yajirushi.style.transform !== "undefined") {
      self.elm_yajirushi.style.transform = "rotateZ(" + self.angle + "deg)";
    } else if (typeof self.elm_yajirushi.style.webkitTransform !== "undefined") {
      self.elm_yajirushi.style.webkitTransform = "rotateZ(" + self.angle + "deg)";
    }

    /*
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
    */


  }

  openModal() {
    let myModal = this.modalCtrl.create(LocationSelectModalPage);
    let self = this;

    myModal.onDidDismiss(data => {
      self.deviceInfo = data;
      self.loc_lat = self.deviceInfo.getLoclat();
      self.loc_lng = self.deviceInfo.getLoclng();
      self.angle = self.calcLogic.getMakkahAngle(self.loc_lat,self.loc_lng,self.magneticHeading);
      self.distance = self.calcLogic.getMakkahDistance(self.loc_lat,self.loc_lng);
      self.imgSet();
    });

    myModal.present();
  }

}

