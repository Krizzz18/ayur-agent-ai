import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Plus, Edit, Trash2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Food {
  id: string;
  name: string;
  category: string;
  rasa: string[];
  guna?: string[];
  virya: string;
  vipaka: string;
  doshaEffect: { vata: string; pitta: string; kapha: string };
  season?: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  vitamins?: string[];
  minerals?: string[];
}

import foodData from '@/data/foodDatabase.json';

const sampleFoods: Food[] = foodData;

const EnhancedFoodDatabase = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [rasaFilter, setRasaFilter] = useState('all');
  const [doshaFilter, setDoshaFilter] = useState('all');
  const [seasonFilter, setSeasonFilter] = useState('all');
  const [foods, setFoods] = useState<Food[]>(sampleFoods);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleRefresh = () => {
    setFoods(sampleFoods);
    toast({ title: '🔄 Refreshed', description: 'Food database reloaded' });
  };

  const categories = ['all', ...Array.from(new Set(foods.map(f => f.category)))];
  const rasaOptions = ['all', 'Sweet', 'Sour', 'Salty', 'Pungent', 'Bitter', 'Astringent'];

  const filteredFoods = foods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || food.category === categoryFilter;
    const matchesRasa = rasaFilter === 'all' || food.rasa.includes(rasaFilter);
    const matchesDosha = doshaFilter === 'all' || 
      (doshaFilter === 'vata' && food.doshaEffect.vata === 'Balances') ||
      (doshaFilter === 'pitta' && food.doshaEffect.pitta === 'Balances') ||
      (doshaFilter === 'kapha' && food.doshaEffect.kapha === 'Balances');
    const matchesSeason = seasonFilter === 'all' || (food.season && food.season.includes(seasonFilter));
    
    return matchesSearch && matchesCategory && matchesRasa && matchesDosha && matchesSeason;
  });

  const deleteFood = (id: string) => {
    setFoods(foods.filter(f => f.id !== id));
    toast({ title: '✅ Food Deleted', description: 'Food item removed from database' });
  };

  const getDoshaColor = (effect: string) => {
    if (effect === 'Balances') return 'default';
    if (effect === 'Increases') return 'destructive';
    return 'secondary';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Ayurvedic Food Database</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Food
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Food Item</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">Food addition form coming soon...</p>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search foods..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={rasaFilter} onValueChange={setRasaFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Rasa (Taste)" />
            </SelectTrigger>
            <SelectContent>
              {rasaOptions.map(rasa => (
                <SelectItem key={rasa} value={rasa}>{rasa === 'all' ? 'All Rasas' : rasa}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={doshaFilter} onValueChange={setDoshaFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Balances Dosha" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Doshas</SelectItem>
              <SelectItem value="vata">Balances Vata</SelectItem>
              <SelectItem value="pitta">Balances Pitta</SelectItem>
              <SelectItem value="kapha">Balances Kapha</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredFoods.length} of {foods.length} foods
        </p>
        {(categoryFilter !== 'all' || rasaFilter !== 'all' || doshaFilter !== 'all' || searchTerm) && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('all');
              setRasaFilter('all');
              setDoshaFilter('all');
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Food Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Food Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Rasa</TableHead>
              <TableHead>Virya</TableHead>
              <TableHead>Dosha Effects</TableHead>
              <TableHead>Nutrition (per 100g)</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFoods.map((food) => (
              <TableRow key={food.id}>
                <TableCell className="font-medium">{food.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{food.category}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {food.rasa.map((r, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">{r}</Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={food.virya === 'Heating' ? 'destructive' : 'default'}>
                    {food.virya}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-12">Vata:</span>
                      <Badge variant={getDoshaColor(food.doshaEffect.vata)} className="text-xs">
                        {food.doshaEffect.vata}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-12">Pitta:</span>
                      <Badge variant={getDoshaColor(food.doshaEffect.pitta)} className="text-xs">
                        {food.doshaEffect.pitta}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-12">Kapha:</span>
                      <Badge variant={getDoshaColor(food.doshaEffect.kapha)} className="text-xs">
                        {food.doshaEffect.kapha}
                      </Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-xs space-y-1">
                    <div>Cal: {food.calories} | Protein: {food.protein}g</div>
                    <div>Carbs: {food.carbs}g | Fat: {food.fat}g</div>
                    <div>Fiber: {food.fiber}g</div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteFood(food.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default EnhancedFoodDatabase;