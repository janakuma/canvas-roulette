import { Component, ElementRef, ViewChild, Input } from '@angular/core';

// 매직 넘버 상수화
const SECTOR_COUNT = 8;
const SECTOR_ANGLE = 360 / SECTOR_COUNT;
const CENTER_IGNORE_RADIUS = 10;

interface RouletteSector {
    id: number;
    item: string;
    rouletteTier: 'good' | 'better' | 'best';
}

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

    // 애니메이션 관련 값 외부에서 조정 가능하게
    @Input() totalDuration: number = 5000;
    @Input() totalSpins: number = 20;

    // 섹터 데이터 수정
    rouletteSectors: RouletteSector[] = [
        { id: 1, item: '', rouletteTier: 'good' },
        { id: 2, item: '', rouletteTier: 'best' },
        { id: 3, item: '', rouletteTier: 'good' },
        { id: 4, item: '', rouletteTier: 'better' },
        { id: 5, item: '', rouletteTier: 'good' },
        { id: 6, item: '', rouletteTier: 'best' },
        { id: 7, item: '', rouletteTier: 'good' },
        { id: 8, item: '', rouletteTier: 'better' },
    ];

    // 이징 함수 분리
    private easeInOutQuad(t: number): number {
        return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }

    // 각도 → 섹터 변환 함수
    private getSectorFromAngle(angle: number): number {
        return Math.floor(angle / SECTOR_ANGLE);
    }

    // 거리 계산 함수
    private getDistance(
        x1: number,
        y1: number,
        x2: number,
        y2: number
    ): number {
        const dx = x1 - x2;
        const dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    onCircleClick(event: MouseEvent): void {
        // 룰렛이 돌고 있을 때 클릭 이벤트 무시
        if (this.isSpinning) return;
        const rect = this.circleEl.nativeElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const radius = Math.min(rect.width, rect.height) / 2;
        const distance = this.getDistance(x, y, cx, cy);

        // 원의 반지름 밖 클릭 무시
        if (distance > radius) {
            this.clickedSector = null;
            return;
        }
        // 중심 근처 클릭 무시
        if (distance < CENTER_IGNORE_RADIUS) {
            this.clickedSector = null;
            return;
        }

        // 각도 계산 (0도는 오른쪽, 90도는 아래, 180도는 왼쪽, 270도는 위)
        let angle = ((Math.atan2(y - cy, x - cx) * 180) / Math.PI + 360) % 360;
        // 0도를 상단(12시 방향)으로 맞추기 위해 90도를 더함
        angle = (angle + 90) % 360;
        const sector = this.getSectorFromAngle(angle);

        this.clickedSector = sector;
        //console.log(`섹터: ${sector}`);
    }

    startRoulette(): void {
        if (this.isSpinning) return;
        this.isSpinning = true;

        const config = {
            totalDuration: this.totalDuration,
            totalSectors: SECTOR_COUNT,
            totalSpins: this.totalSpins,
            easing: (t: number) => this.easeInOutQuad(t),
        };

        const startTime = performance.now();

        const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / config.totalDuration, 1);
            const t = config.easing(progress);

            // 현재 섹터 계산: 진행률에 따라 점점 느려지게 회전
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
