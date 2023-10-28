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
  coach = new Coach(80, 7);
  //recentlyBooked: number[] = [];

  constructor() {	
      this.bookSeats(5);
      this.bookSeats(7);
      this.bookSeats(6);
      this.bookSeats(7);
      this.bookSeats(7);
      this.bookSeats(7);
      this.bookSeats(7);
      this.bookSeats(7);
      this.bookSeats(5);
      this.bookSeats(5);
      this.bookSeats(3);
  }

  setError(newError: string) {
    this.error = newError;
  }

  resetError() {
    this.error = '';
  }

  /* 
  * Given rows this funtion returs the sum of 
  * distances between them
  * */
  getRowCost(rows: number[]): number {
      let cost = 0;
      for(let i=0; i<rows.length-1; i++) {
          cost += rows[i+1]-rows[i];
      }
      return cost;
  }

  /*
  This functions books seats given 
  the number of seats booked.
  also returns the seat numbers of seat
  booked
  */
  bookSeats(seatCount: number): number[] {
    this.resetError();

     if (seatCount < 1 || seatCount > 7) {
      this.setError('Cannot book more than 7 and less 1 seat at a time');
      return [];
    }

     if (this.seatsBooked + seatCount > this.coach.totalSeatCount) {
      this.setError('Not enought seats are available');
      return [];
    }

    /* Find seats in a row*/
    
    let bestRow = -1;
    let minCost = Number.POSITIVE_INFINITY;

    for (let i=0; i<this.coach.rows.length; i++) {
	let row = this.coach.rows[i];
	let cost = row.emptySeats - seatCount;
	
	if (cost >= 0 && cost < minCost) {
    		minCost = cost;
    		bestRow = i;
	}
    }

    /* 
    * Filling up in base case ie. we have a single
    * row free 
    * */
    if (bestRow != -1) {
        this.seatsBooked += seatCount;
    	this.coach.rows[bestRow].emptySeats -= seatCount;
    	return [bestRow];
    }

   /* 
   * Filling up seats incase we don't have 
   * seats available in a row 
   * */

    let bookedSoFar = 0;
    let rows: number[] = [];
    let bestRows: number[] = [];
    
    minCost = Number.POSITIVE_INFINITY;

    for (let i=0; i<this.coach.rows.length; i++) {
	let row = this.coach.rows[i];
	if (row.emptySeats == 0) continue;

	rows.push(i);
	bookedSoFar += row.emptySeats;

	if (bookedSoFar >= seatCount) {
    		let cost = this.getRowCost(rows);
		if (cost < minCost) {
    			bestRows = rows;
    			minCost = cost;
		}

    		// Reseting the state so we can try another case
		rows = [];
    		bookedSoFar = 0;
	}
    }
    

    bookedSoFar = 0;
    for (let i=0; i<bestRows.length; i++) {
        let rowIndex = bestRows[i];
        let row = this.coach.rows[rowIndex];
        let toBook = Math.min(seatCount-bookedSoFar, row.emptySeats);
        row.emptySeats -= toBook;
        bookedSoFar += toBook;
    }
   
    return bestRows;
  }
}

interface Row {
    totalSeats: number; 
    /* 
    * Number of empty seats in the row
    * The way we're filling seats makes
    * sures only the last seats in a row
    * are empty.
    */ 
    emptySeats: number;
}

class Coach {
    rows : Row[];
    totalSeatCount: number;

    /*
    * @totalSeatCount: Number of total seats in a coach
    * @seatsInRow: Number of seats in a row
    */
    constructor(totalSeatCount: number, seatsInRow: number) {
        let rowCount = Math.floor(totalSeatCount/seatsInRow);
        let lastRowSeats = totalSeatCount%seatsInRow;

	this.rows = [];
	this.totalSeatCount = totalSeatCount;
	
       	/* Fill up 1st to row-1 rows*/
	for (let i=0; i<rowCount-1; i++) {
    		this.rows.push({totalSeats: seatsInRow, emptySeats: seatsInRow});
	}

	/* Fill up last row*/
	this.rows.push({totalSeats: lastRowSeats, emptySeats: lastRowSeats});
    } 
}

