import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { STAR_ICON_SVG } from '../../../const/icons';
import { NgClass, NgForOf } from '@angular/common';
import { SbiIconComponent } from '../../sbi-icon/sbi-icon.component';

@Component({
  selector: 'sbi-feedback-points',
  standalone: true,
  imports: [NgForOf, SbiIconComponent, NgClass],
  templateUrl: './sbi-feedback-points.component.html',
  styleUrl: './sbi-feedback-points.component.scss',
})
export class SbiFeedbackPointsComponent implements OnInit {
  @Input() pointsCount = 5;
  @Input() label = '';
  @Input() testId = 'sbi-feedback-points-test-id';

  @Output() selectPoints = new EventEmitter<number>();

  public activePoint = signal(0);
  public focusedIdx = signal(0);
  public icons: number[] = [];
  public readonly icon = STAR_ICON_SVG;

  ngOnInit() {
    this.icons = new Array(this.pointsCount).fill(0);
  }

  onSelectPoint(point: number) {
    this.selectPoints.emit(point);
    this.activePoint.set(point);
  }
}
