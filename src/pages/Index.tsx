import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Item {
  id: number;
  name: string;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  value: number;
}

interface LootBox {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  items: { item: Item; probability: number }[];
  isActive: boolean;
  totalOpened: number;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const salesData = [
    { date: '1 дек', sales: 45, revenue: 22500 },
    { date: '2 дек', sales: 52, revenue: 26000 },
    { date: '3 дек', sales: 38, revenue: 19000 },
    { date: '4 дек', sales: 65, revenue: 32500 },
    { date: '5 дек', sales: 58, revenue: 29000 },
    { date: '6 дек', sales: 72, revenue: 36000 },
    { date: '7 дек', sales: 81, revenue: 40500 },
  ];

  const boxDistribution = [
    { name: 'Common', value: 45, color: '#6B7280' },
    { name: 'Rare', value: 30, color: '#3B82F6' },
    { name: 'Epic', value: 20, color: '#A78BFA' },
    { name: 'Legendary', value: 5, color: '#FBBF24' },
  ];

  const mockItems: Item[] = [
    { id: 1, name: 'Golden Sword', image: '/placeholder.svg', rarity: 'legendary', value: 5000 },
    { id: 2, name: 'Magic Staff', image: '/placeholder.svg', rarity: 'epic', value: 2500 },
    { id: 3, name: 'Silver Coin', image: '/placeholder.svg', rarity: 'common', value: 100 },
    { id: 4, name: 'Ruby Ring', image: '/placeholder.svg', rarity: 'rare', value: 1500 },
  ];

  const [boxes, setBoxes] = useState<LootBox[]>([
    {
      id: 1,
      name: 'Starter Box',
      price: 99,
      description: 'Базовый кейс для новичков с гарантированным дропом',
      image: '/placeholder.svg',
      rarity: 'common',
      items: [
        { item: mockItems[2], probability: 70 },
        { item: mockItems[3], probability: 30 },
      ],
      isActive: true,
      totalOpened: 1247
    },
    {
      id: 2,
      name: 'Premium Mystery',
      price: 499,
      description: 'Премиум кейс с шансом выпадения редких предметов',
      image: '/placeholder.svg',
      rarity: 'rare',
      items: [
        { item: mockItems[2], probability: 40 },
        { item: mockItems[3], probability: 35 },
        { item: mockItems[1], probability: 25 },
      ],
      isActive: true,
      totalOpened: 856
    },
    {
      id: 3,
      name: 'Elite Collection',
      price: 999,
      description: 'Эксклюзивный кейс с легендарными предметами',
      image: '/placeholder.svg',
      rarity: 'epic',
      items: [
        { item: mockItems[1], probability: 60 },
        { item: mockItems[0], probability: 40 },
      ],
      isActive: true,
      totalOpened: 423
    }
  ]);

  const [editingBox, setEditingBox] = useState<LootBox | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const totalRevenue = salesData.reduce((sum, day) => sum + day.revenue, 0);
  const totalSales = salesData.reduce((sum, day) => sum + day.sales, 0);

  const rarityStyles = {
    common: {
      badge: 'bg-gray-500/20 text-gray-300 border-gray-500/50',
      glow: '',
      gradient: 'from-gray-600/20 to-gray-700/20'
    },
    rare: {
      badge: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
      glow: 'glow-blue',
      gradient: 'from-blue-600/20 to-blue-700/20'
    },
    epic: {
      badge: 'bg-purple-500/20 text-purple-300 border-purple-500/50',
      glow: 'glow-purple',
      gradient: 'from-purple-600/20 to-purple-700/20'
    },
    legendary: {
      badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
      glow: 'glow-gold',
      gradient: 'from-yellow-600/20 to-yellow-700/20'
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBox) {
      if (editingBox.id === 0) {
        setBoxes([...boxes, { ...editingBox, id: Date.now() }]);
      } else {
        setBoxes(boxes.map(b => b.id === editingBox.id ? editingBox : b));
      }
      setEditingBox(null);
      setIsDialogOpen(false);
    }
  };

  const handleDelete = (id: number) => {
    setBoxes(boxes.filter(b => b.id !== id));
  };

