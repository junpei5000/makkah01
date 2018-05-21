import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { DeviceOrientation, DeviceOrientationCompassHeading } from '@ionic-native/device-orientation';
import { Geolocation } from '@ionic-native/geolocation';
//import { GoogleMaps } from "@ionic-native/google-maps";

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { CalcLogic } from '../providers/calcLogic';
import { LocationSelectModalPage } from '../pages/location-select-modal/location-select-modal';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LocationSelectModalPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LocationSelectModalPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    DeviceOrientation,
    Geolocation,
//    GoogleMaps,
    CalcLogic,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}