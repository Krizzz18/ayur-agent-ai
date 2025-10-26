import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Undo, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface ResetConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ResetConfirmationDialog: React.FC<ResetConfirmationDialogProps> = ({ 
  open, 
  onClose, 
  onConfirm 
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isResetting, setIsResetting] = useState(false);
  
  // Helper to get user-scoped keys
  const getKeys = () => {
    if (user) {
      return {
        state: `ayuragent-state-${user.id}`,
        chat: `ayuragent-chat-v1-${user.id}`,
        chatInteractive: `ayuragent-chat-interactive-v1-${user.id}`,
        customTasks: `ayuragent-custom-tasks-${user.id}`,
        backup: `ayuragent-backup-last-${user.id}`
      };
    }
    return {
      state: 'ayuragent-state-guest',
      chat: 'ayuragent-chat-v1-guest',
      chatInteractive: 'ayuragent-chat-interactive-v1-guest',
      customTasks: 'ayuragent-custom-tasks-guest',
      backup: 'ayuragent-backup-last-guest'
    };
  };

  const handleConfirm = async () => {
    setIsResetting(true);
    const keys = getKeys();
    
    // Create backup
    const backup = {
      user: JSON.parse(localStorage.getItem(keys.state) || '{}'),
      chatHistory: localStorage.getItem(keys.chat),
      interactiveChat: localStorage.getItem(keys.chatInteractive),
      customTasks: localStorage.getItem(keys.customTasks),
      timestamp: Date.now()
    };
    localStorage.setItem(keys.backup, JSON.stringify(backup));
    
    // Execute reset
    onConfirm();
    
    // Show undo toast for 10 seconds
    const { dismiss } = toast({
      title: "All data reset",
      description: "Click Undo to restore within 10 seconds",
      action: (
        <Button size="sm" onClick={handleUndo}>
          <Undo className="h-4 w-4 mr-2" />
          Undo
        </Button>
      ),
      duration: 10000
    });
    
    // After 10s, delete backup if not restored
    setTimeout(() => {
      const keys = getKeys();
      const stillExists = localStorage.getItem(keys.backup);
      if (stillExists) {
        localStorage.removeItem(keys.backup);
      }
    }, 10000);
    
    setIsResetting(false);
    onClose();
  };

  const handleUndo = () => {
    const keys = getKeys();
    const backup = JSON.parse(localStorage.getItem(keys.backup) || '{}');
    if (backup.user) {
      localStorage.setItem(keys.state, JSON.stringify(backup.user));
    }
    if (backup.chatHistory) {
      localStorage.setItem(keys.chat, backup.chatHistory);
    }
    if (backup.interactiveChat) {
      localStorage.setItem(keys.chatInteractive, backup.interactiveChat);
    }
    if (backup.customTasks) {
      localStorage.setItem(keys.customTasks, backup.customTasks);
    }
    
    localStorage.removeItem(keys.backup);
    toast({ title: "✅ Data restored successfully!" });
    
    // Reload the page to restore state
    window.location.reload();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="backdrop-blur-xl bg-card/95 border-destructive/50 max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-6 w-6" />
            Reset All Data?
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 py-4">
          <p className="text-sm text-muted-foreground">
            This will permanently delete:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Your profile and dosha analysis</li>
            <li>All patients and treatment plans</li>
            <li>Task history and progress (points, streaks)</li>
            <li>Custom tasks and notes</li>
            <li>Chat history</li>
          </ul>
          <p className="text-sm font-semibold text-destructive">
            Sample data will be restored. This action can be undone within 10 seconds.
          </p>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isResetting}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirm}
            disabled={isResetting}
            className="flex items-center gap-2"
          >
            {isResetting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Resetting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Reset Everything
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResetConfirmationDialog;
