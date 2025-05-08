import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
    selector: 'app-roulette-focus',
    templateUrl: './roulette-focus.component.html',
    styleUrls: ['./roulette-focus.component.scss'],
})
export class RouletteFocusComponent {
    @ViewChild('circle', { static: true })
    circleEl!: ElementRef<HTMLDivElement>;
    clickedSector: number | null = null;

    onCircleClick(event: MouseEvent) {
        const rect = this.circleEl.nativeElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const radius = Math.min(rect.width, rect.height) / 2;
        const dx = x - cx;
        const dy = y - cy;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 원의 반지름 밖 클릭 무시
        if (distance > radius) {
            this.clickedSector = null;
            return;
        }
        // 중심 근처 클릭 무시 (반경 10px)
        if (distance < 10) {
            this.clickedSector = null;
            return;
        }

        // 각도 계산 (0도는 오른쪽, 90도는 아래, 180도는 왼쪽, 270도는 위)
        const angle = ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360;

        // 시계방향으로 변환 (1번 섹터가 45도에서 시작)
        // 270도를 빼서 0도를 상단으로 맞춤
        const cwAngle = (angle - 270 + 360) % 360;
        const sector = Math.floor(cwAngle / 45);

        this.clickedSector = sector;
        console.log(`섹터: ${sector}`);
    }
}
