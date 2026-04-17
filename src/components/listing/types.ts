export interface Token {
    id: string;
    symbol: string;
    name: string;
    ticker: string;
    wallet: string;
    source: string;
    age: string;
    volume: string;
    marketCap: string;
    changePct: string;
    changeType: 'neutral' | 'active' | 'high';
    ds?: string;
    tx: number;
    f: string;
    swaps: number;
    buys: number;
    sells: number;
    avatarColor: string;
}

export const NEW_TOKENS: Token[] = [
    { id: 'n1', symbol: 'PEPEUNC', name: 'PEPEunc', ticker: '$PEPE', wallet: '7xKf...3mPq', source: 'HLbB...pump', age: '6s', volume: '$86', marketCap: '$8.5K', changePct: '0%', changeType: 'neutral', ds: '2d', tx: 1, f: '0', swaps: 24, buys: 18, sells: 6, avatarColor: 'bg-violet-500' },
    { id: 'n2', symbol: 'DOOMERS', name: 'Doomer Wojaks', ticker: '$DOOM', wallet: 'rich...pump', source: 'rich...pump', age: '11s', volume: '$1.7K', marketCap: '$4.2K', changePct: '25%', changeType: 'active', ds: '1d', tx: 2, f: '0.14', swaps: 42, buys: 28, sells: 14, avatarColor: 'bg-orange-500' },
    { id: 'n3', symbol: 'A15', name: 'A15', ticker: '$A15', wallet: 'elon...pump', source: 'elon...pump', age: '12s', volume: '$37', marketCap: '$5.2K', changePct: '0%', changeType: 'neutral', ds: '1mo', tx: 1, f: '0', swaps: 8, buys: 5, sells: 3, avatarColor: 'bg-red-500' },
    { id: 'n4', symbol: '不要买', name: "Don't buy", ticker: '$DBY', wallet: 'Dpw...pump', source: 'Dpw...pump', age: '16s', volume: '$60', marketCap: '$2.0K', changePct: '0%', changeType: 'neutral', ds: '2mo', tx: 1, f: '0', swaps: 12, buys: 7, sells: 5, avatarColor: 'bg-emerald-600' },
    { id: 'n5', symbol: 'ASDF', name: 'asdf', ticker: '$ASDF', wallet: '4QR...pump', source: '4QR...pump', age: '29s', volume: '$186', marketCap: '$4.7K', changePct: '0%', changeType: 'neutral', ds: '11mo', tx: 2, f: '0.019', swaps: 31, buys: 18, sells: 13, avatarColor: 'bg-sky-500' },
    { id: 'n6', symbol: '$CUZ', name: '$CUZ', ticker: '$CUZ', wallet: '7Pay...pump', source: '7Pay...pump', age: '30s', volume: '$255', marketCap: '$2.9K', changePct: '0.4%', changeType: 'neutral', ds: '', tx: 1, f: '0', swaps: 19, buys: 11, sells: 8, avatarColor: 'bg-amber-500' },
];