  const openCreateDialog = () => {
    setEditingBox({
      id: 0,
      name: '',
      price: 0,
      description: '',
      image: '/placeholder.svg',
      rarity: 'common',
      items: [],
      isActive: true,
      totalOpened: 0
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (box: LootBox) => {
    setEditingBox(box);
    setIsDialogOpen(true);
  };

  const toggleBoxStatus = (id: number) => {
    setBoxes(boxes.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b));
  };

  const filteredBoxes = boxes.filter(box => 
    box.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const NavItem = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
    <button
      onClick={() => setActiveTab(value)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        activeTab === value
          ? 'bg-gradient-to-r from-primary/20 to-primary/10 text-primary border-l-2 border-primary'
          : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
      }`}
    >
      <Icon name={icon} size={20} />
      {sidebarOpen && <span className="font-semibold">{label}</span>}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 flex">
      <aside className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-card/50 backdrop-blur-xl border-r border-border/50 transition-all duration-300 flex flex-col`}>
        <div className="p-6 flex items-center justify-between border-b border-border/50">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <Icon name="Box" size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">MysteryBox</h2>
                <p className="text-xs text-muted-foreground">Admin Panel</p>
              </div>
            </div>
          )}
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="hover:bg-muted/50">
            <Icon name={sidebarOpen ? 'PanelLeftClose' : 'PanelLeftOpen'} size={20} />
          </Button>
        </div>
        
