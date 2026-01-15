import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedModule } from './shared/shared-module';
import { FeaturesModule } from './features/features-module';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './core/services/auth/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SharedModule, FeaturesModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('srp-frontend');
  private authService = inject(AuthService);
  private platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    // Only check session if we're in the browser
    if (isPlatformBrowser(this.platformId)) {
      this.authService.checkSession();
    }
  }
}
