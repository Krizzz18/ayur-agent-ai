import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  RefreshCw, 
  Download, 
  Upload, 
  Filter,
  GitCompare,
  Eye,
  Leaf,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Food {
  id: string;
  name_english: string;
  name_hindi: string;
  name_regional: string;
  category: string;
  subcategory: string;
  serving_size: string;
  
  // Ayurvedic Properties
  rasa: string[];
  guna: string[];
  virya: string;
  vipaka: string;
  dosha_effect: {
    vata: number;
    pitta: number;
    kapha: number;
  };
  
  // Nutritional Data (per 100g)
  energy_kcal: number;
  protein_g: number;
  carbohydrate_g: number;
  fat_g: number;
  fiber_g: number;
  sugar_g: number;
  
  // Vitamins
  vitamin_a_mcg: number;
  vitamin_c_mg: number;
  vitamin_d_mcg: number;
  vitamin_e_mg: number;
  vitamin_k_mcg: number;
  thiamin_b1_mg: number;
  riboflavin_b2_mg: number;
  niacin_b3_mg: number;
  vitamin_b6_mg: number;
  vitamin_b12_mcg: number;
  folate_mcg: number;
  
  // Minerals
  iron_mg: number;
  calcium_mg: number;
  zinc_mg: number;
  magnesium_mg: number;
  potassium_mg: number;
  sodium_mg: number;
  phosphorus_mg: number;
  copper_mg: number;
  manganese_mg: number;
  selenium_mcg: number;
  
  // Additional Metadata
  season: string[];
  allergens: string[];
  glycemic_index: string;
  cooking_methods: string[];
  region: string[];
  data_source: string;
  data_quality: string;
}

// Lazy-load the comprehensive database to improve initial load performance

