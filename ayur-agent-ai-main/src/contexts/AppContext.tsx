import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  frequency: string;
  points: number;
  completed: boolean;
  dateAdded: Date;
  source: string;
}

interface Challenge {
  id: string;
  title: string;
  description?: string;
  type: 'daily' | 'weekly' | 'special';
  points: number;
  target?: number;
  progress?: number;
  completed: boolean;
  dateAdded: string;
}

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  contact: string;
  email: string;
  prakriti: string;
  // Optional fields used by PatientManagement and DoctorDashboard
  dosha?: string;
  status?: string;
  symptoms?: string[];
  lastVisit?: string | Date;
  goals: string[];
  restrictions: string[];
  joinedDate: string;
}

interface TreatmentPlan {
  id?: string;
  patientId: string;
  patientName: string;
  createdDate: string;
  diagnosis?: string;
  treatment?: string;
  diet: {
    favor: string[];
    avoid: string[];
  } | string;
  lifestyle: string[] | string;
  herbs: string[] | string;
  followUp: string;
}

interface AppState {
  userProfile: {
    dosha: string;
    age: number | null;
    gender: string | null;
    prakritiCompleted: boolean;
  };
  recommendations: any;
  totalPoints: number;
  currentStreak: number;
  tasks: Task[];
  customTasks: Task[];
  challenges: Challenge[];
  patients: Patient[];
  treatmentPlans: TreatmentPlan[];
  completionPercentage: number;
  completionCount: number;
}