        <ScrollArea className="flex-1 px-4 py-6">
          <div className="space-y-2">
            <NavItem icon="LayoutDashboard" label="Дашборд" value="dashboard" />
            <NavItem icon="Package" label="Кейсы" value="boxes" />
            <NavItem icon="Gem" label="Предметы" value="items" />
            <NavItem icon="BarChart3" label="Аналитика" value="analytics" />
            <NavItem icon="Settings" label="Настройки" value="settings" />
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-3 px-3 py-3 bg-muted/30 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/40 to-primary/20 flex items-center justify-center">
              <Icon name="User" size={20} className="text-primary" />
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">Admin</p>
                <p className="text-xs text-muted-foreground truncate">admin@mysterybox.com</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-[1600px] mx-auto">
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Обзор</h1>
                  <p className="text-muted-foreground">Статистика за последние 7 дней</p>
                </div>
                <Button size="lg" className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                  <Icon name="Download" size={20} />
                  Экспорт данных
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-primary/20 hover:border-primary/40 transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl group-hover:scale-110 transition-transform">
                      <Icon name="Package" size={28} className="text-primary" />
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/50">↗ 12%</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1 font-medium">Всего кейсов</p>
                  <p className="text-4xl font-bold">{boxes.length}</p>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-secondary/20 hover:border-secondary/40 transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-xl group-hover:scale-110 transition-transform">
                      <Icon name="ShoppingCart" size={28} className="text-secondary" />
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/50">↗ 8%</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1 font-medium">Продаж</p>
                  <p className="text-4xl font-bold">{totalSales}</p>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-purple-500/20 hover:border-purple-500/40 transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-purple-500/20 to-purple-500/10 rounded-xl group-hover:scale-110 transition-transform">
                      <Icon name="DollarSign" size={28} className="text-purple-400" />
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/50">↗ 15%</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1 font-medium">Выручка</p>
                  <p className="text-4xl font-bold">{totalRevenue.toLocaleString()}₽</p>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-blue-500/20 hover:border-blue-500/40 transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-xl group-hover:scale-110 transition-transform">
                      <Icon name="Users" size={28} className="text-blue-400" />
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/50">↗ 23%</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1 font-medium">Пользователей</p>
                  <p className="text-4xl font-bold">2,847</p>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6 bg-gradient-to-br from-card to-card/50">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">Продажи</h3>
                    <Select defaultValue="7days">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7days">7 дней</SelectItem>
                        <SelectItem value="30days">30 дней</SelectItem>
                        <SelectItem value="90days">90 дней</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="date" stroke="#888" style={{ fontSize: '12px' }} />
                      <YAxis stroke="#888" style={{ fontSize: '12px' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(220, 22%, 10%)', 
                          border: '1px solid rgba(255,255,255,0.1)', 
                          borderRadius: '12px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                        }}
                        labelStyle={{ color: '#fff', fontWeight: 600 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="sales" 
                        stroke="url(#colorGradient)" 
                        strokeWidth={3} 
                        dot={{ fill: '#a78bfa', r: 5 }} 
                        activeDot={{ r: 7, fill: '#a78bfa' }}
                      />
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#a78bfa" />
                          <stop offset="100%" stopColor="#7c3aed" />
                        </linearGradient>
                      </defs>
                    </LineChart>
                  </ResponsiveContainer>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-card to-card/50">
                  <h3 className="text-xl font-bold mb-6">Распределение редкости</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={boxDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={110}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {boxDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(220, 22%, 10%)', 
                          border: '1px solid rgba(255,255,255,0.1)', 
                          borderRadius: '12px' 
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    {boxDistribution.map((item) => (
                      <div key={item.name} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.value}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <Card className="p-6 bg-gradient-to-br from-card to-card/50">
                <h3 className="text-xl font-bold mb-6">Популярность кейсов</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={boxes}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="#888" style={{ fontSize: '13px' }} />
                    <YAxis stroke="#888" style={{ fontSize: '13px' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(220, 22%, 10%)', 
                        border: '1px solid rgba(255,255,255,0.1)', 
                        borderRadius: '12px' 
                      }}
                    />
                    <Bar dataKey="totalOpened" fill="url(#barGradient)" radius={[10, 10, 0, 0]} />
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          )}

          {activeTab === 'boxes' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Кейсы</h1>
                  <p className="text-muted-foreground">Управление лутбоксами</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={openCreateDialog} size="lg" className="gap-2 bg-gradient-to-r from-primary to-primary/80">
                      <Icon name="Plus" size={20} />
                      Создать кейс
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">{editingBox?.id === 0 ? 'Новый кейс' : 'Редактирование'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSave} className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name" className="font-semibold">Название</Label>
                          <Input
                            id="name"
                            value={editingBox?.name || ''}
                            onChange={(e) => setEditingBox(editingBox ? { ...editingBox, name: e.target.value } : null)}
                            required
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="price" className="font-semibold">Цена (₽)</Label>
                          <Input
                            id="price"
                            type="number"
                            value={editingBox?.price || 0}
                            onChange={(e) => setEditingBox(editingBox ? { ...editingBox, price: Number(e.target.value) } : null)}
                            required
                            className="mt-2"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="description" className="font-semibold">Описание</Label>
                        <Textarea
                          id="description"
                          value={editingBox?.description || ''}
                          onChange={(e) => setEditingBox(editingBox ? { ...editingBox, description: e.target.value } : null)}
                          rows={3}
                          className="mt-2"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="rarity" className="font-semibold">Редкость</Label>
                          <Select
                            value={editingBox?.rarity}
                            onValueChange={(value) => setEditingBox(editingBox ? { ...editingBox, rarity: value as LootBox['rarity'] } : null)}
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="common">Common</SelectItem>
                              <SelectItem value="rare">Rare</SelectItem>
                              <SelectItem value="epic">Epic</SelectItem>
                              <SelectItem value="legendary">Legendary</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-end justify-between pb-2">
                          <Label htmlFor="active" className="font-semibold">Активен</Label>
                          <Switch
                            id="active"
                            checked={editingBox?.isActive}
                            onCheckedChange={(checked) => setEditingBox(editingBox ? { ...editingBox, isActive: checked } : null)}
                          />
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <Label className="text-lg font-semibold">Содержимое</Label>
                        <p className="text-sm text-muted-foreground mb-4">Предметы и вероятности</p>
                        
                        <div className="space-y-3">
                          {editingBox?.items.map((boxItem, index) => (
                            <Card key={index} className="p-4 bg-muted/30">
                              <div className="flex items-center gap-4">
                                <img src={boxItem.item.image} alt={boxItem.item.name} className="w-12 h-12 rounded-lg" />
                                <div className="flex-1">
                                  <p className="font-semibold">{boxItem.item.name}</p>
                                  <p className="text-sm text-muted-foreground">Шанс: {boxItem.probability}%</p>
                                </div>
                                <Badge className={rarityStyles[boxItem.item.rarity].badge}>
                                  {boxItem.item.rarity}
                                </Badge>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>

                      <Button type="submit" className="w-full" size="lg">Сохранить</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <Card className="p-6 bg-gradient-to-br from-card to-card/50">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative flex-1">
                    <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Поиск..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-muted/30"
                    />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все</SelectItem>
                      <SelectItem value="active">Активные</SelectItem>
                      <SelectItem value="inactive">Неактивные</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {filteredBoxes.map((box) => (
                    <Card 
                      key={box.id} 
                      className={`overflow-hidden bg-gradient-to-br ${rarityStyles[box.rarity].gradient} border-2 border-${box.rarity === 'common' ? 'gray' : box.rarity === 'rare' ? 'blue' : box.rarity === 'epic' ? 'purple' : 'yellow'}-500/30 hover:scale-105 hover:${rarityStyles[box.rarity].glow} transition-all duration-300 group`}
                    >
                      <div className="aspect-video bg-muted/50 relative overflow-hidden">
                        <img src={box.image} alt={box.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className={`absolute top-3 right-3 px-3 py-1.5 backdrop-blur-xl rounded-full ${rarityStyles[box.rarity].badge} font-semibold text-xs`}>
                          {box.rarity}
                        </div>
                        {!box.isActive && (
                          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                            <span className="text-white font-bold">НЕАКТИВЕН</span>
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="text-xl font-bold mb-2">{box.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{box.description}</p>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-2xl font-bold text-primary">{box.price}₽</span>
                          <span className="text-sm text-muted-foreground">{box.totalOpened.toLocaleString()} открытий</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => openEditDialog(box)} className="flex-1">
                            <Icon name="Pencil" size={16} />
                          </Button>
                          <Button size="sm" variant="outline" className="text-destructive flex-1" onClick={() => handleDelete(box.id)}>
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="border border-border/50 rounded-xl overflow-hidden bg-muted/20">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-border/50">
                        <TableHead className="font-semibold">Кейс</TableHead>
                        <TableHead className="font-semibold">Цена</TableHead>
                        <TableHead className="font-semibold">Редкость</TableHead>
                        <TableHead className="font-semibold">Открыто</TableHead>
                        <TableHead className="font-semibold">Статус</TableHead>
                        <TableHead className="text-right font-semibold">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBoxes.map((box) => (
                        <TableRow key={box.id} className="hover:bg-muted/30 border-border/50">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img src={box.image} alt={box.name} className="w-12 h-12 rounded-lg object-cover" />
                              <div>
                                <p className="font-semibold">{box.name}</p>
                                <p className="text-sm text-muted-foreground line-clamp-1">{box.description}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold">{box.price}₽</TableCell>
                          <TableCell>
                            <Badge className={rarityStyles[box.rarity].badge}>{box.rarity}</Badge>
                          </TableCell>
                          <TableCell className="font-mono">{box.totalOpened.toLocaleString()}</TableCell>
                          <TableCell>
                            <Switch
                              checked={box.isActive}
                              onCheckedChange={() => toggleBoxStatus(box.id)}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button size="sm" variant="ghost" onClick={() => openEditDialog(box)}>
                                <Icon name="Pencil" size={16} />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(box.id)}>
                                <Icon name="Trash2" size={16} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'items' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Предметы</h1>
                  <p className="text-muted-foreground">Библиотека предметов</p>
                </div>
                <Button size="lg" className="gap-2 bg-gradient-to-r from-primary to-primary/80">
                  <Icon name="Plus" size={20} />
                  Добавить предмет
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {mockItems.map((item) => (
                  <Card key={item.id} className={`p-5 bg-gradient-to-br ${rarityStyles[item.rarity].gradient} border-2 border-${item.rarity === 'common' ? 'gray' : item.rarity === 'rare' ? 'blue' : item.rarity === 'epic' ? 'purple' : 'yellow'}-500/30 hover:scale-105 hover:${rarityStyles[item.rarity].glow} transition-all group`}>
                    <div className="aspect-square bg-muted/50 rounded-xl mb-4 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <h3 className="font-bold mb-2">{item.name}</h3>
                    <div className="flex items-center justify-between">
                      <Badge className={rarityStyles[item.rarity].badge}>{item.rarity}</Badge>
                      <span className="text-sm font-bold text-primary">{item.value}₽</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Аналитика</h1>
                <p className="text-muted-foreground">Детальная статистика</p>
              </div>

              <Card className="p-6 bg-gradient-to-br from-card to-card/50">
                <h3 className="text-xl font-bold mb-6">Выручка по дням</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="date" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(220, 22%, 10%)', 
                        border: '1px solid rgba(255,255,255,0.1)', 
                        borderRadius: '12px' 
                      }}
                    />
                    <Bar dataKey="revenue" fill="url(#revenueGradient)" radius={[12, 12, 0, 0]} />
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a78bfa" />
                        <stop offset="100%" stopColor="#7c3aed" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Настройки</h1>
                <p className="text-muted-foreground">Конфигурация системы</p>
              </div>

              <Card className="p-6 bg-gradient-to-br from-card to-card/50">
                <h3 className="text-lg font-bold mb-6">Общие настройки</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                    <div>
                      <p className="font-semibold">Уведомления</p>
                      <p className="text-sm text-muted-foreground">Автоматические уведомления о событиях</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                    <div>
                      <p className="font-semibold">Режим обслуживания</p>
                      <p className="text-sm text-muted-foreground">Временно отключить сайт</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
