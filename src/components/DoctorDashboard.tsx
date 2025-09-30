import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  FileText, 
  Search,
  Plus,
  Eye,
  Edit,
  Download,
  BarChart3,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Stethoscope
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  dosha: string;
  lastVisit: string;
  status: 'active' | 'pending' | 'completed';
  compliance: number;
  nextAppointment?: string;
  symptoms: string[];
  avatar?: string;
}

const DoctorDashboard = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDosha, setSelectedDosha] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const [patients] = useState<Patient[]>([
    {
      id: '1',
      name: 'Ramesh Kumar',
      age: 32,
      gender: 'Male',
      dosha: 'Vata',
      lastVisit: '2025-09-28',
      status: 'active',
      compliance: 85,
      nextAppointment: '2025-10-05',
      symptoms: ['anxiety', 'insomnia', 'digestion'],
      avatar: '👨'
    },
    {
      id: '2',
      name: 'Priya Sharma',
      age: 28,
      gender: 'Female',
      dosha: 'Pitta',
      lastVisit: '2025-09-29',
      status: 'pending',
      compliance: 92,
      nextAppointment: '2025-10-02',
      symptoms: ['acidity', 'skin', 'headache'],
      avatar: '👩'
    },
    {
      id: '3',
      name: 'Anil Patel',
      age: 45,
      gender: 'Male',
      dosha: 'Kapha',
      lastVisit: '2025-09-25',
      status: 'completed',
      compliance: 78,
      symptoms: ['weight', 'fatigue', 'joint'],
      avatar: '👨‍🦳'
    },
    {
      id: '4',
      name: 'Meera Singh',
      age: 35,
      gender: 'Female',
      dosha: 'Vata-Pitta',
      lastVisit: '2025-09-30',
      status: 'active',
      compliance: 89,
      nextAppointment: '2025-10-07',
      symptoms: ['stress', 'sleep', 'digestion'],
      avatar: '👩‍💼'
    }
  ]);

  const dashboardStats = {
    totalPatients: patients.length,
    activePatients: patients.filter(p => p.status === 'active').length,
    pendingAppointments: patients.filter(p => p.status === 'pending').length,
    avgCompliance: Math.round(patients.reduce((sum, p) => sum + p.compliance, 0) / patients.length),
    todayAppointments: 3,
    weeklyRevenue: 45000,
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.symptoms.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDosha = selectedDosha === 'all' || patient.dosha.toLowerCase().includes(selectedDosha.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || patient.status === selectedStatus;
    
    return matchesSearch && matchesDosha && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getDoshaColor = (dosha: string) => {
    if (dosha.includes('Vata')) return 'gradient-vata';
    if (dosha.includes('Pitta')) return 'gradient-pitta';
    if (dosha.includes('Kapha')) return 'gradient-kapha';
    return 'gradient-healing';
  };

  return (
    <div className="space-y-6">
      {/* Doctor Header */}
      <Card className="p-6 gradient-healing text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <Stethoscope size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Dr. Ayurveda Specialist</h1>
              <p className="text-white/90">Ayurvedic Practice Management Dashboard</p>
              <Badge variant="secondary" className="mt-1 bg-white/20 text-white">
                15+ Years Experience
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{dashboardStats.todayAppointments}</div>
            <p className="text-white/90">Today's Appointments</p>
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 text-center">
          <Users size={32} className="mx-auto mb-3 text-primary" />
          <div className="text-2xl font-bold">{dashboardStats.totalPatients}</div>
          <p className="text-muted-foreground">Total Patients</p>
        </Card>

        <Card className="p-6 text-center">
          <Activity size={32} className="mx-auto mb-3 text-green-500" />
          <div className="text-2xl font-bold">{dashboardStats.activePatients}</div>
          <p className="text-muted-foreground">Active Treatments</p>
        </Card>

        <Card className="p-6 text-center">
          <Clock size={32} className="mx-auto mb-3 text-yellow-500" />
          <div className="text-2xl font-bold">{dashboardStats.pendingAppointments}</div>
          <p className="text-muted-foreground">Pending Appointments</p>
        </Card>

        <Card className="p-6 text-center">
          <TrendingUp size={32} className="mx-auto mb-3 text-blue-500" />
          <div className="text-2xl font-bold">{dashboardStats.avgCompliance}%</div>
          <p className="text-muted-foreground">Avg Compliance</p>
        </Card>
      </div>

      <Tabs defaultValue="patients" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="patients">Patient Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Patient Management Tab */}
        <TabsContent value="patients" className="space-y-4">
          {/* Search and Filters */}
          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search patients by name or symptoms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedDosha} onValueChange={setSelectedDosha}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by Dosha" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Doshas</SelectItem>
                  <SelectItem value="vata">Vata</SelectItem>
                  <SelectItem value="pitta">Pitta</SelectItem>
                  <SelectItem value="kapha">Kapha</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Patient
              </Button>
            </div>
          </Card>

          {/* Patient List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredPatients.map((patient) => (
              <Card key={patient.id} className="p-4 hover:shadow-lg transition-ayur">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{patient.avatar}</div>
                    <div>
                      <h4 className="font-semibold">{patient.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {patient.age} years • {patient.gender}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(patient.status)}`}></div>
                    <Badge variant="outline" className="capitalize">
                      {patient.status}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Dosha Type:</span>
                    <Badge className={getDoshaColor(patient.dosha)} variant="secondary">
                      {patient.dosha}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Compliance:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 transition-all"
                          style={{ width: `${patient.compliance}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{patient.compliance}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Last Visit:</span>
                    <span className="text-sm">{new Date(patient.lastVisit).toLocaleDateString()}</span>
                  </div>

                  {patient.nextAppointment && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Next Appointment:</span>
                      <span className="text-sm font-medium text-primary">
                        {new Date(patient.nextAppointment).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground mb-2">Symptoms:</p>
                    <div className="flex flex-wrap gap-1">
                      {patient.symptoms.map((symptom) => (
                        <Badge key={symptom} variant="outline" className="text-xs">
                          {symptom}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => {
                      toast({
                        title: `Viewing ${patient.name}'s Profile`,
                        description: "Opening detailed patient information",
                      });
                    }}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => {
                      toast({
                        title: `Editing ${patient.name}'s Plan`,
                        description: "Opening diet chart and treatment editor",
                      });
                    }}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Plan
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => {
                      toast({
                        title: "Consultation Report Generated",
                        description: `PDF report for ${patient.name} is ready for download`,
                      });
                    }}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Patient Distribution by Dosha</h3>
              <div className="space-y-3">
                {['Vata', 'Pitta', 'Kapha'].map((dosha) => {
                  const count = patients.filter(p => p.dosha.includes(dosha)).length;
                  const percentage = (count / patients.length) * 100;
                  return (
                    <div key={dosha} className="space-y-1">
                      <div className="flex justify-between">
                        <span>{dosha}</span>
                        <span>{count} patients ({percentage.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full gradient-${dosha.toLowerCase()}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Treatment Compliance Rates</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Excellent (90%+)</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{patients.filter(p => p.compliance >= 90).length} patients</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Good (70-89%)</span>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-500" />
                    <span>{patients.filter(p => p.compliance >= 70 && p.compliance < 90).length} patients</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Needs Attention (<70%)</span>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span>{patients.filter(p => p.compliance < 70).length} patients</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Monthly Revenue Trends</h3>
            <div className="flex items-center justify-center h-40 text-muted-foreground">
              <BarChart3 size={48} />
              <span className="ml-3">Revenue analytics chart will be displayed here</span>
            </div>
          </Card>
        </TabsContent>

        {/* Appointments Tab */}
        <TabsContent value="appointments" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Today's Schedule</h3>
            <div className="space-y-3">
              {patients.filter(p => p.nextAppointment).slice(0, 3).map((patient, index) => (
                <div key={patient.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-xl">{patient.avatar}</div>
                    <div>
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {patient.dosha} • Follow-up consultation
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {9 + index}:00 AM
                    </p>
                    <Badge variant="outline" className="mt-1">
                      {index === 0 ? 'Current' : index === 1 ? 'Next' : 'Upcoming'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4">
              <Calendar className="w-4 h-4 mr-2" />
              View Full Calendar
            </Button>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Generate Reports</h3>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    toast({
                      title: "Patient Summary Report Generated",
                      description: "Comprehensive report for all active patients is ready",
                    });
                  }}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Patient Summary Report
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    toast({
                      title: "Treatment Compliance Report Generated",
                      description: "Detailed compliance analysis is ready for download",
                    });
                  }}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Treatment Compliance Report
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    toast({
                      title: "Revenue Analysis Report Generated",
                      description: "Monthly financial summary is ready",
                    });
                  }}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Revenue Analysis
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button 
                  className="w-full justify-start"
                  onClick={() => {
                    toast({
                      title: "Bulk Diet Charts Generated",
                      description: "Diet charts for all active patients created",
                    });
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Generate Bulk Diet Charts
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    toast({
                      title: "Patient Reminders Sent",
                      description: "Appointment and medication reminders sent to all patients",
                    });
                  }}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Send Patient Reminders
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
              onClick={() => {
                toast({
                  title: "Practice Analytics Updated",
                  description: "All analytics and insights have been refreshed",
                });
              }}
            >
              <Activity className="w-4 h-4 mr-2" />
              Refresh Analytics
            </Button>
          </div>
        </Card>
      </div>
    </TabsContent>
  </Tabs>
</div>
  );
};

export default DoctorDashboard;