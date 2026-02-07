import { useEffect, useState } from 'react';

interface Blob {
    id: number;
    size: number;
    x: number;
    y: number;
    duration: number;
    delay: number;
    borderWidth: number;
}

export function AnimatedBackground() {
    const [blobs, setBlobs] = useState<Blob[]>([]);

    useEffect(() => {
        // 增加数量：手机端 6 -> 8, 桌面端 10 -> 15
        const isMobile = window.innerWidth < 640;
        const count = isMobile ? 8 : 15;

        const generated: Blob[] = [];
        for (let i = 0; i < count; i++) {
            // 大小不一致：范围扩大 50px - 450px
            const size = 50 + Math.random() * 400;
            generated.push({
                id: i,
                size,
                x: Math.random() * 100,
                y: Math.random() * 100,
                // 速度增加：10s - 25s
                duration: 10 + Math.random() * 15,
                delay: Math.random() * -20,
                // 边缘毛玻璃宽带
                borderWidth: 20 + Math.random() * 10,
            });
        }
        setBlobs(generated);
    }, []);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-gradient-to-br from-[var(--bg)] to-[var(--bg)] transition-colors duration-500">
            {blobs.map((blob, index) => (
                <div
                    key={blob.id}
                    className="absolute rounded-full animate-float"
                    style={{
                        backgroundColor: `var(--blob-${(index % 6) + 1})`,
                        width: blob.size,
                        height: blob.size,
                        left: `${blob.x}%`,
                        top: `${blob.y}%`,
                        // 核心修复：给球体本身添加内部模糊和边缘模糊
                        filter: 'blur(50px)',
                        // 降低不透明度，防止颜色过重
                        opacity: 0.6,
                        transform: 'translate(-50%, -50%)',
                        animationDuration: `${blob.duration}s`,
                        animationDelay: `${blob.delay}s`,
                        // 模拟边缘描边效果 (通过 box-shadow)
                        boxShadow: `inset 0 0 ${blob.borderWidth}px rgba(255,255,255,0.3)`,
                    }}
                />
            ))}

            {/* 叠加一层轻微的噪点纹理增加质感 (可选，暂不加，保持纯净) */}
        </div>
    );
}