export const MIGRATE_TOKENS: Token[] = [
    { id: 'm1', symbol: 'APPLE', name: 'Apple', ticker: '$APPLE', wallet: '@apple', source: '@apple', age: '4h', volume: '$2.6K', marketCap: '$256K', changePct: '99%', changeType: 'high', ds: '4h', tx: 206, f: '0', swaps: 156, buys: 89, sells: 67, avatarColor: 'bg-red-500' },
    { id: 'm2', symbol: 'TIKTOK', name: 'TikTok coin', ticker: '$TIK', wallet: '@tiktok_us', source: '@tiktok_us', age: '8h', volume: '$2.0K', marketCap: '$194K', changePct: '99%', changeType: 'high', ds: '8h', tx: 97, f: '0', swaps: 89, buys: 52, sells: 37, avatarColor: 'bg-pink-500' },
    { id: 'm3', symbol: 'GROK', name: 'Grok', ticker: '$GROK', wallet: '@XFreeze', source: '@XFreeze', age: '1h', volume: '$945', marketCap: '$93K', changePct: '99%', changeType: 'high', ds: '1h', tx: 624, f: '0.002', swaps: 67, buys: 41, sells: 26, avatarColor: 'bg-green-600' },
    { id: 'm4', symbol: 'BTCBULL', name: 'Bitcoin Bull', ticker: '$BTCB', wallet: 'C27...pump', source: 'C27...pump', age: '3d', volume: '$8.4K', marketCap: '$1.4K', changePct: '71%', changeType: 'active', ds: '7d', tx: 86, f: '0.559', swaps: 78, buys: 48, sells: 30, avatarColor: 'bg-orange-600' },
    { id: 'm5', symbol: 'UNCWHALE', name: 'The Unc Whale', ticker: '$UNC', wallet: '78p...pump', source: '78p...pump', age: '1h', volume: '$70K', marketCap: '$25.1K', changePct: '30%', changeType: 'active', ds: '1h', tx: 15, f: '6.67', swaps: 44, buys: 29, sells: 15, avatarColor: 'bg-indigo-500' },
    { id: 'm6', symbol: 'KUREIJI', name: 'KUREIJI', ticker: '$KUR', wallet: 'EdRc...pump', source: 'EdRc...pump', age: '3m', volume: '$29.2K', marketCap: '$24.7K', changePct: '0%', changeType: 'neutral', ds: '', tx: 530, f: '0.876', swaps: 92, buys: 58, sells: 34, avatarColor: 'bg-purple-500' },
];

export const MIGRATED_TOKENS: Token[] = [
    { id: 'g1', symbol: 'UNC', name: 'unc', ticker: '$UNC', wallet: '9vD...pump', source: '9vD...pump', age: '54s', volume: '$1.5K', marketCap: '$64.9K', changePct: '1%', changeType: 'neutral', ds: '1m', tx: 77, f: '0', swaps: 156, buys: 89, sells: 67, avatarColor: 'bg-violet-600' },
    { id: 'g2', symbol: 'UNCSTAR', name: 'uncstar', ticker: '$STAR', wallet: 'H8Hw...pump', source: 'H8Hw...pump', age: '3m', volume: '$27.8K', marketCap: '$1.7K', changePct: '4%', changeType: 'neutral', ds: '15m', tx: 368, f: '1.48', swaps: 203, buys: 134, sells: 69, avatarColor: 'bg-blue-500' },
    { id: 'g3', symbol: 'PIXEL', name: 'Pixel Coin', ticker: '$PIXEL', wallet: '93C...pump', source: '93C...pump', age: '5m', volume: '$10K', marketCap: '$346K', changePct: '6%', changeType: 'neutral', ds: '5m', tx: 947, f: '0.052', swaps: 178, buys: 108, sells: 70, avatarColor: 'bg-orange-500' },
    { id: 'g4', symbol: 'PIXEL', name: 'Pixel Coin', ticker: '$PXL2', wallet: 'BVU...pump', source: 'BVU...pump', age: '6m', volume: '$1.2K', marketCap: '$0.8', changePct: '52%', changeType: 'active', ds: '7m', tx: 52, f: '0', swaps: 34, buys: 20, sells: 14, avatarColor: 'bg-red-600' },
    { id: 'g5', symbol: 'K3', name: 'xBelieve', ticker: '$K3', wallet: 'xBel...SOL', source: 'xBel...SOL', age: '8m', volume: '$2.2K', marketCap: '$1.0', changePct: '5%', changeType: 'neutral', ds: '', tx: 152, f: '0.016', swaps: 62, buys: 38, sells: 24, avatarColor: 'bg-teal-500' },
    { id: 'g6', symbol: 'MOD', name: 'Mod', ticker: '$MOD', wallet: 'BDYr...pump', source: 'BDYr...pump', age: '11m', volume: '$6.8K', marketCap: '$1.08', changePct: '56%', changeType: 'active', ds: '11m', tx: 732, f: '0.004', swaps: 119, buys: 72, sells: 47, avatarColor: 'bg-cyan-600' },
];