import React, { useState, useEffect, useRef } from 'react';
import Constants from '../constants'; // Adjust path as needed
import { Button, IconButton, PaperProvider, Text, TextInput } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import { KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';

import { Audio } from 'expo-av';
import phaseSwitchSound from '../assets/sounds/phaseSwitchSound.mp3';
import sessionEndSound from '../assets/sounds/sessionEndSound.mp3';
import raceStartBeeps from '../assets/sounds/raceStartBeeps.mp3';
import TimeSelector from '../components/timeSelctor';
import SetSelector from '../components/setSelctor';

export default function IntervalTimer() {
  const [exerciseDuration, setExerciseDuration] = useState('5');
  const [breakDuration, setBreakDuration] = useState('5');
  const [totalSets, setTotalSets] = useState('2');

  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isExercise, setIsExercise] = useState(true);
  const [currentSet, setCurrentSet] = useState(1);
  const [editMode, setEditMode] = useState(true);
  const [isCountdown, setIsCountdown] = useState(false);
  const [countdownTime, setCountdownTime] = useState(5);

  const intervalRef = useRef<number | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);


 

  useEffect(() => {
  if (isCountdown && countdownTime > 0) {
    const countdownInterval = setInterval(() => {
      setCountdownTime(prev => prev - 1);
    }, 1000);

    return () => clearInterval(countdownInterval);
  }

  if (isCountdown && countdownTime === 4 ){
    playSound(raceStartBeeps);
  }

  if (isCountdown && countdownTime === 0) {
    setIsCountdown(false); 
    setTimeLeft(parseInt(exerciseDuration));
    setIsRunning(true); 
  }
}, [isCountdown, countdownTime]);

useEffect(() => {
  if (isCountdown && countdownTime === 4) {
    playSound(raceStartBeeps);
  }
}, [countdownTime]);



  const startTimer = () => {
    if (!isRunning && parseInt(totalSets) > 0) {
      setCurrentSet(1);
      setIsExercise(true);
      setIsCountdown(true);
      setCountdownTime(5);
      setEditMode(false);
    }
  };

  const resetTimer = async () => {
    setIsRunning(false);
    setIsCountdown(false);
    setTimeLeft(0);
    setCurrentSet(1);
    setEditMode(true);
    if (intervalRef.current !== null) clearInterval(intervalRef.current);
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
  };

  function skip(): void {
    if (isCountdown) {
      setIsCountdown(false);
      setIsRunning(true);
      setTimeLeft(parseInt(exerciseDuration));
      setIsExercise(true);
      playSound(phaseSwitchSound);
      return;
    }

    if (isExercise) {
      if (currentSet >= parseInt(totalSets)) {
        setIsRunning(false);
        setTimeLeft(0);
        playSound(sessionEndSound);
      } else {
        setIsExercise(false);
        setTimeLeft(parseInt(breakDuration));
        playSound(phaseSwitchSound);
      }
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
  
  function skipPrevious() {
   if (isCountdown) {
    // Falls im Countdown: abbrechen und zurück zum Setup
    setIsCountdown(false);
    setCountdownTime(10);
    setEditMode(true);
    return;
  }

  if (isExercise) {
    if (currentSet === 1) {
      return;
    } else {
      setCurrentSet(prev => prev - 1);
      setIsExercise(false);
      setTimeLeft(parseInt(breakDuration));
      playSound(phaseSwitchSound);
    }
  } else {
    setIsExercise(true);
    setTimeLeft(parseInt(exerciseDuration));
    playSound(phaseSwitchSound);
  }
}


  const playSound = async (soundFile: any) => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      const { sound } = await Audio.Sound.createAsync(soundFile);
      soundRef.current = sound;
      await sound.playAsync();
    } catch (error) {
      console.error('Fehler beim Abspielen des Sounds:', error);
    }
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
        if (currentSet >= parseInt(totalSets)){
          setIsRunning(false);
         
          playSound(sessionEndSound);
        }else{
          setIsExercise(false);
          setTimeLeft(parseInt(breakDuration));
          playSound(phaseSwitchSound);
        }
      } else {
        if (currentSet < parseInt(totalSets)) {
          setCurrentSet(prev => prev + 1);
          setIsExercise(true);
          setTimeLeft(parseInt(exerciseDuration));
          playSound(phaseSwitchSound);
        } else {
          setIsRunning(false);
          setTimeLeft(0);
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

      {isCountdown ? (
        <View style={styles.timerBox}>
          <Text style={styles.timeText}>
            {String(countdownTime).padStart(2, '0')}s
          </Text>
          <Text style={styles.phaseText}>Get Ready!</Text>
        </View>
      ) : editMode ? (
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
            textColor='#fff'
            style={{ backgroundColor: Constants.primaryBlue, borderRadius: 8 }}
          >
            Start
          </Button>
        ) : (

      <View style={{ alignItems: 'center', marginTop: 20 }}>
        {!isCountdown && (
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 10}}>
            <IconButton
              icon="skip-previous"
              size={20}
              onPress={skipPrevious}
              disabled={isExercise && currentSet === 1}
              style={{
                backgroundColor:
                  (isExercise && currentSet === 1) ? '#888' : Constants.primaryBlue,
                height: 40,
                width: 40,
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              containerColor={Constants.primaryBlue}
              iconColor="white"
            />

            <IconButton
              icon={isRunning ? 'pause' : 'play'}
              size={20}
              onPress={() => setIsRunning(prev => !prev)}
              disabled={timeLeft <= 0}
              style={{
                backgroundColor:
                  (timeLeft <= 0) ? '#888' : Constants.primaryBlue,
                height: 40,
                width: 40,
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              containerColor={Constants.primaryBlue}
              iconColor="white"
            />
            <IconButton
              icon="skip-next"
              size={20}
              onPress={skip}
              disabled={!isRunning}
              style={{
                backgroundColor:
                  (!isRunning) ? '#888' : Constants.primaryBlue,
                height: 40,
                width: 40,
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              containerColor={Constants.primaryBlue}
              iconColor="white"
            />
          </View>
        )}

        <Button
          mode="contained"
          onPress={resetTimer}
          textColor= '#fff'
          style={{
            marginTop: 16,
            backgroundColor: 'red',
            borderRadius: 8,
          }}
        >
          Cancel
        </Button>
      </View>

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
