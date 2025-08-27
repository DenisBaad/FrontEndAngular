import { CommonModule } from '@angular/common';
import { Component, inject, Input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CropperDialogComponent, CropperDialogResult } from '../cropper-dialog/cropper-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-image-control',
  imports: [
    MatButtonModule,
    MatTooltipModule,
    CommonModule,
    MatIconModule,
  ],
  templateUrl: './image-control.component.html',
  styleUrl: './image-control.component.scss'
})
export class ImageControlComponent {
  @Input() width = 0;
  @Input() height = 0;
  @Input() imageUrl?: string;
  @Input() isRounded: boolean = false;

  dialog = inject(MatDialog);
  croppedImage = signal<CropperDialogResult | undefined>(undefined);

  get placeholder(): string {
    return `https://placehold.co/${this.width}x${this.height}`;
  }

  fileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.dialog.open(CropperDialogComponent, {
      data: { image: file, width: 500, height: 500 },
      width: '500px'
    })
    .afterClosed()
    .subscribe(result => {
      if (!result?.blob) return;

      this.croppedImage.set(result);

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        if (base64Image) {
          this.imageUrl = base64Image;
          localStorage.setItem('imageUrl', base64Image);
          localStorage.setItem('isRounded', JSON.stringify(this.isRounded));
        }
      };
      reader.readAsDataURL(result.blob);
    });
  }
}

