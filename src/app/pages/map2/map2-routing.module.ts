import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Map2Page } from './map2.page';

const routes: Routes = [
  {
    path: '',
    component: Map2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Map2PageRoutingModule {}
