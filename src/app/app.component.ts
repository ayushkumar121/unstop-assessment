import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  error = '';
  seatCount = 0;
  seatsBookedCount = 0;
  coach = new Coach(80, 7);
  recentlyBooked: number[] = [];

  constructor() {	
      this.bookSeats(5);
      this.bookSeats(7);
      this.bookSeats(6);
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
  bookSeats(seatCount: number) {
    this.resetError();

     if (seatCount < 1 || seatCount > 7) {
      this.setError('Cannot book more than 7 and less 1 seat at a time');
      return;
    }

     if (this.seatsBookedCount + seatCount > this.coach.totalSeatCount) {
      this.setError('Not enought seats are available');
      return;
    }

    /* Find seats in a row*/
    let maxColumns = this.coach.rows[0].totalSeats; 
    let bestRowIndex = -1;
    let minCost = Number.POSITIVE_INFINITY;

    for (let i=0; i<this.coach.rows.length; i++) {
	let row = this.coach.rows[i];
	let cost = row.emptySeats - seatCount;
	
	if (cost >= 0 && cost < minCost) {
    		minCost = cost;
    		bestRowIndex = i;
	}
    }

    /* 
    * Filling up in base case ie. we have a single
    * row free 
    * */
    if (bestRowIndex != -1) {
    	let bookedSeats = [];
    	let bestRow = this.coach.rows[bestRowIndex];
    	let filledSeats = bestRow.totalSeats - bestRow.emptySeats;

        /* Figuring out seat numbers*/
    	for (let i=0; i<seatCount; i++) {
		bookedSeats.push(bestRowIndex*maxColumns + i+filledSeats);
    	}
    	
    	this.recentlyBooked = bookedSeats;
        this.seatsBookedCount += seatCount;
    	bestRow.emptySeats -= seatCount;
    	return;
    }

   /* 
   * Filling up seats incase we don't have 
   * seats available in a row 
   * */

    let bestRows: number[] = [];
    minCost = Number.POSITIVE_INFINITY;

    for (let i=0; i<this.coach.rows.length; i++) { 
    	let bookedSoFar = 0;
    	let rows: number[] = [];
    
    	for (let j=i; j<this.coach.rows.length; j++) {
		let row = this.coach.rows[j];
		if (row.emptySeats == 0) continue;

		rows.push(j);
		bookedSoFar += row.emptySeats;
		
		if (bookedSoFar >= seatCount) {
    			break;
		}
    	}
    	
    	if (bookedSoFar < seatCount) {
        	break;
    	}
    	
	let cost = this.getRowCost(rows);
	if (cost < minCost) {
    		bestRows = rows;
    		minCost = cost;
	}
    }

    let bookedSoFar = 0;
    let bookedSeats = [];

    for (let i=0; i<bestRows.length; i++) {
        let rowIndex = bestRows[i];
        let row = this.coach.rows[rowIndex];
        let toBook = Math.min(seatCount-bookedSoFar, row.emptySeats);

        /* Figuring out seat numbers*/
        let filledSeats = row.totalSeats - row.emptySeats;
    	for (let i=0; i<toBook; i++) {
		bookedSeats.push(rowIndex*maxColumns + i + filledSeats);
    	}

        row.emptySeats -= toBook;
        bookedSoFar += toBook;
    }
    this.recentlyBooked = bookedSeats;
    this.seatsBookedCount += seatCount;
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

