import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
    selector: 'app-roulette',
    templateUrl: './roulette.component.html',
    styleUrls: ['./roulette.component.scss'],
})
export class RouletteComponent implements AfterViewInit {
    @ViewChild('rouletteCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

    private canvas!: HTMLCanvasElement;
    private ctx!: CanvasRenderingContext2D;
    private sections: number = 5;
    private texts: string[] = [
        '핫 핑크',
        '라임 그린',
        '도저 블루',
        '골드',
        '미디엄 오키드',
    ];

    // private colors: string[] = [
    //     '#FF69B4', // 핫 핑크
    //     '#32CD32', // 라임 그린
    //     '#1E90FF', // 도저 블루
    //     '#FFD700', // 골드
    //     '#BA55D3', // 미디엄 오키드
    // ];
    private loadedImages: HTMLImageElement[] = [];
    private imageUrls: string[] = [
        '../assets/roulette1.jpg',
        '../assets/roulette2.jpg',
        '../assets/roulette3.jpg',
        '../assets/roulette4.jpg',
        '../assets/roulette5.jpg',
    ];
    private currentRotation: number = 0;
    private isSpinning: boolean = false;

    async ngAfterViewInit() {
        await this.loadImages();
        this.initCanvas();
    }

    private async loadImages() {
        const defaultImage =
            'https://i.namu.wiki/i/EDqvf4gB4ghRHWfmk2dxZDfA-_vGjplyFQqHDMhgFf_qZ9u_RJcYsWmpxWnXYevLdNtMQjX2hnPyk97QBaaaIg.webp';

        this.loadedImages = await Promise.all(
            this.imageUrls.map(async (url) => {
                const img = new Image();
                try {
                    await new Promise((resolve, reject) => {
                        img.onload = resolve;
                        img.onerror = reject;
                        img.src = url;
                    });
                    return img;
                } catch {
                    img.src = defaultImage;
                    await new Promise((resolve) => (img.onload = resolve));
                    return img;
                }
            })
        );
    }

    private initCanvas() {
        this.canvas = this.canvasRef.nativeElement;
        this.ctx = this.canvas.getContext('2d')!;

        // 캔버스 크기 설정
        this.canvas.width = 500;
        this.canvas.height = 500;
        this.drawRoulette();
    }

    private drawRoulette() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 10;

        this.ctx.save();
        this.ctx.translate(centerX, centerY);
        this.ctx.rotate(this.currentRotation);

        // 섹션 그리기
        const anglePerSection = (2 * Math.PI) / this.sections;
        for (let i = 0; i < this.sections; i++) {
            this.ctx.save();
            this.ctx.rotate(i * anglePerSection);

            // 섹션 경로 생성
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.arc(0, 0, radius, 0, anglePerSection);
            this.ctx.closePath();

            // 미리 로드된 이미지 사용
            if (this.loadedImages[i]) {
                this.ctx.save();
                this.ctx.clip();
                this.ctx.drawImage(
                    this.loadedImages[i],
                    -radius,
                    -radius,
                    radius * 2,
                    radius * 2
                );
                this.ctx.restore();
            }

            // 섹션 테두리
            this.ctx.strokeStyle = 'orange';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            // 텍스트 추가
            if (this.texts[i]) {
                this.ctx.save();
                this.ctx.rotate(anglePerSection / 2);
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';

                // 텍스트
                this.ctx.fillStyle = '#fff';
                this.ctx.font = 'bold 24px Arial';
                this.ctx.fillText(this.texts[i], radius * 0.6, 0);
                this.ctx.restore();
            }

            this.ctx.restore();
        }

        this.ctx.restore();
    }

    spin() {
        if (this.isSpinning) return;
        this.isSpinning = true;
        const randomNumber = Math.random() * 5 + 5; // 5에서 10 사이의 랜덤 숫자
        const totalRotation = Math.floor(randomNumber * 100) / 100; // 소수점 둘째자리까지 버림
        console.log('회전 횟수:', totalRotation);

        const duration = 5000; // 5초
        const startTime = performance.now();
        const startRotation = this.currentRotation;

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // easeOut 효과 적용
            const easeOut = (t: number) => 1 - Math.pow(1 - t, 5);
            const currentProgress = easeOut(progress);

            // 시계 방향으로만 회전하도록 수정
            //totalRotation 회전 수 조절
            this.currentRotation =
                startRotation + 2 * Math.PI * totalRotation * currentProgress; // 현재 10바퀴 회전
            this.drawRoulette();

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.isSpinning = false;
            }
        };

        requestAnimationFrame(animate);
    }
}
