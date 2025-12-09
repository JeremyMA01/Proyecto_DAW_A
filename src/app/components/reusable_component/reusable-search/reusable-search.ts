import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'reusable-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reusable-search.html',
  styleUrl: './reusable-search.css'
})
export class ReusableSearch {

  @Output() search = new EventEmitter<string>();

  onSearch(value: string) {
    this.search.emit(value);
  }
}

