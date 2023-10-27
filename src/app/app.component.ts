import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  error = '';
  seatCount = 0;
  seatsBooked = 0;
  seats = new Uint8Array(80);
  recentlyBooked: number[] = [];

  constructor() {
    this.bookSeats(6);
  }

  setError(newError: string) {
    this.error = newError;
  }

  resetError() {
    this.error = '';
  }

  isRecentBooking(index: number) {
    return this.recentlyBooked.findIndex((x) => x === index) != -1;
  }

  /*
  This functions books seats given 
  the number of seats booked.
  also returns the seat numbers of seat
  booked
  */
  bookSeats(seatCount: number) {
    this.resetError();

    // if (seatCount < 1 || seatCount > 7) {
    //   this.setError('Cannot book more than 7 and less 1 seat at a time');
    //   return;
    // }

    if (seatCount + this.seatsBooked > this.seats.length) {
      this.setError('Cannot book more than coach capaity');
      return;
    }

    let seatNumbers: number[] = [];
    for (let i = 0; i < seatCount; i++) {
      let k = this.seatsBooked;
      let row = Math.floor(k / 7) + 1;

      if (row % 2 == 0) {
        k = 7 * row - (1 + (this.seatsBooked % 7));
      }

      if (k > 79) {
          k -= 4;
      }
          
      this.seats[k] = 1;
      this.seatsBooked++;

      seatNumbers.push(k);
    }

    this.recentlyBooked = seatNumbers;
  }
}
