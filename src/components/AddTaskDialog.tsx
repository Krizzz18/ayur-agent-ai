import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTask: (task: { task: string; category: string; time: string; points: number; completed: boolean }) => void;
}

const AddTaskDialog: React.FC<AddTaskDialogProps> = ({ open, onOpenChange, onAddTask }) => {
  const [taskName, setTaskName] = useState('');
  const [category, setCategory] = useState('Routine');
  const [time, setTime] = useState('');
  const [points, setPoints] = useState(10);

  const handleSubmit = () => {
    if (!taskName || !time) return;

    onAddTask({
      task: taskName,
      category,
      time,
      points,
      completed: false,
    });

    // Reset form
    setTaskName('');
    setCategory('Routine');
    setTime('');
    setPoints(10);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Custom Task</DialogTitle>
          <DialogDescription>
            Create a personalized Ayurvedic task or reminder for your daily routine.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="task-name">Task Name</Label>
            <Input
              id="task-name"
              placeholder="e.g., Morning Pranayama"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Routine">Routine</SelectItem>
                <SelectItem value="Diet">Diet</SelectItem>
                <SelectItem value="Exercise">Exercise</SelectItem>
                <SelectItem value="Herbs">Herbs</SelectItem>
                <SelectItem value="Mindfulness">Mindfulness</SelectItem>
                <SelectItem value="Self-Care">Self-Care</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="points">Points Reward</Label>
            <Input
              id="points"
              type="number"
              min="5"
              max="50"
              step="5"
              value={points}
              onChange={(e) => setPoints(Number(e.target.value))}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!taskName || !time}>
            Add Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskDialog;
