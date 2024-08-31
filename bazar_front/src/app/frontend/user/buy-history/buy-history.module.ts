import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { DurationModule } from '../../../core/pipes/duration/duration.module';
import { BuyHistoryComponent } from './buy-history.component';
import { BuyHistoryRoutingModule } from './buy-history.routing';

@NgModule({
  declarations: [BuyHistoryComponent],
  imports: [RouterModule, MatChipsModule, MatIconModule, CommonModule, DurationModule, BuyHistoryRoutingModule],
})
export class BuyHistoryModule {}
