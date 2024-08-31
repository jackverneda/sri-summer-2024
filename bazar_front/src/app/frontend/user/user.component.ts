import { Component, Inject } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProjectionService } from '../core/services/projection.service';
import { count } from 'rxjs';
import { TicketsService } from '../core/services/tickets.service';
import { LoggedInUserService } from '../../core/service/logged-in-user.service';
import { AdminPaymentService } from '../../backend/core/services/payment.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: 'user.component.scss',
})
export class UserComponent {
  paymentForm!: FormGroup;
  countSeats = 0;
  projection: any;
  roomSeats: any;
  stepIndex = 0;
  reservation: any[] = [];
  paymentMethods: any[] = [];

  constructor(
    private fb: FormBuilder,
    private activeRoute: ActivatedRoute,
    private projectionService: ProjectionService,
    private ticketsService: TicketsService,
    private paymentTypeService: AdminPaymentService,
    private loggedInUser: LoggedInUserService,
  ) {}

  onLoadData(id: string) {
    this.projectionService.get(id).subscribe((data: any) => {
      this.projection = data;
    });
  }

  calcPrice() {
    return this.projection?.price * this.countSeats;
  }

  onPayTicket() {
    this.ticketsService.onCreateTicket({ paymentTypeid: this.paymentForm.value, CreateTicketsRequests: this.reservation }).subscribe(() => {
      this.stepIndex = 1;
    });
  }
  onConfirmPayment() {
    this.ticketsService
      .onConfirmPayment(this.paymentForm.value.paymentTypeid, {
        confirmTicketsRequests: this.reservation,
      })
      .subscribe(() => {
        this.stepIndex = 2;
      });
  }

  onClickSelectSeat() {}
}
