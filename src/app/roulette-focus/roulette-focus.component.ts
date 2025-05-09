import { Component, ElementRef, ViewChild, Input } from '@angular/core';

const SECTOR_COUNT = 8;
const SECTOR_ANGLE = 360 / SECTOR_COUNT;
const CENTER_IGNORE_RADIUS = 10;
const TOTAL_DURATION = 5000;
const TOTAL_SPINS = 20;

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
    @Input() targetSector: number = 0; // 0~7 번 섹터에서 멈추도록 설정

    // 섹터 데이터 수정 (데이터에 맞게 수정 필요)
    rouletteSectors: RouletteSector[] = [
        { id: 0, item: '', rouletteTier: 'good' },
        { id: 1, item: '', rouletteTier: 'best' },
        { id: 2, item: '', rouletteTier: 'good' },
        { id: 3, item: '', rouletteTier: 'better' },
        { id: 4, item: '', rouletteTier: 'good' },
        { id: 5, item: '', rouletteTier: 'best' },
        { id: 6, item: '', rouletteTier: 'good' },
        { id: 7, item: '', rouletteTier: 'better' },
    ];

    public sectorAngle = SECTOR_ANGLE;

    // easing 함수 분리
    private easeInOutQuad(t: number): number {
        return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }

    // 각도 → 섹터 변환 함수
    private getSectorFromAngle(angle: number): number {
        return Math.floor(angle / this.sectorAngle);
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

        // 목표 섹터: 클릭된 섹터가 있으면 그 섹터, 없으면 랜덤
        const targetSector = this.targetSector;

        // 시작 시 sector-focused는 0도에서 시작
        this.clickedSector = 0;
        this.highlightSector = 0;

        const config = {
            totalDuration: TOTAL_DURATION,
            totalSectors: SECTOR_COUNT,
            totalSpins: TOTAL_SPINS,
            easing: (t: number) => this.easeInOutQuad(t),
        };

        const startTime = performance.now();
        const totalSteps =
            config.totalSpins * config.totalSectors + targetSector;

        const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / config.totalDuration, 1);
            const t = config.easing(progress);

            // 전체 회전 각도: 마지막에 targetSector에서 멈추도록
            const currentStep = Math.floor(totalSteps * t);
            const currentSector = currentStep % config.totalSectors;
            this.highlightSector = currentSector;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.isSpinning = false;
                this.clickedSector = targetSector; // sector-focused도 최종 위치로
            }
        };

        requestAnimationFrame(animate);
    }
}