interface AppContextType extends AppState {
  setUserProfile: (profile: Partial<AppState['userProfile']>) => void;
  setRecommendations: (recs: any) => void;
  addPoints: (points: number) => void;
  toggleTask: (taskId: string, taskList: 'tasks' | 'customTasks') => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  addCustomTask: (task: Omit<Task, 'id'>) => void;
  addPatient: (patient: Omit<Patient, 'id'>) => void;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  addTreatmentPlan: (plan: TreatmentPlan) => void;
  updateTreatmentPlan: (id: string, updates: Partial<TreatmentPlan>) => void;
  deleteTreatmentPlan: (id: string) => void;
  addChallenge: (challenge: Omit<Challenge, 'id' | 'dateAdded' | 'completed' | 'progress'>) => void;
  updateChallengeProgress: (id: string, progress: number) => void;
  incrementStreak: () => void;
  resetData: () => void;
  addRecommendationsToTasks: (recommendations: any) => void;
  loadSampleData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultTasks: Task[] = [
  { 
    id: '1', 
    title: 'Morning Abhyanga (Oil Massage)', 
    description: 'Apply warm sesame oil to your body before shower',
    category: 'Morning Routine', 
    frequency: 'Daily',
    completed: false, 
    dateAdded: new Date(),
    source: 'Default',
    points: 20 
  },
  { 
    id: '2', 
    title: 'Drink Warm Lemon Water', 
    description: 'Start your day with warm water and lemon',
    category: 'Morning Routine', 
    frequency: 'Daily',
    completed: false, 
    dateAdded: new Date(),
    source: 'Default',
    points: 10 
  },
  { 
    id: '3', 
    title: '15min Yoga Practice', 
    description: 'Gentle yoga and stretching exercises',
    category: 'Exercise', 
    frequency: 'Daily',
    completed: false, 
    dateAdded: new Date(),
    source: 'Default',
    points: 25 
  },
  { 
    id: '4', 
    title: 'Take Ashwagandha', 
    description: '500mg with warm milk',
    category: 'Herbal', 
    frequency: 'Daily',
    completed: false, 
    dateAdded: new Date(),
    source: 'Default',
    points: 15 
  },
  { 
    id: '5', 
    title: 'Meditation (15min)', 
    description: 'Mindfulness meditation before bed',
    category: 'Mindfulness', 
    frequency: 'Daily',
    completed: false, 
    dateAdded: new Date(),
    source: 'Default',
    points: 30 
  },
];

// Sample data for demo
const samplePatients: Patient[] = [
  {
    id: "1",
    name: "Priya Sharma",
    age: 32,
    gender: "Female",
    contact: "+91 98765 43210",
    email: "priya.sharma@email.com",
    prakriti: "Vata-Pitta",
    dosha: "Vata",
    status: "Active",
    symptoms: ["stress", "sleep"],
    lastVisit: "2024-10-01",
    goals: ["Weight management", "Better sleep", "Stress reduction"],
    restrictions: ["Lactose intolerant"],
    joinedDate: "2024-01-15"
  },
  {
    id: "2",
    name: "Rajesh Kumar",
    age: 45,
    gender: "Male",
    contact: "+91 98765 43211",
    email: "rajesh.k@email.com",
    prakriti: "Pitta",
    dosha: "Pitta",
    status: "Active",
    symptoms: ["acidity"],
    lastVisit: "2024-09-15",
    goals: ["Reduce acidity", "Stress management", "Better digestion"],
    restrictions: ["None"],
    joinedDate: "2024-02-20"
  },
  {
    id: "3",
    name: "Anjali Desai",
    age: 28,
    gender: "Female",
    contact: "+91 98765 43212",
    email: "anjali.d@email.com",
    prakriti: "Kapha",
    dosha: "Kapha",
    status: "Active",
    symptoms: ["weight"],
    lastVisit: "2024-08-20",
    goals: ["Increase energy", "Lose weight", "Better immunity"],
    restrictions: ["Vegetarian"],
    joinedDate: "2024-03-10"
  },
  {
    id: "4",
    name: "Vikram Patel",
    age: 38,
    gender: "Male",
    contact: "+91 98765 43213",
    email: "vikram.p@email.com",
    prakriti: "Vata",
    dosha: "Vata",
    status: "Active",
    symptoms: ["anxiety"],
    lastVisit: "2024-08-10",
    goals: ["Improve digestion", "Better focus", "Anxiety management"],
    restrictions: ["Gluten-free"],
    joinedDate: "2024-04-05"
  },
  {
    id: "5",
    name: "Meera Reddy",
    age: 52,
    gender: "Female",
    contact: "+91 98765 43214",
    email: "meera.r@email.com",
    prakriti: "Pitta-Kapha",
    dosha: "Pitta",
    status: "Active",
    symptoms: ["joint"],
    lastVisit: "2024-07-25",
    goals: ["Joint health", "Better immunity", "Weight management"],
    restrictions: ["Diabetic"],
    joinedDate: "2024-05-12"
  }
];

const sampleTreatmentPlans: TreatmentPlan[] = [
  {
    patientId: "1",
    patientName: "Priya Sharma",
    createdDate: "2024-10-01",
    diet: {
      favor: ["Warm cooked foods", "Ghee", "Sweet fruits (dates, figs)", "Root vegetables", "Whole grains", "Warm milk"],
      avoid: ["Cold drinks", "Raw salads", "Excessive caffeine", "Spicy food", "Ice cream", "Carbonated drinks"]
    },
    lifestyle: [
      "Morning oil massage (Abhyanga) with sesame oil",
      "Regular sleep schedule (10 PM - 6 AM)",
      "Gentle yoga and stretching",
      "Meditation 15 minutes daily",
      "Avoid screen time 1 hour before bed"
    ],
    herbs: [
      "Ashwagandha 500mg twice daily with warm milk",
      "Triphala 1 tsp before bed with warm water",
      "Brahmi tea in the evening"
    ],
    followUp: "2 weeks"
  },
  {
    patientId: "2",
    patientName: "Rajesh Kumar",
    createdDate: "2024-10-05",
    diet: {
      favor: ["Cooling foods", "Sweet and bitter tastes", "Coconut water", "Cucumber", "Coriander", "Fennel"],
      avoid: ["Spicy food", "Citrus fruits", "Tomatoes", "Vinegar", "Fried foods", "Alcohol"]
    },
    lifestyle: [
      "Morning walk in nature",
      "Breathing exercises (Pranayama)",
      "Avoid working late nights",
      "Swimming or gentle exercise",
      "Practice patience and forgiveness"
    ],
    herbs: [
      "Amalaki (Amla) powder 1 tsp daily",
      "Shatavari 500mg twice daily",
      "Cooling herbs tea (mint, coriander)"
    ],
    followUp: "3 weeks"
  },
  {
    patientId: "3",
    patientName: "Anjali Desai",
    createdDate: "2024-10-10",
    diet: {
      favor: ["Light and warm foods", "Spices (ginger, black pepper)", "Leafy greens", "Quinoa", "Barley", "Beans"],
      avoid: ["Heavy dairy", "Fried foods", "Sweet pastries", "Ice cream", "Excessive sleep after meals"]
    },
    lifestyle: [
      "Vigorous exercise daily (jogging, aerobics)",
      "Wake up before 6 AM",
      "Dry brushing before shower",
      "Stay active throughout the day",
      "Socialize and engage in stimulating activities"
    ],
    herbs: [
      "Trikatu (three pungents) before meals",
      "Guggulu 500mg twice daily",
      "Ginger tea throughout the day"
    ],
    followUp: "4 weeks"
  }
];

// Debounced save function
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Define getDefaultState BEFORE AppProvider to avoid hoisting issues
const getDefaultState = (): AppState => ({
  userProfile: {
    dosha: '',
    age: null,
    gender: null,
    prakritiCompleted: false
  },
  recommendations: null,
  totalPoints: 0,
  currentStreak: 0,
  tasks: defaultTasks,
  customTasks: [],
  challenges: [
    {
      id: 'c1',
      title: 'Early Riser',
      description: 'Complete morning routine by 7 AM',
      type: 'daily',
      points: 50,
      progress: 1,
      target: 3,
      completed: false,
      dateAdded: new Date().toISOString(),
    },
    {
      id: 'c2',
      title: 'Hydration Hero',
      description: 'Drink 8 glasses of water',
      type: 'daily',
      points: 30,
      progress: 5,
      target: 8,
      completed: false,
      dateAdded: new Date().toISOString(),
    },
    {
      id: 'c3',
      title: 'Mindful Moments',
      description: 'Complete 3 meditation sessions',
      type: 'weekly',
      points: 40,
      progress: 1,
      target: 3,
      completed: false,
      dateAdded: new Date().toISOString(),
    },
  ],
  patients: [],
  treatmentPlans: [],
  completionPercentage: 0,
  completionCount: 0
});

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  // Helper function to get user-scoped localStorage key
  const getStorageKey = useCallback(() => {
    return user ? `ayuragent-state-${user.id}` : 'ayuragent-state-guest';
  }, [user]);

