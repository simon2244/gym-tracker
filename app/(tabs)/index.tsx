import { useEffect, useRef, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Button, Dialog, Icon, IconButton, PaperProvider, TextInput } from "react-native-paper";
import ExerciseBox from "../components/exerciseBox";
import PillList from "../components/PillList";
import Constants from "../constants";
import rawData from "../data.json";
import AsyncStorage from '@react-native-async-storage/async-storage';


// Clean up data to remove undefined exercises
const data = rawData.map(plan => ({
  ...plan,
  exercises: Object.fromEntries(
    Object.entries(plan.exercises)
      .filter(([_, ex]) => ex !== undefined)
  )
}));


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
  exercises: {
    [key: string]: Exercise;
  };
};


export default function Index() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const workoutPlans = plans.map(plan => plan.name);
  const plansMap: Record<string, string> = plans.reduce((acc, plan) => {
  acc[plan.id] = plan.name;
  return acc;
}, {} as Record<string, string>); 

  const [showAddPlanDialog, setShowAddPlanDialog] = useState(false);
  const [newPlanName, setNewPlanName] = useState('');
  const screenWidth = Dimensions.get('window').width;


   
  // Load plans from storage when component mounts
 useEffect(() => {
  const loadPlans = async () => {
    try {
      // clearAllStorage(); 
      const storedPlans = await AsyncStorage.getItem('gymPlans');
      if (storedPlans !== null) {
        // ✅ Daten aus Storage laden
        const parsedPlans = JSON.parse(storedPlans);
        setPlans(parsedPlans);
      } else {
        // ✅ KEINE gespeicherten Pläne → Beispiel-Daten verwenden
        setPlans(data); 


        // ❗️Und direkt speichern, damit sie beim nächsten Start da sind
        await AsyncStorage.setItem('gymPlans', JSON.stringify(data));
      }
    } catch (error) {
      console.error('Failed to load plans:', error);
      // Optional: setPlans(data); // Falls du auch bei Fehler fallback willst
    } finally {
      setIsLoading(false);
    }
  };
  loadPlans();
}, []);
  
  // Save plans to storage whenever they change
  useEffect(() => {
   
    // Don't save on initial load
    if (!isLoading) {
      savePlans();
    }
  }, [plans, isLoading]);

   


 
