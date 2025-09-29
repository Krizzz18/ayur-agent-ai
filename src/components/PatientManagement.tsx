import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { User, Plus, Edit, Search, Calendar, Activity, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  dosha: string;
  email: string;
  phone: string;
  dietaryHabits: string;
  mealFrequency: number;
  bowelMovement: string;
  waterIntake: number;
  sleepHours: number;
  exerciseFrequency: string;
  medicalConditions: string[];
  allergies: string[];
  currentMedications: string[];
  notes: string;
  lastVisit: string;
}

const PatientManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingPatient, setIsAddingPatient] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const [patients, setPatients] = useState<Patient[]>([
    {
      id: '1',
      name: 'Ramesh Kumar',
      age: 32,
      gender: 'Male',
      dosha: 'Vata',
      email: 'ramesh.kumar@email.com',
      phone: '+91 98765 43210',
      dietaryHabits: 'Vegetarian',
      mealFrequency: 3,
      bowelMovement: 'Once daily',
      waterIntake: 2.5,
      sleepHours: 7,
      exerciseFrequency: '3-4 times/week',
      medicalConditions: ['Mild Anxiety', 'Dry Skin'],
      allergies: ['Dairy'],
      currentMedications: ['Ashwagandha 500mg'],
      notes: 'Prefers warm, cooked foods. Sensitive to cold weather.',
      lastVisit: '2025-09-15'
    },
    {
      id: '2',
      name: 'Priya Sharma',
      age: 28,
      gender: 'Female',
      dosha: 'Pitta',
      email: 'priya.sharma@email.com',
      phone: '+91 98765 43211',
      dietaryHabits: 'Vegetarian',
      mealFrequency: 4,
      bowelMovement: 'Twice daily',
      waterIntake: 3.0,
      sleepHours: 8,
      exerciseFrequency: 'Daily',
      medicalConditions: ['Acid Reflux', 'Migraines'],
      allergies: [],
      currentMedications: ['Triphala', 'Brahmi'],
      notes: 'Avoid spicy and oily foods. Cooling diet recommended.',
      lastVisit: '2025-09-20'
    },
    {
      id: '3',
      name: 'Anil Patel',
      age: 45,
      gender: 'Male',
      dosha: 'Kapha',
      email: 'anil.patel@email.com',
      phone: '+91 98765 43212',
      dietaryHabits: 'Non-Vegetarian',
      mealFrequency: 3,
      bowelMovement: 'Once daily',
      waterIntake: 2.0,
      sleepHours: 9,
      exerciseFrequency: '2-3 times/week',
      medicalConditions: ['Obesity', 'High Cholesterol'],
      allergies: ['Peanuts'],
      currentMedications: ['Guggul', 'Trikatu'],
      notes: 'Needs weight management. Light, warm foods preferred.',
      lastVisit: '2025-09-22'
    }
  ]);

  const [newPatient, setNewPatient] = useState<Partial<Patient>>({
    name: '',
    age: 0,
    gender: '',
    dosha: '',
    email: '',
    phone: '',
    dietaryHabits: 'Vegetarian',
    mealFrequency: 3,
    bowelMovement: '',
    waterIntake: 2,
    sleepHours: 7,
    exerciseFrequency: '',
    medicalConditions: [],
    allergies: [],
    currentMedications: [],
    notes: ''
  });

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPatient = () => {
    if (!newPatient.name || !newPatient.age || !newPatient.gender || !newPatient.dosha) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const patient: Patient = {
      ...newPatient as Patient,
      id: Date.now().toString(),
      lastVisit: new Date().toISOString().split('T')[0]
    };

    setPatients(prev => [...prev, patient]);
    setIsAddingPatient(false);
    setNewPatient({
      name: '',
      age: 0,
      gender: '',
      dosha: '',
      email: '',
      phone: '',
      dietaryHabits: 'Vegetarian',
      mealFrequency: 3,
      bowelMovement: '',
      waterIntake: 2,
      sleepHours: 7,
      exerciseFrequency: '',
      medicalConditions: [],
      allergies: [],
      currentMedications: [],
      notes: ''
    });

    toast({
      title: "Patient Added",
      description: `${patient.name} has been added successfully`,
    });
  };

  const handleUpdatePatient = () => {
    if (!selectedPatient) return;

    setPatients(prev => prev.map(p => 
      p.id === selectedPatient.id ? selectedPatient : p
    ));

    toast({
      title: "Patient Updated",
      description: `${selectedPatient.name}'s profile has been updated`,
    });

    setSelectedPatient(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <User className="w-6 h-6" />
              Patient Management
            </h2>
            <p className="text-muted-foreground mt-1">
              Comprehensive patient profiles for personalized Ayurvedic care
            </p>
          </div>
          <Dialog open={isAddingPatient} onOpenChange={setIsAddingPatient}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add New Patient
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Patient</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name *</Label>
                    <Input
                      value={newPatient.name}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Age *</Label>
                    <Input
                      type="number"
                      value={newPatient.age}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                      placeholder="Enter age"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Gender *</Label>
                    <Select value={newPatient.gender} onValueChange={(value) => setNewPatient(prev => ({ ...prev, gender: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Primary Dosha *</Label>
                    <Select value={newPatient.dosha} onValueChange={(value) => setNewPatient(prev => ({ ...prev, dosha: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select dosha" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Vata">Vata</SelectItem>
                        <SelectItem value="Pitta">Pitta</SelectItem>
                        <SelectItem value="Kapha">Kapha</SelectItem>
                        <SelectItem value="Vata-Pitta">Vata-Pitta</SelectItem>
                        <SelectItem value="Pitta-Kapha">Pitta-Kapha</SelectItem>
                        <SelectItem value="Vata-Kapha">Vata-Kapha</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={newPatient.email}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Email address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={newPatient.phone}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Phone number"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Dietary Habits</Label>
                  <Select value={newPatient.dietaryHabits} onValueChange={(value) => setNewPatient(prev => ({ ...prev, dietaryHabits: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="Non-Vegetarian">Non-Vegetarian</SelectItem>
                      <SelectItem value="Vegan">Vegan</SelectItem>
                      <SelectItem value="Eggetarian">Eggetarian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Meal Frequency/Day</Label>
                    <Input
                      type="number"
                      value={newPatient.mealFrequency}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, mealFrequency: parseInt(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Water Intake (L/day)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={newPatient.waterIntake}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, waterIntake: parseFloat(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Sleep Hours</Label>
                    <Input
                      type="number"
                      value={newPatient.sleepHours}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, sleepHours: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={newPatient.notes}
                    onChange={(e) => setNewPatient(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes about the patient..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddingPatient(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddPatient}>
                    Add Patient
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search patients by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Patient List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients.map(patient => (
          <Card key={patient.id} className="p-4 hover:shadow-lg transition-ayur">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-lg">{patient.name}</h3>
                <p className="text-sm text-muted-foreground">{patient.age}Y, {patient.gender}</p>
              </div>
              <Badge variant="outline">{patient.dosha}</Badge>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-muted-foreground" />
                <span>{patient.dietaryHabits}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>Last Visit: {new Date(patient.lastVisit).toLocaleDateString()}</span>
              </div>
              {patient.medicalConditions.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {patient.medicalConditions.map(condition => (
                    <Badge key={condition} variant="secondary" className="text-xs">
                      {condition}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setSelectedPatient(patient)}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{patient.name} - Patient Profile</DialogTitle>
                </DialogHeader>
                
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="health">Health Metrics</TabsTrigger>
                    <TabsTrigger value="medical">Medical History</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Age</Label>
                        <p className="text-lg">{patient.age} years</p>
                      </div>
                      <div>
                        <Label>Gender</Label>
                        <p className="text-lg">{patient.gender}</p>
                      </div>
                      <div>
                        <Label>Primary Dosha</Label>
                        <Badge>{patient.dosha}</Badge>
                      </div>
                      <div>
                        <Label>Dietary Habits</Label>
                        <p className="text-lg">{patient.dietaryHabits}</p>
                      </div>
                      <div>
                        <Label>Email</Label>
                        <p className="text-sm">{patient.email}</p>
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <p className="text-sm">{patient.phone}</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="health" className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Meal Frequency</Label>
                        <p className="text-lg">{patient.mealFrequency} times/day</p>
                      </div>
                      <div>
                        <Label>Water Intake</Label>
                        <p className="text-lg">{patient.waterIntake}L/day</p>
                      </div>
                      <div>
                        <Label>Sleep Hours</Label>
                        <p className="text-lg">{patient.sleepHours} hours</p>
                      </div>
                      <div>
                        <Label>Bowel Movement</Label>
                        <p className="text-lg">{patient.bowelMovement}</p>
                      </div>
                      <div>
                        <Label>Exercise Frequency</Label>
                        <p className="text-lg">{patient.exerciseFrequency}</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="medical" className="space-y-4">
                    <div>
                      <Label>Medical Conditions</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {patient.medicalConditions.map(condition => (
                          <Badge key={condition}>{condition}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label>Allergies</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {patient.allergies.length > 0 ? (
                          patient.allergies.map(allergy => (
                            <Badge key={allergy} variant="destructive">{allergy}</Badge>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No known allergies</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label>Current Medications</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {patient.currentMedications.map(med => (
                          <Badge key={med} variant="secondary">{med}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label>Notes</Label>
                      <p className="text-sm mt-2">{patient.notes}</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PatientManagement;
