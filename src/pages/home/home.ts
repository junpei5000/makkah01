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
          //self.colorChange(self.angle);
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
        //self.openModal() 
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
    let screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    let screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    /*
    if(document.documentElement.clientWidth<=document.documentElement.clientHeight){
      self.elm_compass.style.width = document.documentElement.clientWidth - 64 + "px";
      self.elm_compass.style.height = document.documentElement.clientWidth - 64 + "px";
    }else{
      self.elm_compass.style.width = document.documentElement.clientHeight - 264 + "px";
      self.elm_compass.style.height = document.documentElement.clientHeight - 264; + "px"
    }
    */
    if(screenWidth<=screenHeight){
      self.elm_compass.style.width = screenWidth - 64 + "px";
      self.elm_compass.style.height = screenWidth - 64 + "px";
    }else{
      self.elm_compass.style.width = screenHeight - 264 + "px";
      self.elm_compass.style.height = screenHeight - 264; + "px"
    }

    var rgb = $('.scroll-content').css('backgroundColor');
    console.log(rgb.match(/^rgb\((0+),\s*(0+),\s*(0+)\)$/));
    alert(rgb);
    alert(rgb=="rgb(35, 35, 35)")
    alert(rgb=="rgb(77, 0, 0)")

 
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

  colorChange(a:number){
    var rgb = $('.scroll-content').css('background-color');
    console.log(rgb.match(/^rgb\((0+),\s*(0+),\s*(0+)\)$/));
    alert(rgb.match(/^rgb\((0+),\s*(0+),\s*(0+)\)$/));

    if(a <= 10 || a >= 350){
      //if(!colorFlag){
          $('.scroll-content').animate({
            backgroundColor:'#4d0000'
          }, 300 );
        //colorFlag = true;
      //}
    }else{
      //if(colorFlag){
        $('.scroll-content').animate({
          backgroundColor:'#232323'
        }, 300 );
        //colorFlag = false;
      //}      
    }

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

(function (d) {
  d.each(["backgroundColor", "borderBottomColor", "borderLeftColor", "borderRightColor", "borderTopColor", "color", "outlineColor"], function (f, e) {
      d.fx.step[e] = function (g) {
          if (!g.colorInit) {
              g.start = c(g.elem, e);
              g.end = b(g.end);
              g.colorInit = true
          }
          g.elem.style[e] = "rgb(" + [Math.max(Math.min(parseInt((g.pos * (g.end[0] - g.start[0])) + g.start[0]), 255), 0), Math.max(Math.min(parseInt((g.pos * (g.end[1] - g.start[1])) + g.start[1]), 255), 0), Math.max(Math.min(parseInt((g.pos * (g.end[2] - g.start[2])) + g.start[2]), 255), 0)].join(",") + ")"
      }
  });

  function b(f) {
      var e;
      if (f && f.constructor == Array && f.length == 3) {
          return f
      }
      if (e = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(f)) {
          return [parseInt(e[1]), parseInt(e[2]), parseInt(e[3])]
      }
      if (e = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(f)) {
          return [parseFloat(e[1]) * 2.55, parseFloat(e[2]) * 2.55, parseFloat(e[3]) * 2.55]
      }
      if (e = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(f)) {
          return [parseInt(e[1], 16), parseInt(e[2], 16), parseInt(e[3], 16)]
      }
      if (e = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(f)) {
          return [parseInt(e[1] + e[1], 16), parseInt(e[2] + e[2], 16), parseInt(e[3] + e[3], 16)]
      }
      if (e = /rgba\(0, 0, 0, 0\)/.exec(f)) {
          return a.transparent
      }
      return a[d.trim(f).toLowerCase()]
  }
  function c(g, e) {
      var f;
      do {
          f = d.css(g, e);
          if (f != "" && f != "transparent" || d.nodeName(g, "body")) {
              break
          }
          e = "backgroundColor"
      } while (g = g.parentNode);
      return b(f)
  }
  var a = {
      aqua: [0, 255, 255],
      azure: [240, 255, 255],
      beige: [245, 245, 220],
      black: [0, 0, 0],
      blue: [0, 0, 255],
      brown: [165, 42, 42],
      cyan: [0, 255, 255],
      darkblue: [0, 0, 139],
      darkcyan: [0, 139, 139],
      darkgrey: [169, 169, 169],
      darkgreen: [0, 100, 0],
      darkkhaki: [189, 183, 107],
      darkmagenta: [139, 0, 139],
      darkolivegreen: [85, 107, 47],
      darkorange: [255, 140, 0],
      darkorchid: [153, 50, 204],
      darkred: [139, 0, 0],
      darksalmon: [233, 150, 122],
      darkviolet: [148, 0, 211],
      fuchsia: [255, 0, 255],
      gold: [255, 215, 0],
      green: [0, 128, 0],
      indigo: [75, 0, 130],
      khaki: [240, 230, 140],
      lightblue: [173, 216, 230],
      lightcyan: [224, 255, 255],
      lightgreen: [144, 238, 144],
      lightgrey: [211, 211, 211],
      lightpink: [255, 182, 193],
      lightyellow: [255, 255, 224],
      lime: [0, 255, 0],
      magenta: [255, 0, 255],
      maroon: [128, 0, 0],
      navy: [0, 0, 128],
      olive: [128, 128, 0],
      orange: [255, 165, 0],
      pink: [255, 192, 203],
      purple: [128, 0, 128],
      violet: [128, 0, 128],
      red: [255, 0, 0],
      silver: [192, 192, 192],
      white: [255, 255, 255],
      yellow: [255, 255, 0],
      transparent: [255, 255, 255]
  }
})(jQuery);
