import { useCallback, useEffect, useRef, useState } from 'react';
import { type Candle, } from '@/hooks/useDerivChart';

function fmtPrice(v: number): string {
    if (!v || isNaN(v)) return '0';
    if (v >= 10000) return v.toFixed(2);
    if (v >= 100) return v.toFixed(3);
    if (v >= 1) return v.toFixed(5);
    return v.toFixed(7);
}


export function CandleChart({ candles, isDark }: { candles: Candle[]; isDark: boolean }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [offset, setOffset] = useState(0);
    const [visibleCount, setVisibleCount] = useState(80);
    const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);

    const isDragging = useRef(false);
    const dragStartX = useRef(0);
    const dragStartOff = useRef(0);
    const touchStartX = useRef(0);
    const touchStartOff = useRef(0);
    const lastPinch = useRef<number | null>(null);

    const clamp = useCallback(
        (raw: number, total: number, visible: number) =>
            Math.max(0, Math.min(total - visible, raw)),
        []
    );

    // ── Main draw ──────────────────────────────────────────────────────────────
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || candles.length < 2) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const W = rect.width;
        const H = rect.height;

        // Layout constants
        const PAD_L = 8;
        const PAD_R = 72;
        const PAD_T = 16;
        const PAD_B = 28;   // room for scrollbar
        const USABLE = H - PAD_T - PAD_B;
        const VOL_H = Math.floor(USABLE * 0.2);   // 20% — volume histogram
        const GAP = 6;                           // separator gap
        const CAN_H = USABLE - VOL_H - GAP;       // 80% — candlesticks
        const CHART_W = W - PAD_L - PAD_R;

        ctx.clearRect(0, 0, W, H);

        // Visible slice
        const total = candles.length;
        const visible = Math.min(visibleCount, total);
        const safe = clamp(offset, total, visible);
        const endIdx = total - safe;
        const startIdx = Math.max(0, endIdx - visible);
        const slice = candles.slice(startIdx, endIdx);
        if (slice.length < 2) return;

        // ── Price range ──────────────────────────────────────────────────────────
        const maxV = Math.max(...slice.map(c => c.high));
        const minV = Math.min(...slice.map(c => c.low));
        const range = maxV - minV || 1;
        const toY = (v: number) => PAD_T + CAN_H - ((v - minV) / range) * CAN_H;

        // ── Horizontal grid lines ────────────────────────────────────────────────
        ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= 4; i++) {
            const y = PAD_T + (CAN_H / 4) * i;
            ctx.beginPath(); ctx.moveTo(PAD_L, y); ctx.lineTo(W - PAD_R, y); ctx.stroke();
        }

        // ── Y-axis price labels ──────────────────────────────────────────────────
        ctx.font = '9px monospace';
        ctx.textAlign = 'left';
        ctx.fillStyle = isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)';
        for (let i = 0; i <= 4; i++) {
            const val = minV + (range / 4) * (4 - i);
            const y = PAD_T + (CAN_H / 4) * i;
            ctx.fillText(fmtPrice(val), W - PAD_R + 6, y + 3);
        }

        // ── Candle spacing ───────────────────────────────────────────────────────
        const spacing = CHART_W / slice.length;
        const candleW = Math.max(1, spacing * 0.65);

        // ── Draw candles ─────────────────────────────────────────────────────────
        slice.forEach((c, i) => {
            const x = PAD_L + i * spacing + spacing / 2;
            const openY = toY(c.open);
            const closeY = toY(c.close);
            const color = c.bull ? '#22c55e' : '#ef4444';

            // Wick
            ctx.strokeStyle = color; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(x, toY(c.high)); ctx.lineTo(x, toY(c.low)); ctx.stroke();

            // Body
            ctx.fillStyle = color;
            const bodyTop = Math.min(openY, closeY);
            const bodyH = Math.max(Math.abs(closeY - openY), 1);
            ctx.fillRect(x - candleW / 2, bodyTop, candleW, bodyH);
        });

        // ── Last-price dashed line + badge ───────────────────────────────────────
        const last = slice[slice.length - 1];
        const lastY = toY(last.close);
        const lastColor = last.bull ? '#22c55e' : '#ef4444';

        ctx.strokeStyle = lastColor + '55'; ctx.lineWidth = 0.8;
        ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(PAD_L, lastY); ctx.lineTo(W - PAD_R, lastY); ctx.stroke();
        ctx.setLineDash([]);

        const badgeW = PAD_R - 6;
        ctx.fillStyle = lastColor;
        ctx.fillRect(W - PAD_R + 2, lastY - 9, badgeW, 18);
        ctx.fillStyle = '#fff'; ctx.font = '8px monospace'; ctx.textAlign = 'center';
        ctx.fillText(fmtPrice(last.close), W - PAD_R + 2 + badgeW / 2, lastY + 3.5);

        // ── Volume histogram separator ───────────────────────────────────────────
        const volTopY = PAD_T + CAN_H + GAP;
        ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)';
        ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(PAD_L, volTopY - 1); ctx.lineTo(W - PAD_R, volTopY - 1); ctx.stroke();

        // "Vol" label
        ctx.fillStyle = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)';
        ctx.font = '8px monospace'; ctx.textAlign = 'left';
        ctx.fillText('Vol', PAD_L + 2, volTopY + 10);

        // ── Volume bars ──────────────────────────────────────────────────────────
        // Proxy: (high - low) * close gives a meaningful activity measure
        // for synthetic indices which don't have real volume
        const volumes = slice.map(c => (c.high - c.low) * c.close);
        const maxVol = Math.max(...volumes, 1);

        slice.forEach((c, i) => {
            const x = PAD_L + i * spacing + spacing / 2;
            const vol = volumes[i];
            const barH = Math.max(1, (vol / maxVol) * (VOL_H - 4));
            const barY = volTopY + (VOL_H - 4) - barH;
            ctx.fillStyle = c.bull ? 'rgba(34,197,94,0.35)' : 'rgba(239,68,68,0.35)';
            ctx.fillRect(x - candleW / 2, barY, candleW, barH);
        });

        // ── Scrollbar ────────────────────────────────────────────────────────────
        const sbY = H - 14;
        ctx.fillStyle = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
        ctx.beginPath(); ctx.roundRect(PAD_L, sbY, CHART_W, 4, 2); ctx.fill();

        if (total > visible) {
            const thumbW = Math.max(24, (visible / total) * CHART_W);
            const maxOff = total - visible;
            const thumbX = PAD_L + ((maxOff - safe) / maxOff) * (CHART_W - thumbW);
            ctx.fillStyle = isDark ? 'rgba(124,58,237,0.6)' : 'rgba(124,58,237,0.45)';
            ctx.beginPath(); ctx.roundRect(thumbX, sbY, thumbW, 4, 2); ctx.fill();
        }

        if (safe > 0) {
            ctx.fillStyle = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.18)';
            ctx.font = '9px monospace'; ctx.textAlign = 'right';
            ctx.fillText(`−${safe} candles`, W - PAD_R - 4, H - 16);
        }

        // ── Crosshair ────────────────────────────────────────────────────────────
        if (mouse) {
            const { x: mx, y: my } = mouse;
            const inCandleArea = mx >= PAD_L && mx <= W - PAD_R && my >= PAD_T && my <= PAD_T + CAN_H;

            if (inCandleArea) {
                // Crosshair lines
                ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.15)';
                ctx.lineWidth = 0.5;
                ctx.setLineDash([3, 3]);

                // Vertical
                ctx.beginPath(); ctx.moveTo(mx, PAD_T); ctx.lineTo(mx, PAD_T + CAN_H); ctx.stroke();
                // Horizontal
                ctx.beginPath(); ctx.moveTo(PAD_L, my); ctx.lineTo(W - PAD_R, my); ctx.stroke();

                ctx.setLineDash([]);

                // Price label at cursor Y on the right axis
                const hoverPrice = maxV - ((my - PAD_T) / CAN_H) * range;
                const hBadgeW = PAD_R - 6;
                ctx.fillStyle = isDark ? 'rgba(50,50,60,0.95)' : 'rgba(230,230,240,0.95)';
                ctx.fillRect(W - PAD_R + 2, my - 9, hBadgeW, 18);
                // Border
                ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';
                ctx.lineWidth = 0.5;
                ctx.strokeRect(W - PAD_R + 2, my - 9, hBadgeW, 18);
                ctx.fillStyle = isDark ? '#e5e7eb' : '#111';
                ctx.font = '8px monospace'; ctx.textAlign = 'center';
                ctx.fillText(fmtPrice(hoverPrice), W - PAD_R + 2 + hBadgeW / 2, my + 3.5);

                // OHLC info box — top left of chart
                const candleIdx = Math.min(
                    Math.max(0, Math.floor((mx - PAD_L) / spacing)),
                    slice.length - 1
                );
                const hc = slice[candleIdx];
                if (hc) {
                    const parts = [
                        `O:${fmtPrice(hc.open)}`,
                        `H:${fmtPrice(hc.high)}`,
                        `L:${fmtPrice(hc.low)}`,
                        `C:${fmtPrice(hc.close)}`,
                    ];
                    const ohlcStr = parts.join('  ');

                    ctx.font = '9px monospace';
                    const textW = ctx.measureText(ohlcStr).width;
                    const boxW = textW + 16;
                    const boxH = 20;
                    const boxX = PAD_L;
                    const boxY = PAD_T;

                    // Background
                    ctx.fillStyle = isDark ? 'rgba(18,18,24,0.92)' : 'rgba(250,250,252,0.92)';
                    ctx.beginPath(); ctx.roundRect(boxX, boxY, boxW, boxH, 4); ctx.fill();

                    // Border
                    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
                    ctx.lineWidth = 0.5;
                    ctx.beginPath(); ctx.roundRect(boxX, boxY, boxW, boxH, 4); ctx.stroke();

                    // Text colored by candle direction
                    ctx.fillStyle = hc.bull ? '#22c55e' : '#ef4444';
                    ctx.textAlign = 'left';
                    ctx.fillText(ohlcStr, boxX + 8, boxY + 13);
                }
            }
        }
    }, [candles, offset, visibleCount, isDark, mouse, clamp]);

    // ── Wheel: scroll or zoom ──────────────────────────────────────────────────
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            if (e.ctrlKey || e.metaKey) {
                const dir = e.deltaY > 0 ? 1 : -1;
                setVisibleCount(prev => Math.max(10, Math.min(200, prev + dir * 5)));
            } else {
                const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
                const step = Math.max(1, Math.round(Math.abs(delta) / 30));
                const dir = delta > 0 ? 1 : -1;
                setOffset(prev => clamp(prev + dir * step, candles.length, visibleCount));
            }
        };
        canvas.addEventListener('wheel', onWheel, { passive: false });
        return () => canvas.removeEventListener('wheel', onWheel);
    }, [candles.length, visibleCount, clamp]);

    // ── Mouse drag ─────────────────────────────────────────────────────────────
    const onMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true;
        dragStartX.current = e.clientX;
        dragStartOff.current = offset;
    };
    const onMouseMove = (e: React.MouseEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        if (!isDragging.current) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const chartW = canvas.clientWidth - 8 - 72;
        const pixPerCan = chartW / visibleCount;
        const deltaOff = Math.round(-(e.clientX - dragStartX.current) / pixPerCan);
        setOffset(clamp(dragStartOff.current + deltaOff, candles.length, visibleCount));
    };
    const stopDrag = () => { isDragging.current = false; };
    const onMouseLeave = () => { isDragging.current = false; setMouse(null); };

    // ── Touch: pan + pinch zoom ────────────────────────────────────────────────
    const onTouchStart = (e: React.TouchEvent) => {
        if (e.touches.length === 1) {
            touchStartX.current = e.touches[0].clientX;
            touchStartOff.current = offset;
            lastPinch.current = null;
        } else if (e.touches.length === 2) {
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            lastPinch.current = Math.hypot(dx, dy);
        }
    };
    const onTouchMove = (e: React.TouchEvent) => {
        e.preventDefault();
        const canvas = canvasRef.current;
        if (!canvas) return;
        if (e.touches.length === 1) {
            const chartW = canvas.clientWidth - 8 - 72;
            const pixPerCan = chartW / visibleCount;
            const deltaOff = Math.round(-(e.touches[0].clientX - touchStartX.current) / pixPerCan);
            setOffset(clamp(touchStartOff.current + deltaOff, candles.length, visibleCount));
        } else if (e.touches.length === 2 && lastPinch.current !== null) {
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const dist = Math.hypot(dx, dy);
            const ratio = lastPinch.current / dist;
            lastPinch.current = dist;
            setVisibleCount(prev => Math.max(10, Math.min(200, Math.round(prev * ratio))));
        }
    };
    const onTouchEnd = () => { lastPinch.current = null; };

    return (
        <div className="relative w-full h-full select-none">
            <canvas
                ref={canvasRef}
                className={`w-full h-full ${isDragging.current ? 'cursor-grabbing' : 'cursor-crosshair'}`}
                style={{ display: 'block', touchAction: 'none' }}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={stopDrag}
                onMouseLeave={onMouseLeave}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            />

            {/* Jump-to-latest */}
            {offset > 0 && (
                <button
                    onClick={() => setOffset(0)}
                    className="absolute bottom-8 right-20 flex items-center gap-1.5 text-[10px] font-semibold
            bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-2.5 py-1.5 rounded-full
            shadow-lg shadow-[#7c3aed]/30 transition-all active:scale-95"
                >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="13 17 18 12 13 7" /><polyline points="6 17 11 12 6 7" />
                    </svg>
                    Latest
                </button>
            )}

            {/* Hint */}
            <p className="absolute bottom-9 left-2 text-[8px] font-mono opacity-20 pointer-events-none dark:text-white text-gray-600">
                drag · scroll · ctrl+wheel zoom
            </p>
        </div>
    );
}
