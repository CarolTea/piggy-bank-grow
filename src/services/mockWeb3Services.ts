// Mock Web3 Services — simulates Privy, Jupiter, Kamino/Jito

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface User {
  id: string;
  name: string;
  email: string;
  walletAddress: string;
}

// Privy Auth Mock
export const mockPrivyAuth = async (method: 'google' | 'apple' | 'email', email?: string): Promise<User> => {
  await delay(1200);
  return {
    id: 'usr_' + Math.random().toString(36).slice(2, 10),
    name: method === 'email' ? (email?.split('@')[0] || 'Usuário') : 'Usuário Smart Pig',
    email: email || `user@${method}.com`,
    walletAddress: '0x' + Math.random().toString(36).slice(2, 14) + '...',
  };
};

// Jupiter API Quote Mock
export const mockJupiterQuote = async (amountBRL: number) => {
  await delay(600);
  const solPrice = 680.50; // BRL per SOL
  const solAmount = amountBRL / solPrice;
  return {
    inputMint: 'BRL',
    outputMint: 'SOL',
    inAmount: amountBRL,
    outAmount: parseFloat(solAmount.toFixed(6)),
    priceImpact: 0.01,
    fee: 0,
    route: 'Jupiter Gasless Swap',
  };
};

// Kamino/Jito Yield Mock
export const mockKaminoYield = async () => {
  await delay(400);
  return {
    apy: 5.87,
    protocol: 'Jito Staking + Kamino Vaults',
    dailyYield: 5.87 / 365,
    tvl: 1_200_000_000,
  };
};

// Deposit Mock
export const mockDeposit = async (amountBRL: number) => {
  await delay(1800);
  const quote = await mockJupiterQuote(amountBRL);
  return {
    success: true,
    txHash: 'tx_' + Math.random().toString(36).slice(2, 14),
    amountBRL,
    amountSOL: quote.outAmount,
    confirmationTime: '0.4s',
    message: 'Depósito confirmado na rede Solana!',
  };
};

// Withdraw Mock
export const mockWithdraw = async (amountBRL: number) => {
  await delay(2000);
  return {
    success: true,
    txHash: 'tx_' + Math.random().toString(36).slice(2, 14),
    amountBRL,
    estimatedArrival: '1-2 dias úteis',
    message: 'Saque processado com sucesso!',
  };
};

// Transaction History Mock
export interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'yield';
  amount: number;
  date: Date;
  status: 'completed' | 'pending';
}

export const mockTransactionHistory = (): Transaction[] => [
  { id: '1', type: 'deposit', amount: 100, date: new Date(Date.now() - 86400000 * 1), status: 'completed' },
  { id: '2', type: 'yield', amount: 0.16, date: new Date(Date.now() - 86400000 * 1), status: 'completed' },
  { id: '3', type: 'deposit', amount: 250, date: new Date(Date.now() - 86400000 * 3), status: 'completed' },
  { id: '4', type: 'yield', amount: 0.12, date: new Date(Date.now() - 86400000 * 3), status: 'completed' },
  { id: '5', type: 'deposit', amount: 50, date: new Date(Date.now() - 86400000 * 7), status: 'completed' },
];

// Flashcard data
export interface Flashcard {
  id: number;
  title: string;
  content: string;
  emoji: string;
  color: string;
}

export const mockFlashcards: Flashcard[] = [
  {
    id: 1,
    title: 'Como seu dinheiro rende?',
    content: 'Seu dinheiro é investido automaticamente em cofres digitais seguros. É como uma poupança turbinada que rende 5.87% ao ano — muito mais que a poupança tradicional!',
    emoji: '💰',
    color: 'from-primary to-secondary',
  },
  {
    id: 2,
    title: 'O que são Cofres Digitais?',
    content: 'Imagine um cofre super seguro na internet que guarda e multiplica seu dinheiro automaticamente. Milhares de pessoas usam o mesmo cofre, o que gera mais rendimento para todos!',
    emoji: '🏦',
    color: 'from-blue-500 to-cyan-400',
  },
  {
    id: 3,
    title: 'Por que é tão seguro?',
    content: 'Seu dinheiro está protegido por tecnologia de ponta — a mesma usada por grandes bancos digitais. Ninguém além de você pode movimentar seus fundos. Simples assim!',
    emoji: '🔒',
    color: 'from-emerald-500 to-teal-400',
  },
  {
    id: 4,
    title: 'Rendimento Diário',
    content: 'Diferente da poupança que rende só uma vez por mês, aqui seu dinheiro rende todos os dias! Quanto mais tempo fica, mais cresce — é o poder dos juros compostos.',
    emoji: '📈',
    color: 'from-amber-500 to-orange-400',
  },
  {
    id: 5,
    title: 'Pix Automático',
    content: 'Configure um valor para ser poupado automaticamente todo mês via Pix. Sem esforço, sem esquecer. É a melhor forma de criar o hábito de poupar!',
    emoji: '⚡',
    color: 'from-violet-500 to-purple-400',
  },
  {
    id: 6,
    title: 'Taxas Zero',
    content: 'No Smart Pig, você não paga nenhuma taxa para depositar ou sacar. O rendimento que mostramos já é líquido — o que você vê é o que você ganha!',
    emoji: '🎉',
    color: 'from-pink-500 to-rose-400',
  },
];
