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
    { date: '01.12', sales: 45, revenue: 22500 },
    { date: '02.12', sales: 52, revenue: 26000 },
    { date: '03.12', sales: 38, revenue: 19000 },
    { date: '04.12', sales: 65, revenue: 32500 },
    { date: '05.12', sales: 58, revenue: 29000 },
    { date: '06.12', sales: 72, revenue: 36000 },
    { date: '07.12', sales: 81, revenue: 40500 },
  ];

  const boxDistribution = [
    { name: 'Common', value: 45, color: '#6B7280' },
    { name: 'Rare', value: 30, color: '#3B82F6' },
    { name: 'Epic', value: 20, color: '#9b87f5' },
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

  const rarityColors = {
    common: 'border-gray-500 bg-gray-500/10 text-gray-300',
    rare: 'border-blue-500 bg-blue-500/10 text-blue-300',
    epic: 'border-purple-500 bg-purple-500/10 text-purple-300',
    legendary: 'border-yellow-500 bg-yellow-500/10 text-yellow-300'
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
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        activeTab === value
          ? 'bg-primary text-primary-foreground shadow-lg'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      }`}
    >
      <Icon name={icon} size={20} />
      {sidebarOpen && <span className="font-medium">{label}</span>}
    </button>
  );

  return (
    <div className="min-h-screen bg-background flex">
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-card border-r border-border transition-all duration-300 flex flex-col`}>
        <div className="p-6 flex items-center justify-between">
          {sidebarOpen && <h2 className="text-xl font-bold text-primary">MysteryBox</h2>}
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Icon name={sidebarOpen ? 'PanelLeftClose' : 'PanelLeftOpen'} size={20} />
          </Button>
        </div>
        
        <ScrollArea className="flex-1 px-3">
          <div className="space-y-2">
            <NavItem icon="LayoutDashboard" label="Дашборд" value="dashboard" />
            <NavItem icon="Package" label="Кейсы" value="boxes" />
            <NavItem icon="Gem" label="Предметы" value="items" />
            <NavItem icon="BarChart3" label="Аналитика" value="analytics" />
            <NavItem icon="Settings" label="Настройки" value="settings" />
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Icon name="User" size={20} className="text-primary" />
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Admin</p>
                <p className="text-xs text-muted-foreground truncate">admin@mysterybox.com</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Обзор системы</h1>
                <p className="text-muted-foreground">Статистика за последние 7 дней</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-primary/20 rounded-lg">
                      <Icon name="Package" size={24} className="text-primary" />
                    </div>
                    <Badge variant="outline" className="text-green-500 border-green-500">+12%</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">Всего кейсов</p>
                  <p className="text-3xl font-bold">{boxes.length}</p>
                </Card>

                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-secondary/20 rounded-lg">
                      <Icon name="ShoppingCart" size={24} className="text-secondary" />
                    </div>
                    <Badge variant="outline" className="text-green-500 border-green-500">+8%</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">Продаж</p>
                  <p className="text-3xl font-bold">{totalSales}</p>
                </Card>

                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-accent/20 rounded-lg">
                      <Icon name="DollarSign" size={24} className="text-accent" />
                    </div>
                    <Badge variant="outline" className="text-green-500 border-green-500">+15%</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">Выручка</p>
                  <p className="text-3xl font-bold">{totalRevenue.toLocaleString()}₽</p>
                </Card>

                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-purple-500/20 rounded-lg">
                      <Icon name="Users" size={24} className="text-purple-400" />
                    </div>
                    <Badge variant="outline" className="text-green-500 border-green-500">+23%</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">Активных пользователей</p>
                  <p className="text-3xl font-bold">2,847</p>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-6">Продажи по дням</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2e3a" />
                      <XAxis dataKey="date" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1a1f2c', border: '1px solid #2a2e3a', borderRadius: '8px' }}
                        labelStyle={{ color: '#fff' }}
                      />
                      <Line type="monotone" dataKey="sales" stroke="#9b87f5" strokeWidth={3} dot={{ fill: '#9b87f5', r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>

                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-6">Распределение по редкости</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={boxDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {boxDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1a1f2c', border: '1px solid #2a2e3a', borderRadius: '8px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {boxDistribution.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-muted-foreground">{item.name}: {item.value}%</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <Card className="p-6">
                <h3 className="text-xl font-bold mb-6">Топ кейсов по открытиям</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={boxes}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2e3a" />
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a1f2c', border: '1px solid #2a2e3a', borderRadius: '8px' }}
                    />
                    <Bar dataKey="totalOpened" fill="#0EA5E9" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          )}

          {activeTab === 'boxes' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Управление кейсами</h1>
                  <p className="text-muted-foreground">Создавайте и редактируйте лутбоксы</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={openCreateDialog} size="lg" className="gap-2">
                      <Icon name="Plus" size={20} />
                      Создать кейс
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">{editingBox?.id === 0 ? 'Новый кейс' : 'Редактирование кейса'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSave} className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Название</Label>
                          <Input
                            id="name"
                            value={editingBox?.name || ''}
                            onChange={(e) => setEditingBox(editingBox ? { ...editingBox, name: e.target.value } : null)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="price">Цена (₽)</Label>
                          <Input
                            id="price"
                            type="number"
                            value={editingBox?.price || 0}
                            onChange={(e) => setEditingBox(editingBox ? { ...editingBox, price: Number(e.target.value) } : null)}
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="description">Описание</Label>
                        <Textarea
                          id="description"
                          value={editingBox?.description || ''}
                          onChange={(e) => setEditingBox(editingBox ? { ...editingBox, description: e.target.value } : null)}
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="rarity">Редкость</Label>
                          <Select
                            value={editingBox?.rarity}
                            onValueChange={(value) => setEditingBox(editingBox ? { ...editingBox, rarity: value as LootBox['rarity'] } : null)}
                          >
                            <SelectTrigger>
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

                        <div className="flex items-center justify-between pt-8">
                          <Label htmlFor="active">Активен</Label>
                          <Switch
                            id="active"
                            checked={editingBox?.isActive}
                            onCheckedChange={(checked) => setEditingBox(editingBox ? { ...editingBox, isActive: checked } : null)}
                          />
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <Label className="text-lg">Содержимое кейса</Label>
                        <p className="text-sm text-muted-foreground mb-4">Настройте предметы и их вероятности</p>
                        
                        <div className="space-y-3">
                          {editingBox?.items.map((boxItem, index) => (
                            <Card key={index} className="p-4">
                              <div className="flex items-center gap-4">
                                <img src={boxItem.item.image} alt={boxItem.item.name} className="w-12 h-12 rounded" />
                                <div className="flex-1">
                                  <p className="font-semibold">{boxItem.item.name}</p>
                                  <p className="text-sm text-muted-foreground">Вероятность: {boxItem.probability}%</p>
                                </div>
                                <Badge className={rarityColors[boxItem.item.rarity]}>
                                  {boxItem.item.rarity}
                                </Badge>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>

                      <Button type="submit" className="w-full" size="lg">Сохранить изменения</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <Card className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative flex-1">
                    <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Поиск по названию..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Фильтр" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все кейсы</SelectItem>
                      <SelectItem value="active">Активные</SelectItem>
                      <SelectItem value="inactive">Неактивные</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Кейс</TableHead>
                        <TableHead>Цена</TableHead>
                        <TableHead>Редкость</TableHead>
                        <TableHead>Открыто</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead className="text-right">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBoxes.map((box) => (
                        <TableRow key={box.id} className="hover:bg-muted/50">
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
                            <Badge className={rarityColors[box.rarity]}>{box.rarity}</Badge>
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
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Библиотека предметов</h1>
                <p className="text-muted-foreground">Управление предметами для лутбоксов</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {mockItems.map((item) => (
                  <Card key={item.id} className={`p-4 border-2 ${rarityColors[item.rarity].split(' ')[0]} hover:scale-105 transition-transform`}>
                    <img src={item.image} alt={item.name} className="w-full aspect-square object-cover rounded-lg mb-3" />
                    <h3 className="font-bold mb-1">{item.name}</h3>
                    <div className="flex items-center justify-between">
                      <Badge className={rarityColors[item.rarity]}>{item.rarity}</Badge>
                      <span className="text-sm font-semibold text-primary">{item.value}₽</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Аналитика</h1>
                <p className="text-muted-foreground">Детальная статистика и отчеты</p>
              </div>

              <Card className="p-6">
                <h3 className="text-xl font-bold mb-6">Выручка по дням</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2e3a" />
                    <XAxis dataKey="date" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a1f2c', border: '1px solid #2a2e3a', borderRadius: '8px' }}
                    />
                    <Bar dataKey="revenue" fill="#9b87f5" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Настройки системы</h1>
                <p className="text-muted-foreground">Конфигурация платформы</p>
              </div>

              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">Общие настройки</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Автоматические уведомления</p>
                      <p className="text-sm text-muted-foreground">Отправлять уведомления о новых открытиях</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Режим обслуживания</p>
                      <p className="text-sm text-muted-foreground">Временно отключить доступ к сайту</p>
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
