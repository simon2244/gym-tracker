import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Text, TextInput } from 'react-native-paper';
import Constants from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Exercise, Plan } from '../(tabs)';

type ExerciseBoxProps = {
  exercise_id: string;
  plan_id: string;
  name: string;
  weight?: string;
  reps?: string;
  onDelete: () => void;
  onEdit: () => void;
}

const ExerciseBox = ({ exercise_id, plan_id, name, weight, reps, onDelete, onEdit }: ExerciseBoxProps) => {
  const [exerciseName, setExerciseName] = useState(name || '');
  const [selectedWeight, setSelectedWeight] = useState(weight || '0');
  const [selectedReps, setSelectedReps] = useState(reps || '0');

  const exerciseNameRef = useRef<String>(exerciseName);
  const weightRef = useRef<String>(selectedWeight);
  const repsRef = useRef<String>(selectedReps);
  const [loading, setLoading] = useState(true);

  
  const [isEditing, setIsEditing] = useState(false);

   
  // if (loading) return <Text style={{color: '#fff'}}>Wird geladen...</Text>;
  // if (!exercise) return <Text style={{color: '#fff'}}>Übung nicht gefunden</Text>;
  
  const LeftSwipeAction = () => {
  return (
    <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity
        onPress={() => {
          onEdit();
        }}
        style={{
          backgroundColor: "#f0ca00",
          justifyContent: "center",
          alignItems: "flex-end",
          borderTopLeftRadius: 12,
          borderBottomLeftRadius: 12,
          padding: 16,
          marginVertical: 8,   
          gap: 12,
        }}>
        <Text
          style={{
            color: "#1b1a17",
            fontWeight: "600",
            paddingHorizontal: 30,
            paddingVertical: 20,
          }}>
          Edit
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          onDelete();
        }}
        style={{
          backgroundColor: "#ff0000",
          justifyContent: "center",
          alignItems: "flex-end",
          
          borderTopRightRadius: 12,
          borderBottomRightRadius: 12,
          padding: 16,
          marginVertical: 8,
          gap: 12,
        }}>
        <Text
          style={{
            color: "#1b1a17",
            fontWeight: "600",
            paddingHorizontal: 30,
            paddingVertical: 20,
          }}>
          Delete
        </Text>
      </TouchableOpacity>
    </View>
  );
};

//TODO mach ein debounce für die Updates, damit nicht bei jedem Zeichenwechsel gespeichert wird
  async function updateExerciseData() {
    try {
    const storedData = await AsyncStorage.getItem('gymPlans');
    if (!storedData) return;

    let storedPlans = JSON.parse(storedData);
    const planIndex = storedPlans.findIndex((plan: Plan) => plan.id === plan_id);
    if (planIndex === -1) return;

    const plan = storedPlans[planIndex];

    // ✅ Exercise im Objekt aktualisieren
    const exerciseKey = Object.keys(plan.exercises).find(
      (key) => plan.exercises[key].id === exercise_id
    );

    if (!exerciseKey) return;

    plan.exercises[exerciseKey] = {
      ...plan.exercises[exerciseKey],
      name: exerciseName,
      weight: selectedWeight,
      reps: selectedReps,
    };

    // ✅ Plan im Array ersetzen
    storedPlans[planIndex] = plan;

    // ✅ Speichern
    await AsyncStorage.setItem('gymPlans', JSON.stringify(storedPlans));
    console.log('Exercise updated successfully');
  } catch (error) {
    console.error('Failed to update exercise:', error);
  }
  }

  return (
    <View >
    <Swipeable
    renderRightActions={LeftSwipeAction}
    leftThreshold={Infinity}
    onSwipeableOpen={(direction: string) => {
      if (direction === "right") {
        // Swiped from right
      } else if (direction === "left") {
        // Swiped from left
      }
    }}>
    <View style={[styles.square, { flexDirection: 'column', alignItems: 'flex-start' }]}>
      <View>
        {isEditing ? (
          <TextInput
            style={[styles.input, { alignSelf: 'flex-start' }]}
            value={exerciseName}
            onChangeText={text => setExerciseName(text)}
            onBlur={() => {
              if (!exerciseName.trim()) {
                setExerciseName(name);
                exerciseNameRef.current = name;
                updateExerciseData();
              }
              setIsEditing(false);
            }}
            autoFocus
            selectTextOnFocus={true}
            textColor="#fff"
            mode='flat'
            activeUnderlineColor={Constants.primaryBlue}
          />
        ) : (
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <Text style={[styles.label, { alignSelf: 'flex-start' }]}>{exerciseName}</Text>
          </TouchableOpacity>
        )}
      </View>

      <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
    }}
  >
        <TextInput
          mode="outlined"
          label="Weight (kg)"
          value={selectedWeight ? String(selectedWeight) : ''}
          onChangeText={text => {
            const numeric = text.replace(/[^0-9]/g, '');
            setSelectedWeight(numeric);
            weightRef.current = numeric;
          }}
          onBlur={updateExerciseData}
         
          keyboardType="numeric"
          style={styles.input}
          textColor="#fff"
          activeOutlineColor= {Constants.primaryBlue}
          theme={{
            colors: {
              onSurfaceVariant: '#888888', 
            },
          }}
        />
        <Text style={{ fontSize: 24, color: '#fff', marginHorizontal: 4 }}>×</Text>
        <TextInput
          mode="outlined"
          label="Repetitions"
          value={selectedReps ? String(selectedReps) : ''}
          onChangeText={text => {
            const numeric = text.replace(/[^0-9]/g, '');
            setSelectedReps(numeric);
            repsRef.current = numeric;
          }}
          onBlur={updateExerciseData}
          keyboardType="numeric"
          style={styles.input}
          textColor="#fff"
          activeOutlineColor= {Constants.primaryBlue}
          theme={{
            colors: {
              onSurfaceVariant: '#888888', 
            },
          }}
        />
      </View>
    </View>
    </Swipeable>
    </View>
 
 

  );
}

const styles = StyleSheet.create({
 square: {
  flexDirection: 'column',
  alignItems: 'flex-start',
  backgroundColor: '#2d3239',
  borderRadius: 12,
  padding: 16,
  marginVertical: 8,   
  width: '100%',
  gap: 12,
  shadowColor: '#000',
  shadowOpacity: 0.2,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 4,
  elevation: 5,
},

  label: {
    color: '#fff',
    minWidth: 60,
  },
  input: {
    backgroundColor: '#333',
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 8,
    
    
   
  },
  dropdown: {
    borderColor: '#555',
    borderWidth: 1,
  },
  menuItem: {
    color: '#fff',
  },
   hiddenRow: {
    alignItems: 'flex-end',
    backgroundColor: '#ff4d4d',
    borderRadius: 12,
    paddingRight: 20,
    height: '100%',
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    padding: 8,
  },
  
});

export default ExerciseBox;
