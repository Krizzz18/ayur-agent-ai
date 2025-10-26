import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Download, Edit, Eye, Trash2 } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

const DoctorDashboard = () => {
  const { patients, treatmentPlans, addTreatmentPlan, updateTreatmentPlan, deleteTreatmentPlan } = useAppContext();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [viewTreatment, setViewTreatment] = useState<any>(null);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

    const newTreatment = {
      id: Date.now().toString(),
      patientId: selectedPatient,
      patientName: patient.name,
      createdDate: new Date().toISOString().split('T')[0],
      diagnosis: formData.diagnosis,
      treatment: formData.treatment,
      diet: formData.diet,
      lifestyle: formData.lifestyle,
      herbs: formData.treatment, // Using treatment field for herbs
      followUp: formData.followUp,
    };

    addTreatmentPlan(newTreatment);
    setIsAddDialogOpen(false);
    setFormData({ diagnosis: '', treatment: '', diet: '', lifestyle: '', followUp: '' });
    toast({ title: '✅ Treatment Plan Created', description: `Plan created for ${patient.name}` });
  };

  const handleEditTreatment = () => {
    if (!editingPlan) return;

    updateTreatmentPlan(editingPlan.id, formData);
    setIsEditDialogOpen(false);
    setEditingPlan(null);
    setFormData({ diagnosis: '', treatment: '', diet: '', lifestyle: '', followUp: '' });
    toast({ title: '✅ Treatment Plan Updated', description: 'Changes saved successfully' });
  };

  const handleDeleteTreatment = (planId: string, patientName: string) => {
    if (isDeleting) return; // Prevent race condition
    
    if (confirm(`Delete treatment plan for ${patientName}?`)) {
      setIsDeleting(true);
      deleteTreatmentPlan(planId);
      toast({ title: '🗑️ Plan Deleted', description: `Treatment plan for ${patientName} removed` });
      
      // Reset delete lock after delay
      setTimeout(() => setIsDeleting(false), 500);
    }
  };

  const openEditDialog = (plan: any) => {
    setEditingPlan(plan);
    setFormData({
      diagnosis: plan.diagnosis || '',
      treatment: plan.treatment || plan.herbs || '',
      diet: typeof plan.diet === 'string' ? plan.diet : JSON.stringify(plan.diet),
      lifestyle: typeof plan.lifestyle === 'string' ? plan.lifestyle : 
                 Array.isArray(plan.lifestyle) ? plan.lifestyle.join(', ') : '',
      followUp: plan.followUp || '',
    });
    setIsEditDialogOpen(true);
  };

  const downloadPlan = (treatment: any) => {
    try {
      // Validate required fields
      if (!treatment.patientName || !treatment.createdDate) {
        toast({ 
          title: '❌ PDF Export Failed', 
          description: 'Treatment plan is missing required patient information',
          variant: 'destructive'
        });
        return;
      }
      
      const doc = new jsPDF();
      
      doc.setFontSize(20);
      doc.text('Ayurvedic Treatment Plan', 20, 20);
      
      doc.setFontSize(12);
      doc.text(`Patient: ${treatment.patientName}`, 20, 40);
      doc.text(`Date: ${treatment.createdDate}`, 20, 50);
      
      if (treatment.diagnosis) {
        doc.text('Diagnosis:', 20, 70);
        doc.setFontSize(10);
        doc.text(treatment.diagnosis, 20, 80, { maxWidth: 170 });
      }
      
      doc.setFontSize(12);
      doc.text('Treatment:', 20, 100);
      doc.setFontSize(10);
      const treatmentText = typeof treatment.treatment === 'string' ? treatment.treatment : 'See detailed plan';
      doc.text(treatmentText, 20, 110, { maxWidth: 170 });
      
      doc.setFontSize(12);
      doc.text('Diet Recommendations:', 20, 140);
      doc.setFontSize(10);
      const dietText = typeof treatment.diet === 'string' ? treatment.diet : 
                       JSON.stringify(treatment.diet, null, 2).slice(0, 200);
      doc.text(dietText, 20, 150, { maxWidth: 170 });
      
      doc.setFontSize(12);
      doc.text('Lifestyle Modifications:', 20, 180);
      doc.setFontSize(10);
      const lifestyleText = typeof treatment.lifestyle === 'string' ? treatment.lifestyle :
                           Array.isArray(treatment.lifestyle) ? treatment.lifestyle.join(', ') : 'See plan';
      doc.text(lifestyleText, 20, 190, { maxWidth: 170 });
      
      doc.setFontSize(12);
      doc.text(`Follow-up: ${treatment.followUp}`, 20, 220);
      
      doc.save(`treatment-plan-${treatment.patientName}-${treatment.createdDate}.pdf`);
      toast({ title: '📄 PDF Downloaded', description: 'Treatment plan downloaded successfully' });
    } catch (error: any) {
      toast({ 
        title: '❌ PDF Export Failed', 
        description: error.message || 'Failed to generate PDF. Please try again.',
        variant: 'destructive'
      });
    }
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
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto backdrop-blur-xl bg-background/95 border-border/50">
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
                        {patient.name} - {(patient.dosha || patient.prakriti)} ({patient.age}y)
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

      {/* Edit Treatment Plan Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Treatment Plan - {editingPlan?.patientName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
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

            <Button onClick={handleEditTreatment} className="w-full">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold">{patients.length}</div>
          <p className="text-sm text-muted-foreground">Total Patients</p>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold">{treatmentPlans.length}</div>
          <p className="text-sm text-muted-foreground">Treatment Plans</p>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold">
            {treatmentPlans.filter(t => {
              const followUpDays = parseInt(t.followUp) || 14;
              const planDate = new Date(t.createdDate);
              const followUpDate = new Date(planDate.getTime() + followUpDays * 24 * 60 * 60 * 1000);
              return followUpDate > new Date();
            }).length}
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
        {treatmentPlans.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No treatment plans yet. Create your first plan above.</p>
        ) : (
          <div className="space-y-4">
            {treatmentPlans.map((treatment) => (
              <Card key={treatment.id || treatment.patientId + treatment.createdDate} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold">{treatment.patientName}</h4>
                      <Badge variant="outline">
                        {treatment.createdDate}
                      </Badge>
                    </div>
                    {treatment.diagnosis && (
                      <p className="text-sm text-muted-foreground mb-2">
                        <span className="font-medium">Diagnosis:</span> {treatment.diagnosis.substring(0, 100)}
                        {treatment.diagnosis.length > 100 ? '...' : ''}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Follow-up: {treatment.followUp}
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
                      onClick={() => openEditDialog(treatment)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => downloadPlan(treatment)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteTreatment(treatment.id, treatment.patientName)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
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
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto backdrop-blur-xl bg-background/95 border-border/50">
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
                <p className="text-sm">{viewTreatment.createdDate}</p>
              </div>
              {viewTreatment.diagnosis && (
                <div>
                  <Label>Diagnosis</Label>
                  <p className="text-sm">{viewTreatment.diagnosis}</p>
                </div>
              )}
              {viewTreatment.treatment && (
                <div>
                  <Label>Treatment Protocol</Label>
                  <p className="text-sm">{viewTreatment.treatment}</p>
                </div>
              )}
              <div>
                <Label>Diet Recommendations</Label>
                {typeof viewTreatment.diet === 'object' && viewTreatment.diet.favor ? (
                  <div className="text-sm space-y-2">
                    <div>
                      <span className="font-medium">Favor:</span>
                      <ul className="list-disc list-inside">
                        {viewTreatment.diet.favor.map((item: string, i: number) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="font-medium">Avoid:</span>
                      <ul className="list-disc list-inside">
                        {viewTreatment.diet.avoid.map((item: string, i: number) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm">{viewTreatment.diet}</p>
                )}
              </div>
              <div>
                <Label>Lifestyle Modifications</Label>
                {Array.isArray(viewTreatment.lifestyle) ? (
                  <ul className="list-disc list-inside text-sm">
                    {viewTreatment.lifestyle.map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm">{viewTreatment.lifestyle}</p>
                )}
              </div>
              {viewTreatment.herbs && (
                <div>
                  <Label>Herbal Medicines</Label>
                  {Array.isArray(viewTreatment.herbs) ? (
                    <ul className="list-disc list-inside text-sm">
                      {viewTreatment.herbs.map((item: string, i: number) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm">{viewTreatment.herbs}</p>
                  )}
                </div>
              )}
              <div>
                <Label>Follow-up</Label>
                <p className="text-sm">{viewTreatment.followUp}</p>
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