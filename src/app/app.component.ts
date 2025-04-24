import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styles: [
        `
            .container {
                padding: 20px;
            }
            h1 {
                color: #336699;
                text-align: center;
                margin-top: 50px;
            }
            p {
                text-align: center;
                color: #666;
            }
        `,
    ],
})
export class AppComponent {
    title = 'Angular App - Auto Reload Test';
    sectionCount: number = 5;
    sectionTexts: string[] = Array(5).fill('');
    sectionImages: string[] = Array(5).fill('');
    centerImageUrl: string = '';

    updateSections() {
        const newCount = Math.min(Math.max(this.sectionCount, 5), 10);
        if (newCount !== this.sectionCount) {
            this.sectionCount = newCount;
        }

        // 텍스트와 이미지 배열 크기 조정
        if (this.sectionTexts.length < this.sectionCount) {
            this.sectionTexts = [
                ...this.sectionTexts,
                ...Array(this.sectionCount - this.sectionTexts.length).fill(''),
            ];
            this.sectionImages = [
                ...this.sectionImages,
                ...Array(this.sectionCount - this.sectionImages.length).fill(
                    ''
                ),
            ];
        } else if (this.sectionTexts.length > this.sectionCount) {
            this.sectionTexts = this.sectionTexts.slice(0, this.sectionCount);
            this.sectionImages = this.sectionImages.slice(0, this.sectionCount);
        }
    }
}
