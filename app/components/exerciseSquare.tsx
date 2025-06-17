import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text, TextInput, Button, Menu, Divider } from 'react-native-paper';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

type SquareComponentProps = {
  name: string;
  weight?: number;
  reps?: number;
  onDelete: () => void;
  onEdit: () => void;
}

const ExerciseSquare = ({ name, weight, reps, onDelete, onEdit }: SquareComponentProps) => {
  const [dropdownValue, setDropdownValue] = useState('Option 1');
  const [menuVisible, setMenuVisible] = useState(false);
  const [exerciseName, setExerciseName] = useState(name || '');
  const [selectedWeight, setSelectedWeight] = useState(weight || 0);
  const [selectedReps, setSelectedReps] = useState(reps || 0);
  const [isEditing, setIsEditing] = useState(false);
  
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
    <View style={{ width: '100%' }}>
    {/* <Swipeable
    renderRightActions={LeftSwipeAction}
    leftThreshold={Infinity}
    onSwipeableOpen={(direction: string) => {
      if (direction === "right") {
        // Swiped from right
      } else if (direction === "left") {
        // Swiped from left
      }
    }}> */}
    <View style={[styles.square, { flexDirection: 'column', alignItems: 'flex-start' }]}>
      <View>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={exerciseName}
            onChangeText={setExerciseName}
            onBlur={() => setIsEditing(false)}
            autoFocus
            selectTextOnFocus={true}
          />
        ) : (
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <Text style={styles.label}>{exerciseName}</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          mode="outlined"
          label="Weight (kg)"
          value={selectedWeight ? String(selectedWeight) : ''}
          onChangeText={text => {
            const numeric = text.replace(/[^0-9]/g, '');
            setSelectedWeight(Number(numeric));
          }}
          keyboardType="numeric"
          style={styles.input}
        />
        <Text style={{ fontSize: 24, color: '#fff', marginHorizontal: 4 }}>×</Text>
        <TextInput
          mode="outlined"
          label="Repetitions"
          value={selectedReps ? String(selectedReps) : ''}
          onChangeText={text => {
            const numeric = text.replace(/[^0-9]/g, '');
            setSelectedReps(Number(numeric));
          }}
          keyboardType="numeric"
          style={styles.input}
        />
      </View>
    </View>
    {/* </Swipeable> */}
    </View>
 
 

  );
}

const styles = StyleSheet.create({
 square: {
  flexDirection: 'column',
  alignItems: 'flex-start',
  backgroundColor: '#25292e',
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
    color: '#fff',
    flex: 1,
    marginHorizontal: 8,
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

export default ExerciseSquare;
