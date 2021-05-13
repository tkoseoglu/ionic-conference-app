import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Map2PageRoutingModule } from './map2-routing.module';
import { Map2Page } from './map2.page';
import { GoogleMapsModule } from '@angular/google-maps';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GoogleMapsModule,
    Map2PageRoutingModule
  ],
  declarations: [Map2Page]
})
export class Map2PageModule {}
