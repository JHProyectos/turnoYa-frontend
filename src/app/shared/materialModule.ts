import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export const MaterialModule = [
  MatToolbarModule,
  MatGridListModule,
  MatCardModule,
  MatIconModule,
  MatButtonModule,
] as const;
