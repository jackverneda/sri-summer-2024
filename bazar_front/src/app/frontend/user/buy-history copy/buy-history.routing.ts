import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuyHistoryComponent } from './buy-history.component';

export const routes: Routes = [
  {
    path: '',
    component: BuyHistoryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuyHistoryRoutingModule {}
