import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import BottomNav from '@/components/BottomNav';
import { LogOut, Save, Wallet, Key, Check } from 'lucide-react';
import { useSound } from '@/hooks/useSound';
import { toast } from 'sonner';

const Profile = () => {
  const { user, logout, setPixKey } = useAuth();
  const navigate = useNavigate();
  const { playClick, playSuccess } = useSound();
  const [pixInput, setPixInput] = useState(user?.pixKey || '');
  const [saved, setSaved] = useState(false);

  if (!user) return null;

  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const handleSave = () => {
    if (!pixInput.trim()) return;
    playClick();
    setPixKey(pixInput.trim());
    setSaved(true);
    playSuccess();
    toast.success('Chave PIX salva com sucesso!');
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    playClick();
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Header */}
      <div className="relative overflow-hidden px-6 pt-12 pb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative flex flex-col items-center gap-3"
        >
          <Avatar className="h-20 w-20 border-2 border-primary">
            <AvatarFallback className="bg-primary/20 text-primary text-2xl font-black">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h1 className="text-xl font-black text-foreground">{user.name}</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </motion.div>
      </div>

      <div className="px-4 space-y-4">
        {/* Wallet */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <Wallet size={18} className="text-secondary" />
                <span className="text-sm font-bold text-muted-foreground">Carteira Digital</span>
              </div>
              <p className="text-sm font-mono text-foreground bg-muted rounded-lg px-3 py-2 break-all">
                {user.walletAddress}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* PIX Key */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-card border-border">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Key size={18} className="text-accent" />
                <span className="text-sm font-bold text-muted-foreground">Chave PIX para Saques</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Cadastre sua chave PIX aqui. Saques serão enviados exclusivamente para esta chave.
              </p>
              <Input
                placeholder="CPF, e-mail, telefone ou chave aleatória"
                value={pixInput}
                onChange={e => setPixInput(e.target.value)}
                className="h-12 bg-muted border-border font-semibold"
              />
              <Button
                onClick={handleSave}
                disabled={!pixInput.trim() || saved}
                className="w-full h-12 font-black rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 transition-transform"
              >
                {saved ? (
                  <span className="flex items-center gap-2"><Check size={18} /> Salvo!</span>
                ) : (
                  <span className="flex items-center gap-2"><Save size={18} /> Salvar Chave PIX</span>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Logout */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full h-12 font-black rounded-xl border-destructive text-destructive hover:bg-destructive/10 active:scale-95 transition-transform"
          >
            <LogOut size={18} /> Sair da Conta
          </Button>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
