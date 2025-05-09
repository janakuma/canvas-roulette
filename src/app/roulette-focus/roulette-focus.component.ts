import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
    selector: 'app-roulette-focus',
    templateUrl: './roulette-focus.component.html',
    styleUrls: ['./roulette-focus.component.scss'],
})
export class RouletteFocusComponent {
    @ViewChild('roulette', { static: true })
    circleEl!: ElementRef<HTMLDivElement>;
    clickedSector: number | null = null;
    highlightSector: number = 0;
    isSpinning: boolean = false;

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
        let angle = ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360;

        // 0도를 상단(12시 방향)으로 맞추기 위해 90도를 더함
        angle = (angle + 90) % 360;
        const sector = Math.floor(angle / 45);

        this.clickedSector = sector;
        //this.highlightSector = sector;
        console.log(`섹터: ${sector}`);
    }

    startRoulette() {
        if (this.isSpinning) return;
        this.isSpinning = true;

        const config = {
            totalDuration: 5000,
            totalSectors: 8,
            totalSpins: 16,
            easing: (t: number) =>
                t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
        };

        const startTime = performance.now();

        const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / config.totalDuration, 1);
            const t = config.easing(progress);

            // sector 계산: t가 0~1로 증가하므로, 마지막에 점점 느려지게
            const currentSector = Math.floor(
                (config.totalSpins * config.totalSectors * t) %
                    config.totalSectors
            );
            this.highlightSector = currentSector;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.isSpinning = false;
            }
        };

        requestAnimationFrame(animate);
    }
}
