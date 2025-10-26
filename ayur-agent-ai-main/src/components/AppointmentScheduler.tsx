import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar as CalendarIcon, Clock, User, Video, MapPin, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Appointment {
  id: string;
  patientName: string;
  date: Date;
  time: string;
  type: 'in-person' | 'video' | 'phone';
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

const AppointmentScheduler = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      patientName: 'Ramesh Kumar',
      date: new Date(),
      time: '10:00 AM',
      type: 'in-person',
      status: 'scheduled',
      notes: 'Follow-up consultation for diet plan'
    },
    {
      id: '2',
      patientName: 'Priya Sharma',
      date: new Date(),
      time: '2:00 PM',
      type: 'video',
      status: 'scheduled',
      notes: 'Initial Prakriti assessment'
    }
  ]);

  const [newAppointment, setNewAppointment] = useState({
    patientName: '',
    time: '',
    type: 'in-person' as 'in-person' | 'video' | 'phone',
    notes: ''
  });

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
  ];

  // Reschedule/Cancel dialog state
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<Date | undefined>(new Date());
  const [rescheduleTime, setRescheduleTime] = useState<string>('');
  const [cancelReason, setCancelReason] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleSchedule = () => {
    if (!newAppointment.patientName || !newAppointment.time || !selectedDate) {
      toast({
        title: 'Missing Information',
        description: 'Please fill all required fields',
        variant: 'destructive'
      });
      return;
    }

    const appointment: Appointment = {
      id: Date.now().toString(),
      patientName: newAppointment.patientName,
      date: selectedDate,
      time: newAppointment.time,
      type: newAppointment.type,
      status: 'scheduled',
      notes: newAppointment.notes
    };

    setAppointments([...appointments, appointment]);
    setNewAppointment({ patientName: '', time: '', type: 'in-person', notes: '' });
    
    toast({
      title: '✅ Appointment Scheduled',
      description: `${newAppointment.patientName} on ${format(selectedDate, 'PPP')} at ${newAppointment.time}`
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'phone': return <Phone className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold gradient-healing bg-clip-text text-transparent">
        Appointment Scheduler
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar & New Appointment Form */}
        <Card className="p-6 space-y-6">
          <h3 className="text-xl font-semibold">Schedule New Appointment</h3>
          
          <DatePicker
            selected={selectedDate}
            onChange={(date: Date | null) => setSelectedDate(date || undefined)}
            inline
            className="w-full"
          />

          <div className="space-y-4">
            <div>
              <Label htmlFor="patientName">Patient Name</Label>
              <Input
                id="patientName"
                placeholder="Enter patient name"
                value={newAppointment.patientName}
                onChange={(e) => setNewAppointment({ ...newAppointment, patientName: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="time">Time Slot</Label>
              <Select value={newAppointment.time} onValueChange={(value) => setNewAppointment({ ...newAppointment, time: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="type">Appointment Type</Label>
              <Select value={newAppointment.type} onValueChange={(value: any) => setNewAppointment({ ...newAppointment, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in-person"><MapPin className="inline w-4 h-4 mr-2" />In-Person</SelectItem>
                  <SelectItem value="video"><Video className="inline w-4 h-4 mr-2" />Video Call</SelectItem>
                  <SelectItem value="phone"><Phone className="inline w-4 h-4 mr-2" />Phone</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                placeholder="Add consultation notes"
                value={newAppointment.notes}
                onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
              />
            </div>

            <Button onClick={handleSchedule} className="w-full">
              <CalendarIcon className="w-4 h-4 mr-2" />
              Schedule Appointment
            </Button>
          </div>
        </Card>

        {/* Appointments List */}
        <Card className="p-6 space-y-4">
          <h3 className="text-xl font-semibold">Today's Appointments</h3>
          
          <div className="space-y-3">
            {appointments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No appointments scheduled</p>
            ) : (
              appointments
                .filter(apt => format(apt.date, 'yyyy-MM-dd') === format(selectedDate || new Date(), 'yyyy-MM-dd'))
                .map((appointment) => (
                  <Card key={appointment.id} className="p-4 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <User className="w-5 h-5 text-primary" />
                          <span className="font-semibold">{appointment.patientName}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {appointment.time}
                          </div>
                          <div className="flex items-center gap-1">
                            {getTypeIcon(appointment.type)}
                            <span className="capitalize">{appointment.type}</span>
                          </div>
                        </div>
                        {appointment.notes && (
                          <p className="text-sm text-muted-foreground">{appointment.notes}</p>
                        )}
                      </div>
                      <Badge className={`${getStatusColor(appointment.status)} text-white`}>
                        {appointment.status}
                      </Badge>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" onClick={() => {
                        setAppointments(appointments.map(apt => 
                          apt.id === appointment.id ? { ...apt, status: 'completed' } : apt
                        ));
                        toast({ title: '✅ Marked as completed' });
                      }}>
                        Complete
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => {
                        setRescheduleTarget(appointment);
                        setRescheduleDate(appointment.date);
                        setRescheduleTime(appointment.time);
                        setRescheduleOpen(true);
                      }}>
                        Reschedule
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => {
                        setRescheduleTarget(appointment);
                        setCancelReason('');
                        setCancelOpen(true);
                      }}>
                        Cancel
                      </Button>
                      {appointment.type === 'video' && (
                        <Button size="sm" variant="secondary">
                          <Video className="w-4 h-4 mr-2" />
                          Join Call
                        </Button>
                      )}
                    </div>
                  </Card>
                ))
            )}
          </div>
        </Card>
      </div>

      {/* Reschedule Dialog */}
      <Dialog open={rescheduleOpen} onOpenChange={setRescheduleOpen}>
        <DialogContent className="max-w-md bg-card/80 backdrop-blur-md border border-border/50">
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
          </DialogHeader>
          {isProcessing ? (
            <div className="space-y-3">
              <div className="h-6 w-40 bg-muted/50 animate-pulse rounded" />
              <div className="h-40 bg-muted/50 animate-pulse rounded" />
            </div>
          ) : (
            <div className="space-y-4">
              <DatePicker 
                selected={rescheduleDate} 
                onChange={(date: Date | null) => setRescheduleDate(date || undefined)} 
                inline
                className="w-full"
              />
              <div>
                <Label>Time Slot</Label>
                <Select value={rescheduleTime} onValueChange={setRescheduleTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter className="sm:justify-end gap-2">
            <Button variant="outline" onClick={() => setRescheduleOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              if (!rescheduleTarget || !rescheduleDate) return;
              setIsProcessing(true);
              setAppointments(prev => prev.map(apt => apt.id === rescheduleTarget.id ? { ...apt, date: rescheduleDate, time: rescheduleTime || apt.time } : apt));
              setTimeout(() => {
                setIsProcessing(false);
                setRescheduleOpen(false);
                toast({ title: '✅ Rescheduled', description: `${rescheduleTarget.patientName} on ${format(rescheduleDate, 'PPP')} at ${rescheduleTime || rescheduleTarget.time}` });
              }, 600);
            }}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent className="max-w-md bg-card/80 backdrop-blur-md border border-border/50">
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
          </DialogHeader>
          {isProcessing ? (
            <div className="space-y-3">
              <div className="h-6 w-40 bg-muted/50 animate-pulse rounded" />
              <div className="h-24 bg-muted/50 animate-pulse rounded" />
            </div>
          ) : (
            <div className="space-y-3">
              <Label htmlFor="reason">Reason</Label>
              <Input id="reason" placeholder="Optional reason" value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} />
            </div>
          )}
          <DialogFooter className="sm:justify-end gap-2">
            <Button variant="outline" onClick={() => setCancelOpen(false)}>Back</Button>
            <Button variant="destructive" onClick={() => {
              if (!rescheduleTarget) return;
              setIsProcessing(true);
              setAppointments(prev => prev.map(apt => apt.id === rescheduleTarget.id ? { ...apt, status: 'cancelled', notes: cancelReason ? `${apt.notes || ''} (Cancelled: ${cancelReason})` : apt.notes } : apt));
              setTimeout(() => {
                setIsProcessing(false);
                setCancelOpen(false);
                toast({ title: '❌ Appointment Cancelled' });
              }, 500);
            }}>Confirm Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default AppointmentScheduler;