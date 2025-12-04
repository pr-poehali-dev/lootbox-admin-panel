import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Icon from '@/components/ui/icon';

interface LootBox {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const Index = () => {
  const [boxes, setBoxes] = useState<LootBox[]>([
    {
      id: 1,
      name: 'Starter Box',
      price: 99,
      description: 'Базовый кейс для новичков с гарантированным дропом',
      image: '/placeholder.svg',
      rarity: 'common'
    },
    {
      id: 2,
      name: 'Premium Mystery',
      price: 499,
      description: 'Премиум кейс с шансом выпадения редких предметов',
      image: '/placeholder.svg',
      rarity: 'rare'
    },
    {
      id: 3,
      name: 'Elite Collection',
      price: 999,
      description: 'Эксклюзивный кейс с легендарными предметами',
      image: '/placeholder.svg',
      rarity: 'epic'
    }
  ]);

  const [editingBox, setEditingBox] = useState<LootBox | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const totalRevenue = boxes.reduce((sum, box) => sum + box.price * 42, 0);
  const totalSales = 126;

  const rarityColors = {
    common: 'border-gray-500',
    rare: 'border-blue-500',
    epic: 'border-purple-500',
    legendary: 'border-yellow-500'
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
      rarity: 'common'
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (box: LootBox) => {
    setEditingBox(box);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Mystery Box Admin</h1>
            <p className="text-muted-foreground">Управление лутбоксами и статистикой</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog} size="lg" className="gap-2">
                <Icon name="Plus" size={20} />
                Создать кейс
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingBox?.id === 0 ? 'Новый кейс' : 'Редактирование кейса'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSave} className="space-y-4">
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
                <div>
                  <Label htmlFor="description">Описание</Label>
                  <Textarea
                    id="description"
                    value={editingBox?.description || ''}
                    onChange={(e) => setEditingBox(editingBox ? { ...editingBox, description: e.target.value } : null)}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="rarity">Редкость</Label>
                  <select
                    id="rarity"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={editingBox?.rarity || 'common'}
                    onChange={(e) => setEditingBox(editingBox ? { ...editingBox, rarity: e.target.value as LootBox['rarity'] } : null)}
                  >
                    <option value="common">Common</option>
                    <option value="rare">Rare</option>
                    <option value="rare">Epic</option>
                    <option value="legendary">Legendary</option>
                  </select>
                </div>
                <Button type="submit" className="w-full">Сохранить</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 hover:border-primary transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/20 rounded-lg">
                <Icon name="Package" size={28} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Всего кейсов</p>
                <p className="text-3xl font-bold">{boxes.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:border-secondary transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary/20 rounded-lg">
                <Icon name="TrendingUp" size={28} className="text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Продаж</p>
                <p className="text-3xl font-bold">{totalSales}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:border-accent transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/20 rounded-lg">
                <Icon name="DollarSign" size={28} className="text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Выручка</p>
                <p className="text-3xl font-bold">{totalRevenue.toLocaleString()}₽</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Кейсы</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {boxes.map((box) => (
              <Card 
                key={box.id} 
                className={`overflow-hidden hover:scale-105 transition-all duration-300 border-2 ${rarityColors[box.rarity]}`}
              >
                <div className="aspect-video bg-muted relative overflow-hidden">
                  <img src={box.image} alt={box.name} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 px-3 py-1 bg-background/80 backdrop-blur-sm rounded-full text-xs font-semibold">
                    {box.rarity}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">{box.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{box.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">{box.price}₽</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEditDialog(box)}>
                        <Icon name="Pencil" size={16} />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(box.id)}>
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Название</TableHead>
                  <TableHead>Цена</TableHead>
                  <TableHead>Редкость</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {boxes.map((box) => (
                  <TableRow key={box.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono">{box.id}</TableCell>
                    <TableCell className="font-semibold">{box.name}</TableCell>
                    <TableCell>{box.price}₽</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${rarityColors[box.rarity]}`}>
                        {box.rarity}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" variant="ghost" onClick={() => openEditDialog(box)}>
                          <Icon name="Pencil" size={16} />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(box.id)}>
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
    </div>
  );
};

export default Index;
