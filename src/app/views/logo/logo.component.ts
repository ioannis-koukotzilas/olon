import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Mode } from '../../enums/mode';

@Component({
  selector: 'app-logo',
  imports: [RouterModule],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.css',
})
export class LogoComponent {
  @Input() mode?: Mode = Mode.dark;

  get fillColor(): string {
    return this.mode === Mode.light ? '#FFFFFF' : '#000000';
  }
}
