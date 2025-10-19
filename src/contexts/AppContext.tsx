import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Task {
  id: string;
  task: string;
  category: string;
  completed: boolean;
  time: string;
  points: number;
}

interface Patient {
  id: string;
  name: string;
  age: number;
  dosha: string;
  symptoms: string[];
  lastVisit: Date;
  status: string;
}

interface AppState {
  userDosha: string;
  userAge: number | null;
  recommendations: any;
  totalPoints: number;
  currentStreak: number;
  tasks: Task[];
  patients: Patient[];
  completionPercentage: number;
}

interface AppContextType extends AppState {
  setUserDosha: (dosha: string) => void;
  setUserAge: (age: number) => void;
  setRecommendations: (recs: any) => void;
  addPoints: (points: number) => void;
  toggleTask: (taskId: string) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  addPatient: (patient: Omit<Patient, 'id'>) => void;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  incrementStreak: () => void;
  resetData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultTasks: Task[] = [
  { id: '1', task: 'Morning Abhyanga (Oil Massage)', category: 'Routine', completed: false, time: '6:00 AM', points: 20 },
  { id: '2', task: 'Drink Warm Lemon Water', category: 'Diet', completed: false, time: '6:30 AM', points: 10 },
  { id: '3', task: '15min Yoga Practice', category: 'Exercise', completed: false, time: '7:00 AM', points: 25 },
  { id: '4', task: 'Take Ashwagandha', category: 'Herbs', completed: false, time: '8:00 AM', points: 15 },
  { id: '5', task: 'Meditation (15min)', category: 'Mindfulness', completed: false, time: '9:00 PM', points: 30 },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('ayuragent-state');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        tasks: parsed.tasks || defaultTasks,
        patients: parsed.patients || [],
      };
    }
    return {
      userDosha: '',
      userAge: null,
      recommendations: null,
      totalPoints: 0,
      currentStreak: 0,
      tasks: defaultTasks,
      patients: [],
      completionPercentage: 0,
    };
  });

  useEffect(() => {
    localStorage.setItem('ayuragent-state', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const completed = state.tasks.filter(t => t.completed).length;
    const percentage = Math.round((completed / state.tasks.length) * 100);
    setState(prev => ({ ...prev, completionPercentage: percentage }));
  }, [state.tasks]);

  const setUserDosha = (dosha: string) => {
    setState(prev => ({ ...prev, userDosha: dosha }));
  };

  const setUserAge = (age: number) => {
    setState(prev => ({ ...prev, userAge: age }));
  };

  const setRecommendations = (recs: any) => {
    setState(prev => ({ ...prev, recommendations: recs }));
    if (recs?.dosha) {
      setUserDosha(recs.dosha);
    }
  };

  const addPoints = (points: number) => {
    setState(prev => ({ ...prev, totalPoints: prev.totalPoints + points }));
  };

  const toggleTask = (taskId: string) => {
    setState(prev => {
      const tasks = prev.tasks.map(task => {
        if (task.id === taskId) {
          const newCompleted = !task.completed;
          if (newCompleted && !task.completed) {
            addPoints(task.points);
          } else if (!newCompleted && task.completed) {
            addPoints(-task.points);
          }
          return { ...task, completed: newCompleted };
        }
        return task;
      });
      return { ...prev, tasks };
    });
  };

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask = { ...task, id: Date.now().toString() };
    setState(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }));
  };

  const addPatient = (patient: Omit<Patient, 'id'>) => {
    const newPatient = { ...patient, id: Date.now().toString() };
    setState(prev => ({ ...prev, patients: [...prev.patients, newPatient] }));
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setState(prev => ({
      ...prev,
      patients: prev.patients.map(p => p.id === id ? { ...p, ...updates } : p)
    }));
  };

  const deletePatient = (id: string) => {
    setState(prev => ({
      ...prev,
      patients: prev.patients.filter(p => p.id !== id)
    }));
  };

  const incrementStreak = () => {
    setState(prev => ({ ...prev, currentStreak: prev.currentStreak + 1 }));
  };

  const resetData = () => {
    setState({
      userDosha: '',
      userAge: null,
      recommendations: null,
      totalPoints: 0,
      currentStreak: 0,
      tasks: defaultTasks,
      patients: [],
      completionPercentage: 0,
    });
    localStorage.removeItem('ayuragent-state');
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        setUserDosha,
        setUserAge,
        setRecommendations,
        addPoints,
        toggleTask,
        addTask,
        addPatient,
        updatePatient,
        deletePatient,
        incrementStreak,
        resetData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
