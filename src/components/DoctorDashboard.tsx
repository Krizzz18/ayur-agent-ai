import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Download, Edit, Eye } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

interface Treatment {
  id: string;
  patientId: string;
  patientName: string;
  date: Date;
  diagnosis: string;
  treatment: string;
  diet: string;
  lifestyle: string;
  followUp: Date;
}

const DoctorDashboard = () => {
  const { patients } = useAppContext();
  const { toast } = useToast();
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [viewTreatment, setViewTreatment] = useState<Treatment | null>(null);

  const [formData, setFormData] = useState({
    diagnosis: '',
    treatment: '',
    diet: '',
    lifestyle: '',
    followUp: '',
  });

  const handleAddTreatment = () => {
    if (!selectedPatient) {
      toast({ title: '⚠️ Error', description: 'Please select a patient', variant: 'destructive' });
      return;
    }

    const patient = patients.find(p => p.id === selectedPatient);
    if (!patient) return;

    const newTreatment: Treatment = {
      id: Date.now().toString(),
      patientId: selectedPatient,
      patientName: patient.name,
      date: new Date(),
      diagnosis: formData.diagnosis,
      treatment: formData.treatment,
      diet: formData.diet,
      lifestyle: formData.lifestyle,
      followUp: new Date(formData.followUp),
    };

    setTreatments([...treatments, newTreatment]);
    setIsAddDialogOpen(false);
    setFormData({ diagnosis: '', treatment: '', diet: '', lifestyle: '', followUp: '' });
    toast({ title: '✅ Treatment Plan Created', description: `Plan created for ${patient.name}` });
  };

  const downloadPlan = (treatment: Treatment) => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('Ayurvedic Treatment Plan', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Patient: ${treatment.patientName}`, 20, 40);
    doc.text(`Date: ${treatment.date.toLocaleDateString()}`, 20, 50);
    
    doc.text('Diagnosis:', 20, 70);
    doc.setFontSize(10);
    doc.text(treatment.diagnosis, 20, 80, { maxWidth: 170 });
    
    doc.setFontSize(12);
    doc.text('Treatment:', 20, 100);
    doc.setFontSize(10);
    doc.text(treatment.treatment, 20, 110, { maxWidth: 170 });
    
    doc.setFontSize(12);
    doc.text('Diet Recommendations:', 20, 140);
    doc.setFontSize(10);
    doc.text(treatment.diet, 20, 150, { maxWidth: 170 });
    
    doc.setFontSize(12);
    doc.text('Lifestyle Modifications:', 20, 180);
    doc.setFontSize(10);
    doc.text(treatment.lifestyle, 20, 190, { maxWidth: 170 });
    
    doc.setFontSize(12);
    doc.text(`Follow-up: ${treatment.followUp.toLocaleDateString()}`, 20, 220);
    
    doc.save(`treatment-plan-${treatment.patientName}-${treatment.date.toLocaleDateString()}.pdf`);
    toast({ title: '📄 PDF Downloaded', description: 'Treatment plan downloaded successfully' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Doctor Dashboard</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Treatment Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Treatment Plan</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Select Patient</Label>
                <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map(patient => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name} - {patient.dosha} ({patient.age}y)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Diagnosis</Label>
                <Textarea
                  placeholder="Enter diagnosis and assessment..."
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label>Treatment Protocol</Label>
                <Textarea
                  placeholder="Medications, therapies, Panchakarma procedures..."
                  value={formData.treatment}
                  onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                  rows={4}
                />
              </div>

              <div>
                <Label>Diet Recommendations</Label>
                <Textarea
                  placeholder="Specific foods to eat/avoid, meal timings..."
                  value={formData.diet}
                  onChange={(e) => setFormData({ ...formData, diet: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label>Lifestyle Modifications</Label>
                <Textarea
                  placeholder="Daily routine, exercise, sleep schedule..."
                  value={formData.lifestyle}
                  onChange={(e) => setFormData({ ...formData, lifestyle: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label>Follow-up Date</Label>
                <Input
                  type="date"
                  value={formData.followUp}
                  onChange={(e) => setFormData({ ...formData, followUp: e.target.value })}
                />
              </div>

              <Button onClick={handleAddTreatment} className="w-full">
                Create Treatment Plan
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold">{patients.length}</div>
          <p className="text-sm text-muted-foreground">Total Patients</p>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold">{treatments.length}</div>
          <p className="text-sm text-muted-foreground">Treatment Plans</p>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold">
            {treatments.filter(t => t.followUp > new Date()).length}
          </div>
          <p className="text-sm text-muted-foreground">Upcoming Follow-ups</p>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold">
            {patients.filter(p => p.status === 'Active').length}
          </div>
          <p className="text-sm text-muted-foreground">Active Cases</p>
        </Card>
      </div>

      {/* Treatment Plans List */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Treatment Plans</h3>
        {treatments.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No treatment plans yet. Create your first plan above.</p>
        ) : (
          <div className="space-y-4">
            {treatments.map((treatment) => (
              <Card key={treatment.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold">{treatment.patientName}</h4>
                      <Badge variant="outline">
                        {treatment.date.toLocaleDateString()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      <span className="font-medium">Diagnosis:</span> {treatment.diagnosis.substring(0, 100)}...
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Follow-up: {treatment.followUp.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setViewTreatment(treatment)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => downloadPlan(treatment)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      {/* View Treatment Dialog */}
      {viewTreatment && (
        <Dialog open={!!viewTreatment} onOpenChange={() => setViewTreatment(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Treatment Plan Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Patient</Label>
                <p className="text-sm">{viewTreatment.patientName}</p>
              </div>
              <div>
                <Label>Date</Label>
                <p className="text-sm">{viewTreatment.date.toLocaleDateString()}</p>
              </div>
              <div>
                <Label>Diagnosis</Label>
                <p className="text-sm">{viewTreatment.diagnosis}</p>
              </div>
              <div>
                <Label>Treatment Protocol</Label>
                <p className="text-sm">{viewTreatment.treatment}</p>
              </div>
              <div>
                <Label>Diet Recommendations</Label>
                <p className="text-sm">{viewTreatment.diet}</p>
              </div>
              <div>
                <Label>Lifestyle Modifications</Label>
                <p className="text-sm">{viewTreatment.lifestyle}</p>
              </div>
              <div>
                <Label>Follow-up</Label>
                <p className="text-sm">{viewTreatment.followUp.toLocaleDateString()}</p>
              </div>
              <Button onClick={() => downloadPlan(viewTreatment)} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default DoctorDashboard;