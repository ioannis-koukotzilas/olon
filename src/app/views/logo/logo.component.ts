import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Mode } from '../../enums/mode';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logo',
  imports: [CommonModule, RouterModule],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.css',
})
export class LogoComponent {
  @Input() logoMode?: Mode = Mode.dark;

  mode = Mode;
}