  // Helper to migrate legacy data to user-scoped storage on first auth
  const migrateLegacyData = useCallback(() => {
    if (!user) return;
    
    const legacyKey = 'ayuragent-state';
    const newKey = getStorageKey();
    
    // Only migrate if new key doesn't exist but legacy does
    if (!localStorage.getItem(newKey) && localStorage.getItem(legacyKey)) {
      const legacyData = localStorage.getItem(legacyKey);
      if (legacyData) {
        localStorage.setItem(newKey, legacyData);
        console.log('Migrated legacy data to user-scoped storage');
      }
    }
  }, [user, getStorageKey]);

  const [state, setState] = useState<AppState>(() => {
    // Try migration first if user is authenticated
    if (user) {
      migrateLegacyData();
    }
    
    const storageKey = user ? `ayuragent-state-${user.id}` : 'ayuragent-state-guest';
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
      const parsed = JSON.parse(saved);
        // Version migration
        if (parsed.version < 2) {
          // Migrate old format to new format
          return {
            userProfile: {
              dosha: parsed.userDosha || '',
              age: parsed.userAge || null,
              gender: parsed.userGender || null,
              prakritiCompleted: false
            },
            recommendations: parsed.recommendations || null,
            totalPoints: parsed.totalPoints || 0,
            currentStreak: parsed.currentStreak || 0,
            tasks: parsed.tasks || defaultTasks,
            customTasks: [],
            challenges: [],
            patients: parsed.patients || [],
            treatmentPlans: [],
            completionPercentage: parsed.completionPercentage || 0,
            completionCount: 0
          };
        }
      return {
        ...parsed,
        tasks: parsed.tasks || defaultTasks,
          customTasks: parsed.customTasks || [],
          challenges: parsed.challenges || [],
        patients: parsed.patients || [],
          treatmentPlans: parsed.treatmentPlans || [],
        };
      } catch (error) {
        console.error('Failed to restore state:', error);
        return getDefaultState();
      }
    }
    return getDefaultState();
  });

  // Debounced save to prevent excessive writes
  const debouncedSave = useCallback(
    debounce((state: AppState, storageKey: string) => {
      localStorage.setItem(storageKey, JSON.stringify({
        ...state,
        version: 2,
        updatedAt: Date.now()
      }));
    }, 500),
    [] // Empty is fine - debounce handles its own closure
  );

  // Auto-save on any state change
  useEffect(() => {
    const storageKey = getStorageKey();
    debouncedSave(state, storageKey);
    
    // Cleanup on unmount
    return () => {
      // Force immediate save on unmount
      localStorage.setItem(storageKey, JSON.stringify({
        ...state,
        version: 2,
        updatedAt: Date.now()
      }));
    };
  }, [state, getStorageKey]); // Removed debouncedSave from deps to prevent recreation

  // Update completion statistics
  useEffect(() => {
    const allTasks = [...state.tasks, ...state.customTasks];
    const completed = allTasks.filter(t => t.completed).length;
    const total = allTasks.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    setState(prev => ({ 
      ...prev, 
      completionPercentage: percentage,
      completionCount: completed
    }));
  }, [state.tasks, state.customTasks]);

  const setUserProfile = (profile: Partial<AppState['userProfile']>) => {
    setState(prev => ({ 
      ...prev, 
      userProfile: { ...prev.userProfile, ...profile }
    }));
  };

  const setRecommendations = (recs: any) => {
    setState(prev => ({ ...prev, recommendations: recs }));
    if (recs?.dosha) {
      setUserProfile({ dosha: recs.dosha });
    }
  };

  const addPoints = (points: number) => {
    setState(prev => ({ ...prev, totalPoints: prev.totalPoints + points }));
  };

  const toggleTask = (taskId: string, taskList: 'tasks' | 'customTasks') => {
    setState(prev => {
      const tasks = prev[taskList].map(task => {
        if (task.id === taskId) {
          const newCompleted = !task.completed;
          const pointsDelta = newCompleted ? task.points : -task.points;
          
          // Update points
          setState(prevState => ({ 
            ...prevState, 
            totalPoints: prevState.totalPoints + pointsDelta 
          }));
          
          return { ...task, completed: newCompleted };
        }
        return task;
      });
      return { ...prev, [taskList]: tasks };
    });
  };

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask = { 
      ...task, 
      id: Date.now().toString(),
      dateAdded: new Date()
    };
    setState(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }));
  };

  const addCustomTask = (task: Omit<Task, 'id'>) => {
    // Prevent negative points exploit
    const sanitizedPoints = Math.max(0, task.points || 0);
    
    const newTask = { 
      ...task,
      points: sanitizedPoints,
      id: Date.now().toString(),
      dateAdded: new Date()
    };
    setState(prev => ({ ...prev, customTasks: [...prev.customTasks, newTask] }));
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

  const addTreatmentPlan = (plan: TreatmentPlan) => {
    setState(prev => ({ ...prev, treatmentPlans: [...prev.treatmentPlans, plan] }));
  };

  const updateTreatmentPlan = (id: string, updates: Partial<TreatmentPlan>) => {
    setState(prev => ({
      ...prev,
      treatmentPlans: prev.treatmentPlans.map(tp =>
        tp.id === id ? { ...tp, ...updates } : tp
      )
    }));
  };

  const deleteTreatmentPlan = (id: string) => {
    setState(prev => ({
      ...prev,
      treatmentPlans: prev.treatmentPlans.filter(tp => tp.id !== id)
    }));
  };

  const addChallenge = (challenge: Omit<Challenge, 'id' | 'dateAdded' | 'completed' | 'progress'>) => {
    const newChallenge: Challenge = {
      ...challenge,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      dateAdded: new Date().toISOString(),
      completed: false,
      progress: 0,
    };
    setState(prev => ({ ...prev, challenges: [...prev.challenges, newChallenge] }));
  };

  const updateChallengeProgress = (id: string, progress: number) => {
    setState(prev => {
      let pointsToAdd = 0;
      
      const challenges = prev.challenges.map(c => {
        if (c.id === id) {
          // LOCK: Don't allow updates to already completed challenges (prevent point farming)
          if (c.completed) {
            return c;
          }
          
          const completed = c.target ? progress >= c.target : false;
          const wasCompleted = c.completed;
          
          // Award points if just completed
          if (completed && !wasCompleted) {
            pointsToAdd = c.points;
          }
          
          return { ...c, progress, completed };
        }
        return c;
      });
      
      return { 
        ...prev, 
        challenges,
        totalPoints: prev.totalPoints + pointsToAdd
      };
    });
  };

  const incrementStreak = () => {
    setState(prev => ({ ...prev, currentStreak: prev.currentStreak + 1 }));
  };

  const addRecommendationsToTasks = (recommendations: any) => {
    const newTasks: Task[] = [];
    
    // Parse different types of recommendations
    if (recommendations.dailyRoutine) {
      recommendations.dailyRoutine.forEach((rec: any) => {
        newTasks.push({
          id: Date.now() + Math.random().toString(),
          title: rec.task || rec,
          description: rec.description || 'Daily routine recommendation',
          category: 'Daily Challenges',
          frequency: 'Daily',
          points: 10,
          completed: false,
          dateAdded: new Date(),
          source: 'AI Chatbot'
        });
      });
    }
    
    if (recommendations.diet) {
      recommendations.diet.forEach((rec: any) => {
        newTasks.push({
          id: Date.now() + Math.random().toString(),
          title: rec.task || rec,
          description: rec.description || 'Diet recommendation',
          category: 'Diet',
          frequency: 'Daily',
          points: 15,
          completed: false,
          dateAdded: new Date(),
          source: 'AI Chatbot'
        });
      });
    }
    
    if (recommendations.herbs) {
      recommendations.herbs.forEach((rec: any) => {
        newTasks.push({
          id: Date.now() + Math.random().toString(),
          title: rec.task || rec,
          description: rec.description || 'Herbal recommendation',
          category: 'Herbal',
          frequency: 'Daily',
          points: 20,
          completed: false,
          dateAdded: new Date(),
          source: 'AI Chatbot'
        });
      });
    }
    
    if (recommendations.lifestyle) {
      recommendations.lifestyle.forEach((rec: any) => {
        newTasks.push({
          id: Date.now() + Math.random().toString(),
          title: rec.task || rec,
          description: rec.description || 'Lifestyle recommendation',
          category: 'Lifestyle',
          frequency: 'Daily',
          points: 12,
          completed: false,
          dateAdded: new Date(),
          source: 'AI Chatbot'
        });
      });
    }
    
    setState(prev => ({ ...prev, tasks: [...prev.tasks, ...newTasks] }));
  };

  const loadSampleData = () => {
    setState(prev => ({
      ...prev,
      patients: samplePatients,
      treatmentPlans: sampleTreatmentPlans
    }));
  };

  const resetData = () => {
    setState(getDefaultState());
    const storageKey = getStorageKey();
    const chatKey = user ? `ayuragent-chat-v1-${user.id}` : 'ayuragent-chat-v1-guest';
    const chatInteractiveKey = user ? `ayuragent-chat-interactive-v1-${user.id}` : 'ayuragent-chat-interactive-v1-guest';
    const customTasksKey = user ? `ayuragent-custom-tasks-${user.id}` : 'ayuragent-custom-tasks-guest';
    
    localStorage.removeItem(storageKey);
    localStorage.removeItem(chatKey);
    localStorage.removeItem(chatInteractiveKey);
    localStorage.removeItem(customTasksKey);
    
    // Also remove legacy keys if they exist
    localStorage.removeItem('ayuragent-state');
    localStorage.removeItem('ayuragent-chat-v1');
    localStorage.removeItem('ayuragent-chat-interactive-v1');
    localStorage.removeItem('ayuragent-custom-tasks');
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        setUserProfile,
        setRecommendations,
        addPoints,
        toggleTask,
        addTask,
        addCustomTask,
        addPatient,
        updatePatient,
        deletePatient,
        addTreatmentPlan,
        updateTreatmentPlan,
        deleteTreatmentPlan,
        addChallenge,
        updateChallengeProgress,
        incrementStreak,
        resetData,
        addRecommendationsToTasks,
        loadSampleData,
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