const EnhancedFoodDatabase = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [rasaFilter, setRasaFilter] = useState<string[]>([]);
  const [doshaFilter, setDoshaFilter] = useState<string[]>([]);
  const [seasonFilter, setSeasonFilter] = useState<string[]>([]);
  const [allergenFilter, setAllergenFilter] = useState<string[]>([]);
  const [regionFilter, setRegionFilter] = useState<string[]>([]);
  const [qualityFilter, setQualityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [showCompareDialog, setShowCompareDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start with true for initial load
  const [isFiltering, setIsFiltering] = useState(false); // Separate state for filter loading
  const [foods, setFoods] = useState<Food[]>([]);
  const [displayedCount, setDisplayedCount] = useState(200);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const { toast } = useToast();

  // Load food data lazily
  useEffect(() => {
    let active = true;
    const load = async () => {
      setIsLoading(true);
      try {
        const module = await import('@/data/comprehensive_food_database.json');
        if (!active) return;
        setFoods((module.default || []) as Food[]);
      } finally {
        if (active) setIsLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  // Debounce search input to reduce re-filtering cost
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setIsFiltering(false); // Clear filtering state after debounce completes
    }, 300); // Increased from 250ms for better performance
    
    // Show filtering indicator immediately on search change
    if (searchTerm !== debouncedSearch) {
      setIsFiltering(true);
    }
    
    return () => clearTimeout(t);
  }, [searchTerm, debouncedSearch]);

  // Get unique values for filters
  const categories = useMemo(() => {
    const unique = Array.from(new Set(foods.map(f => f.category)));
    return ['all', ...unique.sort()];
  }, [foods]);

  const rasaOptions = ['Sweet', 'Sour', 'Salty', 'Pungent', 'Bitter', 'Astringent'];
  const seasons = ['Spring', 'Summer', 'Monsoon', 'Autumn', 'Winter', 'All'];
  const allergens = ['Gluten', 'Dairy', 'Nuts', 'Soy', 'Egg', 'Shellfish', 'Sesame'];
  const regions = ['North', 'South', 'East', 'West', 'Central'];
  const qualityOptions = ['all', 'Complete', 'Partial', 'Basic'];

  // Filter and sort foods
  const filteredAndSortedFoods = useMemo(() => {
    let filtered = foods.filter(food => {
      // Search term
      const s = debouncedSearch;
      const matchesSearch = !s || 
        food.name_english.toLowerCase().includes(s.toLowerCase()) ||
        food.name_hindi.includes(s) ||
        food.name_regional.toLowerCase().includes(s.toLowerCase());

      // Category filter
      const matchesCategory = categoryFilter === 'all' || food.category === categoryFilter;

      // Rasa filter
      const matchesRasa = rasaFilter.length === 0 || 
        rasaFilter.some(rasa => food.rasa.includes(rasa));

      // Dosha filter
      const matchesDosha = doshaFilter.length === 0 || 
        doshaFilter.some(dosha => {
          const effect = food.dosha_effect[dosha as keyof typeof food.dosha_effect];
          return effect === -1; // Balances the dosha
        });

      // Season filter
      const matchesSeason = seasonFilter.length === 0 || 
        seasonFilter.some(season => food.season.includes(season));

      // Allergen filter
      const matchesAllergen = allergenFilter.length === 0 || 
        allergenFilter.some(allergen => food.allergens.includes(allergen));

      // Region filter
      const matchesRegion = regionFilter.length === 0 || 
        regionFilter.some(region => food.region.includes(region));

      // Quality filter
      const matchesQuality = qualityFilter === 'all' || food.data_quality === qualityFilter;

      return matchesSearch && matchesCategory && matchesRasa && matchesDosha && 
             matchesSeason && matchesAllergen && matchesRegion && matchesQuality;
    });

    // Sort foods
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name_english.toLowerCase();
          bValue = b.name_english.toLowerCase();
          break;
        case 'calories':
          aValue = a.energy_kcal;
          bValue = b.energy_kcal;
          break;
        case 'protein':
          aValue = a.protein_g;
          bValue = b.protein_g;
          break;
        case 'carbs':
          aValue = a.carbohydrate_g;
          bValue = b.carbohydrate_g;
          break;
        case 'fat':
          aValue = a.fat_g;
          bValue = b.fat_g;
          break;
        case 'fiber':
          aValue = a.fiber_g;
          bValue = b.fiber_g;
          break;
        default:
          aValue = a.name_english.toLowerCase();
          bValue = b.name_english.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [foods, debouncedSearch, categoryFilter, rasaFilter, doshaFilter, seasonFilter, 
      allergenFilter, regionFilter, qualityFilter, sortBy, sortOrder]);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(async () => {
      const module = await import('@/data/comprehensive_food_database.json');
      setFoods((module.default || []) as Food[]);
      setIsLoading(false);
      setDisplayedCount(200);
      toast({ title: '🔄 Refreshed', description: 'Food database reloaded successfully' });
    }, 300);
  };

  const handleExport = () => {
    const dataToExport = filteredAndSortedFoods.map(food => ({
      name_english: food.name_english,
      name_hindi: food.name_hindi,
      category: food.category,
      rasa: food.rasa.join(', '),
      dosha_effect: `Vata: ${food.dosha_effect.vata}, Pitta: ${food.dosha_effect.pitta}, Kapha: ${food.dosha_effect.kapha}`,
      energy_kcal: food.energy_kcal,
      protein_g: food.protein_g,
      carbohydrate_g: food.carbohydrate_g,
      fat_g: food.fat_g,
      fiber_g: food.fiber_g,
      data_quality: food.data_quality
    }));

    const csv = [
      Object.keys(dataToExport[0]).join(','),
      ...dataToExport.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ayurvedic_foods.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    toast({ title: '📊 Exported', description: `${filteredAndSortedFoods.length} foods exported to CSV` });
  };

  const handleCompare = () => {
    if (selectedFoods.length < 2) {
      toast({ 
        title: '⚠️ Selection Required', 
        description: 'Please select at least 2 foods to compare' 
      });
      return;
    }
    setShowCompareDialog(true);
  };

  const getDoshaEffectIcon = (effect: number) => {
    if (effect === -1) return <TrendingDown className="h-3 w-3 text-green-500" />;
    if (effect === 1) return <TrendingUp className="h-3 w-3 text-red-500" />;
    return <Minus className="h-3 w-3 text-gray-500" />;
  };

  const getDoshaEffectText = (effect: number) => {
    if (effect === -1) return 'Balances';
    if (effect === 1) return 'Increases';
    return 'Neutral';
  };

  const getQualityIcon = (quality: string) => {
    switch (quality) {
      case 'Complete': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Partial': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'Basic': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setRasaFilter([]);
    setDoshaFilter([]);
    setSeasonFilter([]);
    setAllergenFilter([]);
    setRegionFilter([]);
    setQualityFilter('all');
    setSortBy('name');
    setSortOrder('asc');
  };

  const FoodCard = ({ food }: { food: Food }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{food.name_english}</CardTitle>
            <p className="text-sm text-muted-foreground">{food.name_hindi}</p>
            <p className="text-xs text-muted-foreground">{food.name_regional}</p>
          </div>
          <div className="flex items-center gap-1">
            {getQualityIcon(food.data_quality)}
            <Badge variant="outline" className="text-xs">
              {food.data_quality}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{food.category}</Badge>
          <Badge variant="outline">{food.subcategory}</Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Rasa:</span>
            <div className="flex gap-1">
              {food.rasa.map((r, i) => (
                <Badge key={i} variant="secondary" className="text-xs">{r}</Badge>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <span className="w-12">Vata:</span>
              {getDoshaEffectIcon(food.dosha_effect.vata)}
              <span className="text-xs">{getDoshaEffectText(food.dosha_effect.vata)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-12">Pitta:</span>
              {getDoshaEffectIcon(food.dosha_effect.pitta)}
              <span className="text-xs">{getDoshaEffectText(food.dosha_effect.pitta)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-12">Kapha:</span>
              {getDoshaEffectIcon(food.dosha_effect.kapha)}
              <span className="text-xs">{getDoshaEffectText(food.dosha_effect.kapha)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>Calories: {food.energy_kcal}</div>
          <div>Protein: {food.protein_g}g</div>
          <div>Carbs: {food.carbohydrate_g}g</div>
          <div>Fat: {food.fat_g}g</div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-1">
            {food.season.slice(0, 2).map((s, i) => (
              <Badge key={i} variant="outline" className="text-xs">{s}</Badge>
            ))}
            {food.season.length > 2 && (
              <Badge variant="outline" className="text-xs">+{food.season.length - 2}</Badge>
            )}
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm">
              <Eye className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Leaf className="h-8 w-8 text-green-600" />
            Comprehensive Ayurvedic Food Database
          </h2>
          <p className="text-muted-foreground">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Loading food database...
              </span>
            ) : (
              `${foods.length.toLocaleString()} foods with complete nutritional & Ayurvedic data`
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button 
            variant="outline" 
            onClick={handleCompare}
            disabled={selectedFoods.length < 2}
          >
            <GitCompare className="w-4 h-4 mr-2" />
            Compare ({selectedFoods.length})
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
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
      <Card className="p-6">
        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="search">Search & Filter</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Filters</TabsTrigger>
            <TabsTrigger value="sort">Sort & View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="search" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search foods (English/Hindi/Regional)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
                {isFiltering && (
                  <RefreshCw className="absolute right-3 top-3 h-4 w-4 text-muted-foreground animate-spin" />
                )}
              </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </SelectItem>
              ))}
            </SelectContent>
          </Select>

              <Select value={qualityFilter} onValueChange={setQualityFilter}>
            <SelectTrigger>
                  <SelectValue placeholder="Data Quality" />
            </SelectTrigger>
            <SelectContent>
                  {qualityOptions.map(quality => (
                    <SelectItem key={quality} value={quality}>
                      {quality === 'all' ? 'All Quality' : quality}
                    </SelectItem>
              ))}
            </SelectContent>
          </Select>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Rasa (Taste)</label>
                <div className="space-y-2">
                  {rasaOptions.map(rasa => (
                    <div key={rasa} className="flex items-center space-x-2">
                      <Checkbox
                        id={`rasa-${rasa}`}
                        checked={rasaFilter.includes(rasa)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setRasaFilter([...rasaFilter, rasa]);
                          } else {
                            setRasaFilter(rasaFilter.filter(r => r !== rasa));
                          }
                        }}
                      />
                      <label htmlFor={`rasa-${rasa}`} className="text-sm">{rasa}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Balances Dosha</label>
                <div className="space-y-2">
                  {['vata', 'pitta', 'kapha'].map(dosha => (
                    <div key={dosha} className="flex items-center space-x-2">
                      <Checkbox
                        id={`dosha-${dosha}`}
                        checked={doshaFilter.includes(dosha)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setDoshaFilter([...doshaFilter, dosha]);
                          } else {
                            setDoshaFilter(doshaFilter.filter(d => d !== dosha));
                          }
                        }}
                      />
                      <label htmlFor={`dosha-${dosha}`} className="text-sm capitalize">{dosha}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Season</label>
                <div className="space-y-2">
                  {seasons.map(season => (
                    <div key={season} className="flex items-center space-x-2">
                      <Checkbox
                        id={`season-${season}`}
                        checked={seasonFilter.includes(season)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSeasonFilter([...seasonFilter, season]);
                          } else {
                            setSeasonFilter(seasonFilter.filter(s => s !== season));
                          }
                        }}
                      />
                      <label htmlFor={`season-${season}`} className="text-sm">{season}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sort" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="calories">Calories</SelectItem>
                    <SelectItem value="protein">Protein</SelectItem>
                    <SelectItem value="carbs">Carbohydrates</SelectItem>
                    <SelectItem value="fat">Fat</SelectItem>
                    <SelectItem value="fiber">Fiber</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Order</label>
                <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">View Mode</label>
                <Select value={viewMode} onValueChange={(value: 'table' | 'cards') => setViewMode(value)}>
            <SelectTrigger>
                    <SelectValue />
            </SelectTrigger>
            <SelectContent>
                    <SelectItem value="cards">Cards</SelectItem>
                    <SelectItem value="table">Table</SelectItem>
            </SelectContent>
          </Select>
        </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Active Filters */}
        {(searchTerm || categoryFilter !== 'all' || rasaFilter.length > 0 || 
          doshaFilter.length > 0 || seasonFilter.length > 0 || qualityFilter !== 'all') && (
          <div className="flex items-center gap-2 pt-4 border-t">
            <span className="text-sm font-medium">Active filters:</span>
            {searchTerm && <Badge variant="secondary">Search: {searchTerm}</Badge>}
            {categoryFilter !== 'all' && <Badge variant="secondary">Category: {categoryFilter}</Badge>}
            {rasaFilter.map(rasa => <Badge key={rasa} variant="secondary">Rasa: {rasa}</Badge>)}
            {doshaFilter.map(dosha => <Badge key={dosha} variant="secondary">Balances: {dosha}</Badge>)}
            {seasonFilter.map(season => <Badge key={season} variant="secondary">Season: {season}</Badge>)}
            {qualityFilter !== 'all' && <Badge variant="secondary">Quality: {qualityFilter}</Badge>}
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              Clear All
            </Button>
          </div>
        )}
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
        <p className="text-sm text-muted-foreground">
            Showing {filteredAndSortedFoods.length.toLocaleString()} of {foods.length.toLocaleString()} foods
          </p>
          <div className="flex items-center gap-2">
            <Progress 
              value={(filteredAndSortedFoods.length / foods.length) * 100} 
              className="w-32 h-2" 
            />
            <span className="text-xs text-muted-foreground">
              {((filteredAndSortedFoods.length / foods.length) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {foods.filter(f => f.data_quality === 'Complete').length} Complete
          </Badge>
          <Badge variant="outline">
            {foods.filter(f => f.data_quality === 'Partial').length} Partial
          </Badge>
          <Badge variant="outline">
            {foods.filter(f => f.data_quality === 'Basic').length} Basic
          </Badge>
        </div>
      </div>

      {/* Food Display */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(12)].map((_, i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-20 w-full mb-2" />
              <Skeleton className="h-4 w-full" />
            </Card>
          ))}
        </div>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAndSortedFoods.slice(0, displayedCount).map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      ) : (
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedFoods.length === filteredAndSortedFoods.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedFoods(filteredAndSortedFoods.map(f => f.id));
                      } else {
                        setSelectedFoods([]);
                      }
                    }}
                  />
                </TableHead>
              <TableHead>Food Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Rasa</TableHead>
              <TableHead>Dosha Effects</TableHead>
              <TableHead>Nutrition (per 100g)</TableHead>
                <TableHead>Quality</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
      <TableBody>
        {filteredAndSortedFoods.slice(0, displayedCount).map((food) => (
              <TableRow key={food.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedFoods.includes(food.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedFoods([...selectedFoods, food.id]);
                        } else {
                          setSelectedFoods(selectedFoods.filter(id => id !== food.id));
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div>
                      <div>{food.name_english}</div>
                      <div className="text-sm text-muted-foreground">{food.name_hindi}</div>
                    </div>
                  </TableCell>
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
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-12">Vata:</span>
                        {getDoshaEffectIcon(food.dosha_effect.vata)}
                        <span>{getDoshaEffectText(food.dosha_effect.vata)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-12">Pitta:</span>
                        {getDoshaEffectIcon(food.dosha_effect.pitta)}
                        <span>{getDoshaEffectText(food.dosha_effect.pitta)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-12">Kapha:</span>
                        {getDoshaEffectIcon(food.dosha_effect.kapha)}
                        <span>{getDoshaEffectText(food.dosha_effect.kapha)}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs space-y-1">
                      <div>Cal: {food.energy_kcal} | Protein: {food.protein_g}g</div>
                      <div>Carbs: {food.carbohydrate_g}g | Fat: {food.fat_g}g</div>
                      <div>Fiber: {food.fiber_g}g</div>
                  </div>
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-2">
                      {getQualityIcon(food.data_quality)}
                      <span className="text-xs">{food.data_quality}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                    </Button>
                      <Button variant="ghost" size="sm">
                        <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      )}

      {filteredAndSortedFoods.length > displayedCount && (
        <div className="flex justify-center py-6">
          <Button onClick={() => setDisplayedCount(c => c + 200)} variant="outline">
            Load more ({filteredAndSortedFoods.length - displayedCount} remaining)
          </Button>
        </div>
      )}

      {/* Empty State */}
      {filteredAndSortedFoods.length === 0 && (
        <div className="text-center py-12">
          <Leaf className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No foods found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Try adjusting your search criteria or filters
          </p>
          <Button onClick={clearAllFilters}>
            Clear All Filters
          </Button>
        </div>
      )}

      {/* Compare Dialog */}
      <Dialog open={showCompareDialog} onOpenChange={setShowCompareDialog}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>Compare Foods</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground">
            Food comparison feature coming soon...
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedFoodDatabase;