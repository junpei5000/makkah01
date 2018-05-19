import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LocationSelectModalPage } from './location-select-modal';

@NgModule({
  declarations: [
    LocationSelectModalPage,
  ],
  imports: [
    IonicPageModule.forChild(LocationSelectModalPage),
  ],
})
export class LocationSelectModalPageModule {}
