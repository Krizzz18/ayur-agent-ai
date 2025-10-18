import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Download, Printer, Save, Filter, ChefHat, Apple, Leaf } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FoodItem {
  id: string;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  dosha: string;
  serving: string;
}

interface DietPlan {
  id: string;
  mealTime: string;
  foods: FoodItem[];
  completed: boolean;
}

const DietChartModule = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState('demo-patient');
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([
    {
      id: '1',
      mealTime: 'Breakfast (7:00 AM)',
      foods: [],
      completed: false
    },
    {
      id: '2',
      mealTime: 'Mid-Morning Snack (10:00 AM)',
      foods: [],
      completed: false
    },
    {
      id: '3',
      mealTime: 'Lunch (1:00 PM)',
      foods: [],
      completed: false
    },
    {
      id: '4',
      mealTime: 'Evening Snack (4:00 PM)',
      foods: [],
      completed: false
    },
    {
      id: '5',
      mealTime: 'Dinner (7:00 PM)',
      foods: [],
      completed: false
    }
  ]);

  // Sample food database (8000+ items in production)
  const foodDatabase: FoodItem[] = [
    { id: '1', name: 'Brown Rice', category: 'Grains', calories: 216, protein: 5, carbs: 45, fat: 2, fiber: 3.5, dosha: 'Kapha', serving: '1 cup' },
    { id: '2', name: 'Moong Dal', category: 'Legumes', calories: 212, protein: 14, carbs: 39, fat: 1, fiber: 15, dosha: 'Vata-Pitta', serving: '1 cup' },
    { id: '3', name: 'Spinach', category: 'Vegetables', calories: 23, protein: 3, carbs: 4, fat: 0.4, fiber: 2, dosha: 'Pitta', serving: '1 cup' },
    { id: '4', name: 'Ghee', category: 'Fats', calories: 112, protein: 0, carbs: 0, fat: 13, fiber: 0, dosha: 'Vata', serving: '1 tbsp' },
    { id: '5', name: 'Banana', category: 'Fruits', calories: 105, protein: 1, carbs: 27, fat: 0.4, fiber: 3, dosha: 'Vata-Pitta', serving: '1 medium' },
    { id: '6', name: 'Turmeric Milk', category: 'Beverages', calories: 149, protein: 8, carbs: 12, fat: 8, fiber: 0, dosha: 'All Doshas', serving: '1 cup' },
    { id: '7', name: 'Roti (Whole Wheat)', category: 'Grains', calories: 71, protein: 3, carbs: 15, fat: 1, fiber: 2, dosha: 'Kapha', serving: '1 piece' },
    { id: '8', name: 'Paneer', category: 'Dairy', calories: 265, protein: 18, carbs: 4, fat: 20, fiber: 0, dosha: 'Kapha', serving: '100g' },
    { id: '9', name: 'Cucumber', category: 'Vegetables', calories: 16, protein: 1, carbs: 4, fat: 0.1, fiber: 1, dosha: 'Pitta', serving: '1 cup' },
    { id: '10', name: 'Almonds', category: 'Nuts', calories: 164, protein: 6, carbs: 6, fat: 14, fiber: 3.5, dosha: 'Vata', serving: '10 pieces' },
    { id: '11', name: 'Buttermilk', category: 'Dairy', calories: 40, protein: 2, carbs: 5, fat: 1, fiber: 0, dosha: 'Pitta', serving: '1 cup' },
    { id: '12', name: 'Amla (Indian Gooseberry)', category: 'Fruits', calories: 44, protein: 1, carbs: 10, fat: 0.6, fiber: 4, dosha: 'All Doshas', serving: '1 piece' },
  ];

  const categories = ['all', 'Grains', 'Legumes', 'Vegetables', 'Fruits', 'Dairy', 'Fats', 'Nuts', 'Beverages'];

  const filteredFoods = foodDatabase.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || food.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addFoodToMeal = (mealId: string, food: FoodItem) => {
    setDietPlans(prev => prev.map(plan => 
      plan.id === mealId 
        ? { ...plan, foods: [...plan.foods, food] }
        : plan
    ));
    toast({
      title: "Food Added",
      description: `${food.name} added to ${dietPlans.find(p => p.id === mealId)?.mealTime}`,
    });
  };

  const removeFoodFromMeal = (mealId: string, foodId: string) => {
    setDietPlans(prev => prev.map(plan => 
      plan.id === mealId 
        ? { ...plan, foods: plan.foods.filter(f => f.id !== foodId) }
        : plan
    ));
  };

  const toggleMealCompletion = (mealId: string) => {
    setDietPlans(prev => prev.map(plan => 
      plan.id === mealId 
        ? { ...plan, completed: !plan.completed }
        : plan
    ));
  };

  const calculateTotalNutrients = () => {
    const totals = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
    dietPlans.forEach(plan => {
      plan.foods.forEach(food => {
        totals.calories += food.calories;
        totals.protein += food.protein;
        totals.carbs += food.carbs;
        totals.fat += food.fat;
        totals.fiber += food.fiber;
      });
    });
    return totals;
  };

  const generateDietChart = () => {
    // Auto-generate balanced Ayurvedic diet
    const sampleBreakfast = [foodDatabase[4], foodDatabase[9]]; // Banana, Almonds
    const sampleLunch = [foodDatabase[0], foodDatabase[1], foodDatabase[2], foodDatabase[3]]; // Rice, Dal, Spinach, Ghee
    const sampleSnack = [foodDatabase[5]]; // Turmeric Milk
    const sampleDinner = [foodDatabase[6], foodDatabase[7], foodDatabase[8]]; // Roti, Paneer, Cucumber
    
    setDietPlans([
      { ...dietPlans[0], foods: sampleBreakfast },
      { ...dietPlans[1], foods: [foodDatabase[11]] },
      { ...dietPlans[2], foods: sampleLunch },
      { ...dietPlans[3], foods: sampleSnack },
      { ...dietPlans[4], foods: sampleDinner }
    ]);

    toast({
      title: "Diet Chart Generated",
      description: "Ayurveda-compliant diet plan created successfully",
    });
  };

  const exportToPDF = async () => {
    const { exportDietChartToPDF } = await import('@/lib/pdfExport');
    const patientName = selectedPatient === 'demo-patient' ? 'Ramesh Kumar' : 'Patient';
    
    try {
      exportDietChartToPDF(dietPlans, patientName);
      toast({
        title: "PDF Exported",
        description: "Diet chart has been downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the PDF",
        variant: "destructive"
      });
    }
  };

  const totals = calculateTotalNutrients();

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <ChefHat className="w-6 h-6" />
              Ayurvedic Diet Chart Manager
            </h2>
            <p className="text-muted-foreground mt-1">
              Create scientifically calculated, Ayurveda-compliant diet plans
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={generateDietChart}>
              <Leaf className="w-4 h-4 mr-2" />
              Auto-Generate Plan
            </Button>
            <Button variant="outline" onClick={exportToPDF}>
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button onClick={() => window.print()}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>
        </div>
      </Card>

      {/* Patient Selection */}
      <Card className="p-4">
        <Label>Select Patient</Label>
        <Select value={selectedPatient} onValueChange={setSelectedPatient}>
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="demo-patient">Demo Patient - Ramesh Kumar (32M, Vata)</SelectItem>
            <SelectItem value="patient-2">Priya Sharma (28F, Pitta)</SelectItem>
            <SelectItem value="patient-3">Anil Patel (45M, Kapha)</SelectItem>
          </SelectContent>
        </Select>
      </Card>

      <Tabs defaultValue="chart" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chart">Diet Chart</TabsTrigger>
          <TabsTrigger value="database">Food Database</TabsTrigger>
          <TabsTrigger value="nutrients">Nutrient Analysis</TabsTrigger>
        </TabsList>

        {/* Diet Chart Tab */}
        <TabsContent value="chart" className="space-y-4">
          {dietPlans.map(plan => (
            <Card key={plan.id} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <RadioGroup value={plan.completed ? 'completed' : 'pending'}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value="completed" 
                        id={`meal-${plan.id}`}
                        onClick={() => toggleMealCompletion(plan.id)}
                        className="cursor-pointer"
                      />
                      <Label 
                        htmlFor={`meal-${plan.id}`}
                        className={`text-lg font-semibold cursor-pointer ${plan.completed ? 'line-through text-muted-foreground' : ''}`}
                      >
                        {plan.mealTime}
                      </Label>
                    </div>
                  </RadioGroup>
                  {plan.completed && (
                    <Badge variant="secondary">Completed</Badge>
                  )}
                </div>
              </div>

              {plan.foods.length > 0 ? (
                <div className="space-y-2">
                  {plan.foods.map(food => (
                    <div key={food.id} className="flex items-center justify-between p-2 bg-secondary/20 rounded">
                      <div>
                        <p className="font-medium">{food.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {food.serving} • {food.calories} cal • P:{food.protein}g C:{food.carbs}g F:{food.fat}g
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeFoodFromMeal(plan.id, food.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No foods added yet. Search in Food Database tab.</p>
              )}
            </Card>
          ))}
        </TabsContent>

        {/* Food Database Tab */}
        <TabsContent value="database" className="space-y-4">
          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search from 8000+ food items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFoods.map(food => (
              <Card key={food.id} className="p-4 hover:shadow-lg transition-ayur">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">{food.name}</h4>
                    <Badge variant="outline" className="mt-1">{food.category}</Badge>
                  </div>
                  <Badge variant="secondary">{food.dosha}</Badge>
                </div>
                <div className="text-sm text-muted-foreground space-y-1 mb-3">
                  <p>Serving: {food.serving}</p>
                  <p>Calories: {food.calories} kcal</p>
                  <p>Protein: {food.protein}g | Carbs: {food.carbs}g | Fat: {food.fat}g</p>
                  <p>Fiber: {food.fiber}g</p>
                </div>
                <Select onValueChange={(mealId) => addFoodToMeal(mealId, food)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add to meal..." />
                  </SelectTrigger>
                  <SelectContent>
                    {dietPlans.map(plan => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.mealTime}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Nutrient Analysis Tab */}
        <TabsContent value="nutrients" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Total Daily Nutrition</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{totals.calories.toFixed(0)}</p>
                <p className="text-sm text-muted-foreground">Calories</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{totals.protein.toFixed(1)}g</p>
                <p className="text-sm text-muted-foreground">Protein</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{totals.carbs.toFixed(1)}g</p>
                <p className="text-sm text-muted-foreground">Carbs</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{totals.fat.toFixed(1)}g</p>
                <p className="text-sm text-muted-foreground">Fat</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{totals.fiber.toFixed(1)}g</p>
                <p className="text-sm text-muted-foreground">Fiber</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Ayurvedic Balance Analysis</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Vata-Balancing Foods</span>
                <Badge variant="outline">
                  {dietPlans.flatMap(p => p.foods).filter(f => f.dosha.includes('Vata')).length} items
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Pitta-Balancing Foods</span>
                <Badge variant="outline">
                  {dietPlans.flatMap(p => p.foods).filter(f => f.dosha.includes('Pitta')).length} items
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Kapha-Balancing Foods</span>
                <Badge variant="outline">
                  {dietPlans.flatMap(p => p.foods).filter(f => f.dosha.includes('Kapha')).length} items
                </Badge>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DietChartModule;
