import { OverlayContainer } from '@angular/cdk/overlay';
import { AsyncPipe, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ThemeService } from './theme.service';

@Component({
  selector: 'sbi-dark-slider',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    MatButtonModule,
  ],
  templateUrl: './sbi-dark-slider.component.html',
  styleUrl: './sbi-dark-slider.component.scss',
  providers: [ ThemeService ],
})
export class SbiDarkSliderComponent implements OnInit {
  @Input() testId: string = 'sbiDarkSlider';
  
  constructor(
    public themeService: ThemeService,
    private overlayContainer: OverlayContainer
  ) {}

  ngOnInit(): void {
    this.themeService.isDarkTheme$.subscribe(isDark => {
      if (isDark) {
        this.overlayContainer.getContainerElement().classList.add('dark-theme');
        document.body.classList.add('dark-theme');
      } else {
        this.overlayContainer.getContainerElement().classList.remove('dark-theme');
        document.body.classList.remove('dark-theme');
      }
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
