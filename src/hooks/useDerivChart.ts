'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface Candle {
    epoch: number;
    open: number;
    high: number;
    low: number;
    close: number;
    bull: boolean;
}

export type ChartStatus = 'connecting' | 'loading' | 'live' | 'error' | 'closed';

const APP_ID = 1089; // get your own at developers.deriv.com
const WS_URL = `wss://ws.derivws.com/websockets/v3?app_id=${APP_ID}`;

export const TF_GRANULARITY: Record<string, number> = {
    '1m': 60, '5m': 300, '15m': 900, '1h': 3600, '4h': 14400,
};

export const DERIV_SYMBOLS = [
    { value: 'R_10', label: 'Vol 10' },
    { value: 'R_25', label: 'Vol 25' },
    { value: 'R_50', label: 'Vol 50' },
    { value: 'R_75', label: 'Vol 75' },
    { value: 'R_100', label: 'Vol 100' },
];

type RawCandle = {
    epoch: number | string;
    open: string | number;
    high: string | number;
    low: string | number;
    close: string | number;
};

function parseCandle(c: RawCandle, prev?: Candle): Candle {
    const open = parseFloat(String(c.open));
    const close = parseFloat(String(c.close));
    return {
        epoch: Number(c.epoch),
        open,
        high: parseFloat(String(c.high)),
        low: parseFloat(String(c.low)),
        close,
        bull: prev ? close >= prev.close : close >= open,
    };
}

export function useDerivChart(symbol: string, timeframe: string, count = 150) {
    const [candles, setCandles] = useState<Candle[]>([]);
    const [status, setStatus] = useState<ChartStatus>('connecting');
    const [error, setError] = useState<string | null>(null);

    const wsRef = useRef<WebSocket | null>(null);
    const pingRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const subIdRef = useRef<string | null>(null);
    const mounted = useRef(true);

    const connect = useCallback(() => {
        // Clean up any previous connection
        if (pingRef.current) clearInterval(pingRef.current);
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            if (subIdRef.current) {
                wsRef.current.send(JSON.stringify({ forget: subIdRef.current }));
            }
            wsRef.current.close(1000, 'reconnect');
        }
        wsRef.current = null;
        subIdRef.current = null;

        setStatus('connecting');
        setError(null);
        setCandles([]);

        const ws = new WebSocket(WS_URL);
        wsRef.current = ws;

        ws.onopen = () => {
            if (!mounted.current) return;
            setStatus('loading');
            ws.send(JSON.stringify({
                ticks_history: symbol,
                adjust_start_time: 1,
                count,
                end: 'latest',
                style: 'candles',
                granularity: TF_GRANULARITY[timeframe] ?? 60,
                subscribe: 1,
            }));
            // Ping every 30s — Deriv closes idle connections after 2 min
            pingRef.current = setInterval(() => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({ ping: 1 }));
                }
            }, 30_000);
        };

        ws.onmessage = (evt) => {
            if (!mounted.current) return;
            const data = JSON.parse(evt.data as string);

            if (data.error) {
                setStatus('error');
                setError(data.error.message ?? 'Deriv API error');
                return;
            }

            // Initial history batch
            if (data.msg_type === 'candles' && Array.isArray(data.candles)) {
                if (data.subscription?.id) subIdRef.current = data.subscription.id;
                const parsed: Candle[] = data.candles.map((c: RawCandle, i: number, arr: RawCandle[]) =>
                    parseCandle(c, i > 0 ? parseCandle(arr[i - 1]) : undefined)
                );
                setCandles(parsed);
                setStatus('live');
                return;
            }

            // Live OHLC stream
            if (data.msg_type === 'ohlc' && data.ohlc) {
                const ohlc = data.ohlc;
                const updated: Candle = {
                    epoch: Number(ohlc.open_time ?? ohlc.epoch),
                    open: parseFloat(ohlc.open),
                    high: parseFloat(ohlc.high),
                    low: parseFloat(ohlc.low),
                    close: parseFloat(ohlc.close),
                    bull: parseFloat(ohlc.close) >= parseFloat(ohlc.open),
                };

                setCandles(prev => {
                    if (!prev.length) return [updated];
                    const last = prev[prev.length - 1];
                    // Same open_time → update the forming candle
                    if (last.epoch === updated.epoch) {
                        const next = [...prev];
                        next[next.length - 1] = {
                            ...updated,
                            high: Math.max(last.high, updated.high),
                            low: Math.min(last.low, updated.low),
                        };
                        return next;
                    }
                    // New candle
                    return [...prev, updated];
                });
            }
        };

        ws.onerror = () => {
            if (!mounted.current) return;
            setStatus('error');
            setError('WebSocket connection failed. Check your network.');
        };

        ws.onclose = (evt) => {
            if (!mounted.current || evt.code === 1000) return;
            setStatus('closed');
        };
    }, [symbol, timeframe, count]);

    useEffect(() => {
        mounted.current = true;
        connect();
        return () => {
            mounted.current = false;
            if (pingRef.current) clearInterval(pingRef.current);
            if (wsRef.current?.readyState === WebSocket.OPEN) {
                if (subIdRef.current) {
                    wsRef.current.send(JSON.stringify({ forget: subIdRef.current }));
                }
                wsRef.current.close(1000, 'unmount');
            }
        };
    }, [connect]);

    return { candles, status, error, retry: connect };
}