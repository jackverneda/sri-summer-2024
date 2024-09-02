import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { BaseService } from '../../../core/service/base.service';
import { LoggedInUserService } from '../../../core/service/logged-in-user.service';

@Injectable({
  providedIn: 'root',
})
export class TicketsService extends BaseService {
  data: any[] = [];
  createUrl!: string;
  confirmUrl!: string;
  availabilityUrl!: string;
  ticketHistoryUrl: string;

  constructor(
    private httpClient: HttpClient,
    private loggedInUser: LoggedInUserService,
  ) {
    super(httpClient, 'tickets', loggedInUser);
    this.createUrl = this.baseUrl + '/create';
    this.confirmUrl = this.baseUrl + '/confirm';
    this.availabilityUrl = this.baseUrl + '/byprojection/:id';
    this.ticketHistoryUrl = this.baseUrl + '/reservedbyuser/:id';
  }

  getByProjections(id: string) {
    return this.httpClient.get<any>(this.availabilityUrl.replace(':id', id));
  }

  onCreateTicket(body: any) {
    return this.httpClient.post(this.createUrl, body);
  }

  onConfirmPayment(paymentType: string, body: any) {
    return this.httpClient.post(`${this.confirmUrl}/${paymentType}`, body);
  }

  getTicketHistory() {
    return this.httpClient.get(this.ticketHistoryUrl.replace(':id', this.loggedInUser.loggedInUser.id));
  }
}