const savePlans = async () => {
      try {
        await AsyncStorage.setItem('gymPlans', JSON.stringify(plans));
        // console.log('Plans saved successfully: '+ JSON.stringify(plans));
      } catch (error) {
        console.error('Failed to save plans:', error);
      }
    };
    
  // Function to get the next plan ID based on existing plans  
  function nextPlanId() {
      let maxId = 0;

      plans.forEach(plan => {
        const planIdNum = parseInt(plan.id.replace("plan", ""), 10);
        if( !isNaN(planIdNum) && planIdNum > maxId){
          maxId = planIdNum;
        }
      });

      return maxId + 1;
  }

  // Function to get the next exercise ID based on existing exercises in all plans
  function nextExerciseId() {
    let maxId = 0;

    plans.forEach(plan => {
      plan.exercises && Object.values(plan.exercises).forEach(exercise => {
        const exerciseIdNum = parseInt(exercise.id.replace("ex", ""), 10);
        if( !isNaN(exerciseIdNum) && exerciseIdNum > maxId){
          maxId = exerciseIdNum;
        }
      });
    });
    return maxId +1;
  }
  
  // Function to get exercises by plan name  
  function getExercisesByPlan(planName: string) {
    const plan = plans.find(p => p.name === planName);

    if (!plan || typeof plan.exercises !== 'object' || plan.exercises === null) {
      return [];
    }

    return Object.values(plan.exercises);
  }
  function getExercisesByPlanId(planId: string) {
  const plan = plans.find(p => p.id === planId);

  if (!plan || typeof plan.exercises !== 'object' || plan.exercises === null) {
    return [];
  }

  return Object.values(plan.exercises);
}

  function handleAddExerciseButtonPress(){
    let id = nextExerciseId();
    if (typeof selectedPlan === 'string' && selectedPlan.trim() !== '') {
      addExerciseToPlan(selectedPlan, {"id": `ex${id}`, "name": "New Exercise","sets": '0', "weight": '0', "reps": '0'});
    }
  }

  function addExerciseToPlan (planId: string, newExercise: Exercise){
   
    setPlans(prevPlans =>
      prevPlans.map(plan => {
        if (plan.id === planId) {
          return {
            ...plan,
            exercises: {
              ...plan.exercises,
              [newExercise.id]: newExercise,
            },
          };
        }
        return plan;
      })
    );
    
  }
  
  function handleDeleteExercise(id: string): void {
    setPlans(prevPlans =>
      prevPlans.map(plan => {
        if (plan.id === selectedPlan) {
          return {
        ...plan,
        exercises: Object.fromEntries(
          Object.entries(plan.exercises).filter(([_, exercise]) => exercise.id !== id)
        ),
      };
        }
        return plan;
      })
    );
  }

  function handleSave(): void {
    savePlans();
  }

  function handleEditExercise(id: string): void {
    throw new Error("Function not implemented.");
  }

  function handleAddPlan(): void {
    setShowAddPlanDialog(true);
  }

  function addPlan(name: string): void {
    if (!name.trim()) {
      return; 
    }

    const newPlan: Plan = {
      id: `plan${nextPlanId()}`,
      name: name,
      exercises: {},
    };

    setPlans(prevPlans => [...prevPlans, newPlan]);
    setShowAddPlanDialog(false);
    setNewPlanName('');
  }

  return (
    <PaperProvider>
      
     
    <View style={styles.container}>
      <View style={[styles.topBar]} >
        <PillList
          items={plansMap}
          selectedIndex={plans.findIndex(plan => plan.id === selectedPlan)}
          onSelect={(planId) => setSelectedPlan(planId)}
          addPlan={handleAddPlan}
          deletePlan={(planId) => setPlans(plans.filter(plan => plan.id !== planId))}
          />
      </View>
      <ScrollView
        contentContainerStyle={{ 
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
      >
         <GestureHandlerRootView style={{ flex: 1, width: '100%' }}>
             <View style={{ width: screenWidth, paddingHorizontal: screenWidth > 1200 ? 300 :20 }}>
        {getExercisesByPlanId(selectedPlan).map((exercise, idx) => (
         <ExerciseBox 
          key={`${selectedPlan}-${exercise.id}`} 
          exercise_id={`${exercise.id}`}
          plan_id={`${plans.find(plan => plan.id === selectedPlan)?.id}`}
          name={exercise.name} 
          sets={exercise.sets}
          weight={exercise.weight}
          reps={exercise.reps}
          onDelete={() => handleDeleteExercise(exercise.id)}
          onEdit={() => handleEditExercise(exercise.id)} />
          
        ))}
         </View>
        </GestureHandlerRootView>
       
          <View style={{ justifyContent: 'flex-start' }}>   
            <IconButton
            icon="plus"
            size={24}
            iconColor="white"
            style={styles.iconButton}
            onPress={handleAddExerciseButtonPress}
            disabled={selectedPlan === ''}
          />
         
          
        </View>

        
      </ScrollView>
      <Dialog style={{ width: '70%', height: '30%', borderRadius: 20, alignSelf: 'center', backgroundColor: Constants.backgroundDark }} visible={showAddPlanDialog} onDismiss={() => setShowAddPlanDialog(false)}>
      <Dialog.Title style={{ color: '#fff' }}>Add New Plan</Dialog.Title>
      <Dialog.Content>
        <TextInput
          mode="outlined"
          label="Name"
          onChangeText={(text) => setNewPlanName(text)}
          style={styles.input}
          textColor={styles.text.color} 
        />
      </Dialog.Content>
      <Dialog.Actions>
        <View style={{ borderRadius: 50, flexDirection: 'row'}}>
          
          <Button 
            mode="text"
            onPress={() => {
              setShowAddPlanDialog(false);
              setNewPlanName('');
            }}
            labelStyle={styles.buttonLabelStyle}
          >
          Cancel
          </Button>
          <Button 
            mode="text"
            onPress={() => addPlan(newPlanName)} 
            labelStyle={[
              styles.buttonLabelStyle,
              !newPlanName.trim() && { color: '#888' }
            ]}
            disabled={!newPlanName.trim()}
          >
          Add
          </Button>
        </View>

      </Dialog.Actions>
    </Dialog>
    </View>
    
    {/* </GestureHandlerRootView> */}
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    backgroundColor: Constants.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
  buttonLabelStyle: {
    color: Constants.primaryBlue,
    fontSize: 16,
  },
  topBar: {
    position: 'relative',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 0,
    paddingTop: 4,
    backgroundColor: Constants.backgroundDark, 
    zIndex: 10, 
  },
  iconButton: {
    backgroundColor: Constants.primaryBlue, 
    borderRadius: 30,
  },
  input: {
    backgroundColor: '#333',
    color: 'white',
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 8,
    outlineColor: Constants.primaryBlue,
   
  },
});