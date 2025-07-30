import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Text, TextInput } from 'react-native-paper';
import Constants from '../constants';
import { TextInput as RNTextInput } from 'react-native';
import {usePlans} from '../context/planscontext';
import  DifficultyMeter from './difficultyMeter';


type ExerciseBoxProps = {
  exercise_id: string;
  plan_id: string;
  name: string;
  sets: string;
  weight?: string;
  reps?: string;
  difficulty?: number;
  onDelete: () => void;
  onEdit: () => void;
}

const ExerciseBox = ({ exercise_id, plan_id, name, sets, weight, reps, difficulty, onDelete, onEdit }: ExerciseBoxProps) => {
  const [exerciseName, setExerciseName] = useState(name || '');
  const [selectedWeight, setSelectedWeight] = useState(weight || '0');
  const [selectedReps, setSelectedReps] = useState(reps || '0');
  const [selectedSets, setSelectedSets] = useState(sets || '0');
  const [selectedDifficulty, setSelectedDifficulty] = useState<number>(difficulty || 0);
  const { updateExerciseData } = usePlans();
 
 
  

  const exerciseNameRef = useRef<string>(exerciseName);
  const weightRef = useRef<string>(selectedWeight);
  const repsRef = useRef<string>(selectedReps);
  const setsRef = useRef<string>(selectedSets);
  const difficultyRef = useRef<number>(selectedDifficulty);

  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<RNTextInput>(null);

   
  
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
          <View>
          <TextInput
            style={[styles.inputName,]}
            activeOutlineColor= {Constants.primaryBlue}
            value={exerciseName}
            onChangeText={text => setExerciseName(text)}
            onBlur={() => {            
              if (!exerciseName.trim()) {
                setExerciseName(name);
                exerciseNameRef.current = name;
              }else{
                exerciseNameRef.current = exerciseName;
                updateExerciseData(plan_id, exercise_id, exerciseNameRef.current, weightRef.current, repsRef.current, setsRef.current, difficultyRef.current);
              }
              setIsEditing(false);
            }}
            autoFocus
            selectTextOnFocus={true}
            textColor="#fff"
            mode='outlined'
            activeUnderlineColor={Constants.primaryBlue}
          />
          </View>
        ) : (
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <Text style={[styles.label, { alignSelf: 'flex-start' }]}>{exerciseName}</Text>
          </TouchableOpacity>
        )}
        
          <DifficultyMeter 
            difficulty={difficulty ?? 0}
            onChange={(value) => {
              setSelectedDifficulty(value);
              difficultyRef.current = value;
              updateExerciseData(
                plan_id, 
                exercise_id, 
                exerciseNameRef.current, 
                weightRef.current, 
                repsRef.current, 
                setsRef.current,
                difficultyRef.current
              );
            }}
          />
        
  
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
          label="Sets"
          value={selectedSets ? String(selectedSets) : ''}
          onChangeText={text => {
            let formatted = text.replace(/[^0-9.]/g, '');
            formatted = formatted.replace(/\./g, ',');
             formatted = formatted.replace(/^0+(?=\d)/, '');
            setSelectedSets(formatted);
            setsRef.current = formatted;
          }}

          onBlur={() => {updateExerciseData(plan_id, exercise_id, exerciseNameRef.current, weightRef.current, repsRef.current, setsRef.current, difficultyRef.current) }}
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
        <TextInput
          mode="outlined"
          ref={inputRef}
          label="Weight (kg)"
          value={selectedWeight ? String(selectedWeight) : ''}
          onChangeText={text => {
            let formatted = text.replace(/[^0-9.,]/g, '');
            formatted = formatted.replace(/\./g, ',');
            const parts = formatted.split(',');
            if (parts.length > 2) {
              formatted = parts[0] + ',' + parts.slice(1).join('');
            }
             formatted = formatted.replace(/^0+(?=\d)/, '');

            setSelectedWeight(formatted);
            weightRef.current = formatted;
          }}
          onBlur={() => {updateExerciseData(plan_id, exercise_id, exerciseNameRef.current, weightRef.current, repsRef.current, setsRef.current, difficultyRef.current)}}
          keyboardType="decimal-pad"
          style={styles.input}

          textColor="#fff"
          activeOutlineColor= {Constants.primaryBlue}
          theme={{
            colors: {
              onSurfaceVariant: '#888888', 
            },
          }}
        />
        <TextInput
          mode="outlined"
          label="Repetitions"
          value={selectedReps ? String(selectedReps) : ''}
          onChangeText={text => {
            let formatted = text.replace(/[^0-9.]/g, '');
            formatted = formatted.replace(/\./g, ',');
             formatted = formatted.replace(/^0+(?=\d)/, '');
            setSelectedReps(formatted);
            repsRef.current = formatted;
          }}

          onBlur={() => {updateExerciseData(plan_id, exercise_id, exerciseNameRef.current, weightRef.current, repsRef.current, setsRef.current, difficultyRef.current)}}
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
  inputName:{
    backgroundColor: '#333',
  height: 40,            
  paddingVertical: 0,    
  textAlignVertical: 'center', 
  fontSize: 16,          
  borderRadius: 8,       
  color: '#fff',
    minHeight: 40,   
    maxHeight: 40 
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
