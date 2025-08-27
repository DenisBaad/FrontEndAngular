import { Component } from '@angular/core';
import { SideBarComponent } from './shared/components/side-bar/side-bar/side-bar.component';

@Component({
  selector: 'app-root',
  imports: [SideBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

}
