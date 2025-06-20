import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-details-modal',
  standalone: true,
  imports: [],
  templateUrl: './details-modal.component.html',
  styleUrl: './details-modal.component.css'
})
export class DetailsModalComponent {
  @Input() title: string = '';
  @Input() details: any = {};
}
