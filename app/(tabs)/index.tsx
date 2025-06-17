import { Dimensions, GestureResponderEvent, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { TextInput, Button } from "react-native-paper";
import PillList  from "../components/PillList";
import Constants from "../constants";
import ExerciseSquare from "../components/exerciseSquare";
import rawData from "../data.json";
import {useEffect, useRef, useState } from "react";
import {Dialog, IconButton, PaperProvider } from "react-native-paper";
import { GestureHandlerRootView } from 'react-native-gesture-handler';


// Clean up data to remove undefined exercises
const data = rawData.map(plan => ({
  ...plan,
  exercises: Object.fromEntries(
    Object.entries(plan.exercises)
      .filter(([_, ex]) => ex !== undefined)
  )
}));


type Exercise = {
   id: string;
  name: string;
  weight: number;
  reps: number;
};
type Plan = {
  id: string;
  name: string;
  exercises: {
    [key: string]: Exercise;
  };
};


export default function Index() {
  const [plans, setPlans] = useState<Plan[]>(data);
  const [selectedPlan, setSelectedPlan] = useState(plans[0].name);
  const workoutPlans = plans.map(plan => plan.name);
  const [showAddPlanDialog, setShowAddPlanDialog] = useState(false);
  const [newPlanName, setNewPlanName] = useState('');
  const screenWidth = Dimensions.get('window').width;

   
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
  
  
  function getExercisesByPlan(planName: string) {
  const plan = plans.find(p => p.name === planName);

  if (!plan || typeof plan.exercises !== 'object' || plan.exercises === null) {
    return [];
  }

  return Object.values(plan.exercises);
}

  function handleAddExerciseButtonPress(){
    let id = nextExerciseId();
    addExerciseToPlan(selectedPlan, {"id": `ex${id}`, "name": "New Exercise", "weight": 0, "reps": 0});
  }

  function addExerciseToPlan (planName: string, newExercise: Exercise){
   
    setPlans(prevPlans =>
      prevPlans.map(plan => {
        if (plan.name === planName) {
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
        if (plan.name === selectedPlan) {
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
          items={workoutPlans}
          selectedIndex={workoutPlans.indexOf(selectedPlan)}
          onSelect={(planName) => setSelectedPlan(planName)} 
          addPlan={handleAddPlan}
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
           <View style={{ width: screenWidth}}>
        {getExercisesByPlan(selectedPlan).map((exercise, idx) => (
         <ExerciseSquare 
          key={`${exercise.id}`} 
          name={exercise.name} 
          onDelete={() => handleDeleteExercise(exercise.id)}
          onEdit={() => handleEditExercise(exercise.id)} />
        ))}
         </View>
        </GestureHandlerRootView>
        <View style={{margin: 20}}>   
          <IconButton
          icon="plus"
          size={24}
          iconColor="white"
          style={styles.iconButton}
          onPress={handleAddExerciseButtonPress}
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