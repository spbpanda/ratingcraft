import { OverlayContainer } from '@angular/cdk/overlay';
import { AsyncPipe, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ThemeService } from './theme.service';
import { take } from 'rxjs';

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
})
export class SbiDarkSliderComponent implements OnInit {
  @Input() testId: string = 'sbiDarkSlider';
  @Output() changeTheme: EventEmitter<string> = new EventEmitter(); 
  
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
    this.themeService.isDarkTheme$.pipe(take(1)).subscribe(data => {
      this.changeTheme.emit(data ? 'dark' : 'light');
    })
  }
}
