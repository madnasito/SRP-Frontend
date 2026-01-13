import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedModule } from './shared/shared-module';
import { FeaturesModule } from './features/features-module';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SharedModule, FeaturesModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('srp-frontend');
}
