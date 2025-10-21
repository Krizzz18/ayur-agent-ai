import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Food {
  id: string;
  name: string;
  category: string;
  rasa: string[];
  virya: string;
  vipaka: string;
  doshaEffect: { vata: string; pitta: string; kapha: string };
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

const sampleFoods: Food[] = [
  { id: '1', name: 'Rice (White)', category: 'Grains', rasa: ['Sweet'], virya: 'Cooling', vipaka: 'Sweet', doshaEffect: { vata: 'Balances', pitta: 'Balances', kapha: 'Increases' }, calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4 },
  { id: '2', name: 'Wheat', category: 'Grains', rasa: ['Sweet'], virya: 'Cooling', vipaka: 'Sweet', doshaEffect: { vata: 'Balances', pitta: 'Balances', kapha: 'Increases' }, calories: 340, protein: 13, carbs: 72, fat: 2.5, fiber: 12 },
  { id: '3', name: 'Moong Dal', category: 'Legumes', rasa: ['Sweet', 'Astringent'], virya: 'Cooling', vipaka: 'Sweet', doshaEffect: { vata: 'Neutral', pitta: 'Balances', kapha: 'Balances' }, calories: 347, protein: 24, carbs: 59, fat: 1.2, fiber: 16 },
  { id: '4', name: 'Ginger', category: 'Spices', rasa: ['Pungent', 'Sweet'], virya: 'Heating', vipaka: 'Sweet', doshaEffect: { vata: 'Balances', pitta: 'Increases', kapha: 'Balances' }, calories: 80, protein: 1.8, carbs: 18, fat: 0.8, fiber: 2 },
  { id: '5', name: 'Turmeric', category: 'Spices', rasa: ['Bitter', 'Pungent'], virya: 'Heating', vipaka: 'Pungent', doshaEffect: { vata: 'Balances', pitta: 'Neutral', kapha: 'Balances' }, calories: 312, protein: 9.7, carbs: 67, fat: 3.2, fiber: 22 },
  { id: '6', name: 'Ghee', category: 'Dairy', rasa: ['Sweet'], virya: 'Cooling', vipaka: 'Sweet', doshaEffect: { vata: 'Balances', pitta: 'Balances', kapha: 'Increases' }, calories: 900, protein: 0, carbs: 0, fat: 100, fiber: 0 },
  { id: '7', name: 'Milk (Cow)', category: 'Dairy', rasa: ['Sweet'], virya: 'Cooling', vipaka: 'Sweet', doshaEffect: { vata: 'Balances', pitta: 'Balances', kapha: 'Increases' }, calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, fiber: 0 },
  { id: '8', name: 'Honey', category: 'Sweeteners', rasa: ['Sweet', 'Astringent'], virya: 'Heating', vipaka: 'Sweet', doshaEffect: { vata: 'Balances', pitta: 'Increases', kapha: 'Balances' }, calories: 304, protein: 0.3, carbs: 82, fat: 0, fiber: 0.2 },
  { id: '9', name: 'Apple', category: 'Fruits', rasa: ['Sweet', 'Astringent'], virya: 'Cooling', vipaka: 'Sweet', doshaEffect: { vata: 'Increases', pitta: 'Balances', kapha: 'Neutral' }, calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4 },
  { id: '10', name: 'Banana', category: 'Fruits', rasa: ['Sweet'], virya: 'Heating', vipaka: 'Sweet', doshaEffect: { vata: 'Balances', pitta: 'Neutral', kapha: 'Increases' }, calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6 },
  { id: '11', name: 'Coconut', category: 'Fruits', rasa: ['Sweet'], virya: 'Cooling', vipaka: 'Sweet', doshaEffect: { vata: 'Balances', pitta: 'Balances', kapha: 'Increases' }, calories: 354, protein: 3.3, carbs: 15, fat: 33, fiber: 9 },
  { id: '12', name: 'Spinach', category: 'Vegetables', rasa: ['Astringent', 'Sweet'], virya: 'Cooling', vipaka: 'Pungent', doshaEffect: { vata: 'Increases', pitta: 'Balances', kapha: 'Balances' }, calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2 },
  { id: '13', name: 'Carrot', category: 'Vegetables', rasa: ['Sweet', 'Bitter'], virya: 'Heating', vipaka: 'Pungent', doshaEffect: { vata: 'Balances', pitta: 'Neutral', kapha: 'Balances' }, calories: 41, protein: 0.9, carbs: 10, fat: 0.2, fiber: 2.8 },
  { id: '14', name: 'Cucumber', category: 'Vegetables', rasa: ['Sweet', 'Astringent'], virya: 'Cooling', vipaka: 'Sweet', doshaEffect: { vata: 'Increases', pitta: 'Balances', kapha: 'Neutral' }, calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5 },
  { id: '15', name: 'Cumin', category: 'Spices', rasa: ['Pungent', 'Bitter'], virya: 'Cooling', vipaka: 'Pungent', doshaEffect: { vata: 'Balances', pitta: 'Neutral', kapha: 'Balances' }, calories: 375, protein: 18, carbs: 44, fat: 22, fiber: 11 },
];

const EnhancedFoodDatabase = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [rasaFilter, setRasaFilter] = useState('all');
  const [doshaFilter, setDoshaFilter] = useState('all');
  const [foods, setFoods] = useState<Food[]>(sampleFoods);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

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
    
    return matchesSearch && matchesCategory && matchesRasa && matchesDosha;
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