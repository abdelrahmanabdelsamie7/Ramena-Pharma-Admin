import { Component } from '@angular/core';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent {
  isLoading = false;
  constructor(public _LoadingService: LoadingService) {
    this._LoadingService.isLoading$.subscribe((res) => {
      this.isLoading = res
    });
  }
}
