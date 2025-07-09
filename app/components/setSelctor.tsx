import React, { useState } from 'react';
import { View, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import Constants from '../constants';

type SetSelectorProps = {
  label: string;
  value: number;
  onChange: (val: number) => void;
};

export default function SetSelector({ label, value, onChange }: SetSelectorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(value.toString());

  const commitEdit = () => {
    const parsed = parseInt(editText, 10);
    if (!isNaN(parsed)) onChange(Math.max(0, parsed));
    setIsEditing(false);
  };

  const changeValue = (delta: number) => {
    onChange(Math.max(0, value + delta));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.controls}>
        <Button
          mode="contained"
          onPress={() => changeValue(-1)}
         style={[
    styles.button,
    { marginHorizontal: getHorizontalMargin(value) },
  ]}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
          
        >–</Button>

        <TouchableWithoutFeedback onPress={() => {}} onLongPress={() => setIsEditing(true)}>
          {isEditing ? (
           <TextInput
            mode="outlined"
            style={styles.input}
            value={editText}
            onChangeText={(text) => {
                const numericText = text.replace(/[^0-9]/g, ''); // nur Ziffern
                if (numericText.length <= 3) {
                setEditText(numericText.replace(/^0+(?!$)/, '')); // führende 0 entfernen
                }
            }}
            onBlur={commitEdit}
            autoFocus
            keyboardType="number-pad"
            maxLength={3}
            textColor="#fff"
        />
          ) : (
            <Text style={styles.valueText}>{value}</Text>
          )}
        </TouchableWithoutFeedback>

        <Button
          mode="contained"
          onPress={() => changeValue(1)}
          style={[
    styles.button,
    { marginHorizontal: getHorizontalMargin(value) },
  ]}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
        >+</Button>
      </View>
    </View>
  );
}

const getHorizontalMargin = (value: number) => {
    if (value < 10) return 54;
    if (value < 100) return 41;
    return 27;
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 16,
        alignItems: 'center',
    },
    label: {
        color: '#aaa',
        fontSize: 16,
        marginBottom: 8,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        backgroundColor: Constants.primaryBlue,
        height: 40,
        minWidth: 40,
        borderRadius: 20,
        alignSelf: 'center',
        
    },
    buttonContent: {
        height: 40,
    },
    buttonLabel: {
        fontSize: 18,
        lineHeight: 18,
    },
    valueText: {
        fontSize: 48,
        color: '#fff',
        fontWeight: 'bold',
        paddingHorizontal: 16,
        minWidth: 60,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#222',
        color: '#fff',
        width: 80,
        textAlign: 'center',
    },
});

// Override marginHorizontal dynamically in the component
