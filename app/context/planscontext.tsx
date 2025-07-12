import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import rawData from '../data.json';

export type Exercise = {
  id: string;
  name: string;
  sets: string;
  weight: string;
  reps: string;
};

export type Plan = {
  id: string;
  name: string;
  exercises: { [key: string]: Exercise };
};

type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

type WeeklySchedule = {
  [day in DayOfWeek]: string[];
};

type WorkoutLogEntry = {
  date: string; // YYYY-MM-DD
  planId: string;
};

type PlanContextType = {
  plans: Plan[];
  setPlans: React.Dispatch<React.SetStateAction<Plan[]>>;

  schedule: WeeklySchedule;
  setSchedule: React.Dispatch<React.SetStateAction<WeeklySchedule>>;

  workoutLog: WorkoutLogEntry[];
  setWorkoutLog: React.Dispatch<React.SetStateAction<WorkoutLogEntry[]>>;

  isLoading: boolean;

  updateExerciseData: (
    plan_id: string,
    exercise_id: string,
    exerciseName: string,
    selectedWeight: string,
    selectedReps: string,
    selectedSets: string
  ) => void;
};


const data = rawData.map(plan => ({
  ...plan,
  exercises: Object.fromEntries(
    Object.entries(plan.exercises)
      .filter(([_, ex]) => ex !== undefined)
  )
}));

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export const PlansProvider = ({ children }: { children: React.ReactNode }) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
    const [schedule, setSchedule] = useState<WeeklySchedule>({
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: [],
    });
    const [workoutLog, setWorkoutLog] = useState<WorkoutLogEntry[]>([]);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const storedPlans = await AsyncStorage.getItem('gymPlans');
        if (storedPlans) {
          setPlans(JSON.parse(storedPlans));
        } else {
          setPlans(data);
          await AsyncStorage.setItem('gymPlans', JSON.stringify(data));
        }
      } catch (err) {
        console.error('Fehler beim Laden der Pläne', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadPlans();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem('gymPlans', JSON.stringify(plans)).catch(err =>
        console.error('Fehler beim Speichern:', err)
      );
    }
  }, [plans, isLoading]);

  useEffect(() => {
  const loadData = async () => {
    try {
      // PLANS
      const storedPlans = await AsyncStorage.getItem('gymPlans');
      if (storedPlans) {
        setPlans(JSON.parse(storedPlans));
      } else {
        setPlans(data);
        await AsyncStorage.setItem('gymPlans', JSON.stringify(data));
      }

      // SCHEDULE
      const storedSchedule = await AsyncStorage.getItem('weeklySchedule');
      if (storedSchedule) {
        setSchedule(JSON.parse(storedSchedule));
      }

      // WORKOUT LOG
      const storedWorkoutLog = await AsyncStorage.getItem('workoutLog');
      if (storedWorkoutLog) {
        setWorkoutLog(JSON.parse(storedWorkoutLog));
      }

    } catch (err) {
      console.error('Fehler beim Laden der Daten', err);
    } finally {
      setIsLoading(false);
    }
  };

  loadData();
}, []);

useEffect(() => {
  if (!isLoading) {
    AsyncStorage.setItem('weeklySchedule', JSON.stringify(schedule)).catch(err =>
      console.error('Fehler beim Speichern des Schedules:', err)
    );
  }
}, [schedule, isLoading]);

useEffect(() => {
  if (!isLoading) {
    AsyncStorage.setItem('workoutLog', JSON.stringify(workoutLog)).catch(err =>
      console.error('Fehler beim Speichern des Workout Logs:', err)
    );
  }
}, [workoutLog, isLoading]);



  const updateExerciseData = (
  plan_id: string,
  exercise_id: string,
  name: string,
  weight: string,
  reps: string,
  sets: string
    ) => {
    setPlans(prevPlans => {
        const updatedPlans = prevPlans.map(plan => {
        if (plan.id !== plan_id) return plan;

        const updatedExercises = { ...plan.exercises };
        const exerciseKey = Object.keys(updatedExercises).find(
            key => updatedExercises[key].id === exercise_id
        );
        if (!exerciseKey) return plan;

        updatedExercises[exerciseKey] = {
            ...updatedExercises[exerciseKey],
            name,
            weight,
            reps,
            sets,
        };

        return { ...plan, exercises: updatedExercises };
        });

        // ✅ Direkt AsyncStorage aktualisieren
        AsyncStorage.setItem('gymPlans', JSON.stringify(updatedPlans)).catch(err =>
        console.error('Fehler beim direkten Speichern in updateExerciseData:', err)
        );

        return updatedPlans;
    });
    };


  return (
    <PlanContext.Provider value={{ plans, setPlans, schedule, setSchedule, workoutLog, setWorkoutLog, isLoading, updateExerciseData }}>
      {children}
    </PlanContext.Provider>
  );
};

export const usePlans = () => {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error('usePlans must be used within a PlanProvider');
  }
  return context;
};



