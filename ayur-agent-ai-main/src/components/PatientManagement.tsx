import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Edit, Trash2, RefreshCw } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

const PatientManagement = () => {
  const { patients, addPatient, updatePatient, deletePatient } = useAppContext();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [doshaFilter, setDoshaFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    dosha: '',
    symptoms: '',
    status: 'Active'
  });

  const resetForm = () => {
    setFormData({ name: '', age: '', dosha: '', symptoms: '', status: 'Active' });
    setEditingPatient(null);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.age || !formData.dosha) {
      toast({ title: '⚠️ Error', description: 'Please fill all required fields', variant: 'destructive' });
      return;
    }

    const patientData = {
      name: formData.name,
      age: parseInt(formData.age),
      dosha: formData.dosha,
      symptoms: formData.symptoms.split(',').map(s => s.trim()).filter(Boolean),
      lastVisit: new Date(),
      status: formData.status
    };

    if (editingPatient) {
      updatePatient(editingPatient.id, patientData);
      toast({ title: '✅ Patient Updated', description: `${formData.name}'s details updated` });
    } else {
      addPatient(patientData);
      toast({ title: '✅ Patient Added', description: `${formData.name} added successfully` });
    }

    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEdit = (patient: any) => {
    setEditingPatient(patient);
    setFormData({
      name: patient.name,
      age: patient.age.toString(),
      dosha: patient.dosha,
      symptoms: patient.symptoms.join(', '),
      status: patient.status
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete ${name}?`)) {
      deletePatient(id);
      toast({ title: '🗑️ Deleted', description: `${name} removed` });
    }
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDosha = doshaFilter === 'all' || patient.dosha === doshaFilter;
    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
    return matchesSearch && matchesDosha && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Patients</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => toast({ title: '🔄 Refreshed' })}>
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={(open) => { setIsAddDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" />Add Patient</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editingPatient ? 'Edit' : 'Add'} Patient</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div><Label>Name *</Label><Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} /></div>
                <div><Label>Age *</Label><Input type="number" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} /></div>
                <div><Label>Dosha *</Label>
                  <Select value={formData.dosha} onValueChange={(v) => setFormData({...formData, dosha: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Vata">Vata</SelectItem>
                      <SelectItem value="Pitta">Pitta</SelectItem>
                      <SelectItem value="Kapha">Kapha</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Symptoms</Label><Input value={formData.symptoms} onChange={(e) => setFormData({...formData, symptoms: e.target.value})} /></div>
                <Button onClick={handleSubmit} className="w-full">{editingPatient ? 'Update' : 'Add'}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" /></div>
          <Select value={doshaFilter} onValueChange={setDoshaFilter}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="Vata">Vata</SelectItem><SelectItem value="Pitta">Pitta</SelectItem><SelectItem value="Kapha">Kapha</SelectItem></SelectContent></Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="Active">Active</SelectItem></SelectContent></Select>
        </div>
      </Card>

      <Card><Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Age</TableHead><TableHead>Dosha</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader><TableBody>{filteredPatients.length === 0 ? <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No patients found</TableCell></TableRow> : filteredPatients.map(p => <TableRow key={p.id}><TableCell>{p.name}</TableCell><TableCell>{p.age}y</TableCell><TableCell><Badge>{p.dosha}</Badge></TableCell><TableCell><Badge>{p.status}</Badge></TableCell><TableCell className="text-right"><Button variant="ghost" size="sm" onClick={() => handleEdit(p)}><Edit className="w-4 h-4" /></Button><Button variant="ghost" size="sm" onClick={() => handleDelete(p.id, p.name)}><Trash2 className="w-4 h-4" /></Button></TableCell></TableRow>)}</TableBody></Table></Card>
    </div>
  );
};

export default PatientManagement;