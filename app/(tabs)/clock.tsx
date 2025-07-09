import React, { useState, useEffect, useRef } from 'react';
import Constants from '../constants'; // Adjust path as needed
import { Button, PaperProvider, Text, TextInput } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import { KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';

import { Audio } from 'expo-av';
import phaseSwitchSound from '../assets/sounds/phaseSwitchSound.mp3';
import sessionEndSound from '../assets/sounds/sessionEndSound.mp3';
import TimeSelector from '../components/timeSelctor';
import SetSelector from '../components/setSelctor';

export default function IntervalTimer() {
  const [exerciseDuration, setExerciseDuration] = useState('30');
  const [breakDuration, setBreakDuration] = useState('15');
  const [totalSets, setTotalSets] = useState('3');

  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isExercise, setIsExercise] = useState(true);
  const [currentSet, setCurrentSet] = useState(1);
  const [editMode, setEditMode] = useState(true);

  const intervalRef = useRef<number | null>(null);

  const startTimer = () => {
    if (!isRunning && parseInt(totalSets) > 0) {
      setCurrentSet(1);
      setIsExercise(true);
      setTimeLeft(parseInt(exerciseDuration));
      setIsRunning(true);
      setEditMode(false);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setCurrentSet(1);
    setEditMode(true);
    if (intervalRef.current !== null) clearInterval(intervalRef.current);
  };

  const playSound = async (soundFile: any) => {
  const { sound } = await Audio.Sound.createAsync(soundFile);
  await sound.playAsync();
};


  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }

    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (isRunning && timeLeft === 0) {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
      if (isExercise) {
        setIsExercise(false);
        setTimeLeft(parseInt(breakDuration));
        playSound(phaseSwitchSound);
      } else {
        if (currentSet < parseInt(totalSets)) {
          setCurrentSet(prev => prev + 1);
          setIsExercise(true);
          setTimeLeft(parseInt(exerciseDuration));
          playSound(phaseSwitchSound);
        } else {
          setIsRunning(false);
          playSound(sessionEndSound);
        }
      }
    }
  }, [timeLeft]);



  return (
    <PaperProvider>
       <KeyboardAvoidingView
    style={{ flex: 1, backgroundColor: Constants.backgroundDark }}
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
  >
    <ScrollView  
    style={{ backgroundColor: Constants.backgroundDark, flex: 1 }}
  contentContainerStyle={{ 
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  }}
  keyboardShouldPersistTaps="handled"
  scrollEventThrottle={16}>

      {editMode ? (
      <>
        <SetSelector
        label="Total Sets"
        value={parseInt(totalSets)} 
        onChange={(val) => setTotalSets(String(Math.round(val)))}
          />
        <TimeSelector
          label="Exercise Time"
          value={parseInt(exerciseDuration)}
          onChange={(val) => setExerciseDuration(String(val))}
        />
        <TimeSelector
          label="Break Time"
          value={parseInt(breakDuration)}
          onChange={(val) => setBreakDuration(String(val))}
        />
    
    </>
      ) : (
        <View style={styles.timerBox}>
          <Text style={styles.setText}>
            Set {currentSet} / {totalSets}
          </Text>
          
          <Text style={styles.timeText}>
            {String(timeLeft).padStart(2, '0')}s
          </Text>

          <Text style={styles.phaseText}>
            {isRunning ? (isExercise ? 'Exercise' : 'Break') : 'Done'}
          </Text>
          
        </View>
      )}

      <View style={styles.buttonRow}>
        {editMode ? (
          <Button
            mode="contained"
            onPress={startTimer}
            style={{ backgroundColor: Constants.primaryBlue, borderRadius: 8 }}
          >
            Start
          </Button>
        ) : (
          <Button
            mode="contained"
            onPress={resetTimer}
            style={{ backgroundColor: 'red', borderRadius: 8 }}
          >
            Cancel
          </Button>
        )}
      </View>
    </ScrollView>
    </KeyboardAvoidingView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: 'white',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    width: '100%',
    maxHeight: 60,
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
    backgroundColor: '#333',
  },
  timerBox: {
    marginVertical: 30,
    alignItems: 'center',
  },
  phaseText: {
    fontSize: 20,
    color: '#ccc',
    marginTop: 10,
  },
  timeText: {
    fontSize: 64,
    color: 'white',
    fontVariant: ['tabular-nums'],
  },
  setText: {
    fontSize: 18,
    color: '#ccc',
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
  scrollContainer: {
  flexGrow: 1,
  justifyContent: 'center',
  paddingHorizontal: 20,
},
});
