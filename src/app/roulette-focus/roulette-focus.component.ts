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

        // atan2: 0도는 오른쪽, 90도는 아래, 180도는 왼쪽, 270도는 위
        let angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        if (angle < 0) angle += 360;

        // 상단 우측(45도)에서 1번 섹터 시작, 시계방향
        // 1번 섹터 중심이 45도, 범위는 22.5~67.5도
        // 오프셋: 45+22.5=67.5도(1번 섹터 시작점)
        const cwAngle = (360 + angle - 270) % 360;
        const sector = Math.floor(cwAngle / 45) + 1;

        this.clickedSector = sector;
        console.log(`섹터: ${sector}`);
    }
}
