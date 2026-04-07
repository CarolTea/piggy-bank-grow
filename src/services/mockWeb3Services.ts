// Mock Web3 Services — simulates Privy, Jupiter, Blend

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface User {
  id: string;
  name: string;
  email: string;
  walletAddress: string;
}

export const mockPrivyAuth = async (method: 'google' | 'apple' | 'email', email?: string): Promise<User> => {
  await delay(1200);
  return {
    id: 'usr_' + Math.random().toString(36).slice(2, 10),
    name: method === 'email' ? (email?.split('@')[0] || 'Usuário') : 'Usuário Smart Pig',
    email: email || `user@${method}.com`,
    walletAddress: '0x' + Math.random().toString(36).slice(2, 14) + '...',
  };
};

export const mockJupiterQuote = async (amountBRL: number) => {
  await delay(600);
  const solPrice = 680.50;
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

export const mockKaminoYield = async () => {
  await delay(400);
  return {
    apy: 5.87,
    protocol: 'Blend Protocol',
    dailyYield: 5.87 / 365,
    tvl: 1_200_000_000,
  };
};

export const mockDeposit = async (amountBRL: number) => {
  await delay(1800);
  const quote = await mockJupiterQuote(amountBRL);
  return {
    success: true,
    txHash: 'tx_' + Math.random().toString(36).slice(2, 14),
    amountBRL,
    amountSOL: quote.outAmount,
    confirmationTime: '0.4s',
    message: 'Depósito confirmado na rede Stellar!',
  };
};

export const mockWithdraw = async (amountBRL: number) => {
  await delay(2000);
  return {
    success: true,
    txHash: 'tx_' + Math.random().toString(36).slice(2, 14),
    amountBRL,
    estimatedArrival: '1-2 dias úteis',
    message: 'Saque processado com sucesso via Stellar!',
  };
};

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
    title: 'O que é DeFi?',
    content: 'DeFi (Finanças Descentralizadas) são serviços financeiros que funcionam sem bancos. Seu dinheiro é gerenciado por contratos inteligentes — programas automáticos que nunca dormem e não cobram taxas abusivas.',
    emoji: '🏦',
    color: 'from-violet-600 to-purple-500',
  },
  {
    id: 2,
    title: 'Como funciona o Yield Farming?',
    content: 'Yield Farming é como "plantar" seu dinheiro em um cofre digital e colher rendimentos todo dia. Você empresta seus recursos para protocolos DeFi, que pagam juros automaticamente. É a poupança do futuro!',
    emoji: '🌾',
    color: 'from-emerald-600 to-green-500',
  },
  {
    id: 3,
    title: 'Staking — Rendimento Passivo',
    content: 'Staking é como deixar seu dinheiro "trabalhando" para validar transações na blockchain. Em troca, você recebe recompensas diárias. No Smart Pig, seu saldo rende automaticamente via Blend na Stellar.',
    emoji: '⛏️',
    color: 'from-amber-600 to-orange-500',
  },
  {
    id: 4,
    title: 'O que é a Stellar?',
    content: 'Stellar é uma rede blockchain ultra-rápida que processa milhares de transações por segundo, com taxas quase zero. É a "rodovia expressa" das criptomoedas — seu dinheiro viaja por ela de forma invisível e instantânea.',
    emoji: '⚡',
    color: 'from-purple-600 to-indigo-500',
  },
  {
    id: 5,
    title: 'Blend Protocol — Cofres Inteligentes',
    content: 'Seus reais são convertidos automaticamente e depositados no Blend Protocol na Stellar. Esse protocolo usa estratégias DeFi avançadas para maximizar seu rendimento 24h por dia, sem você precisar fazer nada.',
    emoji: '🏛️',
    color: 'from-cyan-600 to-blue-500',
  },
  {
    id: 6,
    title: 'Liquidez — Por que Seus Reais Rendem',
    content: 'Quando você deposita no Smart Pig, seu dinheiro entra em pools de liquidez. Outros usuários usam essa liquidez para trocar tokens, e você recebe uma parte das taxas. Quanto mais gente usa, mais você ganha!',
    emoji: '💧',
    color: 'from-blue-600 to-cyan-500',
  },
  {
    id: 7,
    title: 'Smart Contracts — Contratos Automáticos',
    content: 'Smart Contracts são programas que executam automaticamente quando certas condições são atendidas. Não precisam de intermediários. É como um contrato que se cumpre sozinho — sem burocracia, sem atrasos.',
    emoji: '📜',
    color: 'from-pink-600 to-rose-500',
  },
  {
    id: 8,
    title: 'Stellar vs Banco Tradicional',
    content: 'Bancos demoram 1-3 dias para transferências e cobram taxas. Na Stellar, transações acontecem em menos de 1 segundo e custam centavos. Seu dinheiro rende 24/7, não só em dias úteis.',
    emoji: '🏎️',
    color: 'from-red-600 to-orange-500',
  },
  {
    id: 9,
    title: 'Risco vs Poupança Tradicional',
    content: 'A poupança rende 6.17% ao ano, mas perde para a inflação. DeFi oferece rendimentos similares ou maiores, com a vantagem de transparência total — você vê exatamente onde seu dinheiro está, em tempo real.',
    emoji: '⚖️',
    color: 'from-slate-600 to-gray-500',
  },
  {
    id: 10,
    title: 'Taxas Zero — Como é Possível?',
    content: 'O Smart Pig não cobra taxas de depósito ou saque. O rendimento que mostramos já é líquido. Ganhamos uma pequena parte do yield gerado, alinhando nosso sucesso com o seu. Quando você ganha, nós ganhamos.',
    emoji: '🎉',
    color: 'from-fuchsia-600 to-pink-500',
  },
  {
    id: 11,
    title: 'Carteira Digital Invisível',
    content: 'Ao criar sua conta, uma carteira digital é criada automaticamente para você. Você não precisa guardar senhas complicadas nem entender de blockchain. Tudo acontece nos bastidores — simples como um app de banco.',
    emoji: '👛',
    color: 'from-teal-600 to-emerald-500',
  },
  {
    id: 12,
    title: 'O Futuro das Finanças',
    content: 'DeFi está revolucionando como o dinheiro funciona. Sem intermediários, sem burocracia, sem fronteiras. O Smart Pig é a porta de entrada mais simples para esse mundo — seu porquinho cuida de tudo para você! 🐷',
    emoji: '🚀',
    color: 'from-indigo-600 to-violet-500',
  },
];
