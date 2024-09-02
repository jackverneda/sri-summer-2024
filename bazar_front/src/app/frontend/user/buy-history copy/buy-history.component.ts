import { Component, Input } from '@angular/core';
import { TicketsService } from '../../core/services/tickets.service';
import { ProjectionService } from '../../core/services/projection.service';

@Component({
  selector: 'app-buy-history',
  templateUrl: './buy-history.component.html',
  styleUrl: 'buy-history.component.scss',
})
export class BuyHistoryComponent {
  rates = [1, 2, 3, 4, 5];
  data!: any;
  constructor(
    private ticketService: TicketsService,
    private projectionService: ProjectionService,
  ) {
    this.ticketService.getTicketHistory().subscribe((history: any) => {
      this.projectionService.getAll().subscribe((proj: any) => {
        this.data = history.map((ticket: any) => {
          const projection = proj.find((p: any) => p.id === ticket.projectionId);
          return {
            ...ticket,
            projection,
          };
        });
        console.log(this.data);
      });
    });
  }
  char(num: number) {
    return String.fromCharCode(65 + num);
  }
}
