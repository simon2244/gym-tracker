import React, { useState, useEffect, useRef } from "react";
import Constants from "../constants"; // Adjust path as needed
import { Button, PaperProvider, Text, TextInput } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

type TimeSelectorProps = {
  label: string;
  value: number;
  onChange: (val: number) => void;
};

export default function TimeSelector({
  label,
  value,
  onChange,
}: TimeSelectorProps) {
  const [selectedPart, setSelectedPart] = useState<"min" | "sec">("min");
  const [spulenVor, setSpulenVor] = useState(false);
  const [spulenBack, setSpulenBack] = useState(false);

  const formatTime = (seconds: number) => {
    const mm = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const ss = (seconds % 60).toString().padStart(2, "0");
    return `${mm}:${ss}`;
  };

  const parseTime = (time: string) => {
    const [mm, ss] = time.split(":").map(Number);
    return mm * 60 + ss;
  };

  const changeTime = (delta: number) => {
    const newValue =
      selectedPart === "min" ? value + delta * 60 : value + delta;

    onChange(Math.max(0, newValue));
  };

  const togglePart = () => {
    setSelectedPart((prev) => (prev === "min" ? "sec" : "min"));
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(formatTime(value));

  return (
    <View style={{ marginVertical: 16, alignItems: "center" }}>
      <Text style={{ color: "#aaa", fontSize: 16 }}>{label}</Text>
      <View style={{ flexDirection: "row", gap: 16, marginTop: 8 }}>
        <Button
          mode="contained"
          onPress={() => changeTime(-1)}
          onLongPress={() => setSpulenBack(true)}
          onResponderRelease={() => setSpulenBack(false)}
          textColor="#fff"
          style={{
            backgroundColor: Constants.primaryBlue,
            height: 40,
            minWidth: 40,
            borderRadius: 20,
            alignSelf: "center",
          }}
          contentStyle={{
            height: 40,
          }}
          labelStyle={{ fontSize: 18, lineHeight: 18 }}
        >
          –
        </Button>
        <TouchableWithoutFeedback onPress={togglePart}>
          {isEditing ? (
            <TextInput
              mode="outlined"
              style={{ backgroundColor: "#222", color: "#fff", width: 120 }}
              value={editText}
              onChangeText={(text) => {
                // Nur Ziffern erlauben
                const digits = text.replace(/\D/g, "").slice(0, 4); // max. 4 Ziffern

                let formatted = digits;
                if (digits.length > 2) {
                  formatted = digits.slice(0, 2) + ":" + digits.slice(2);
                } else if (digits.length > 0) {
                  formatted = digits;
                }

                setEditText(formatted);
              }}
              onBlur={() => {
                // Sicherstellen, dass es immer mm:ss ist
                const digits = editText.replace(/\D/g, "").padStart(4, "0");
                const mm = digits.slice(0, 2);
                const ss = digits.slice(2, 4);
                setEditText(`${mm}:${ss}`);
                const totalSeconds = parseInt(mm, 10) * 60 + parseInt(ss, 10);
                onChange(totalSeconds);
                setIsEditing(false);
              }}
              autoFocus
              keyboardType="number-pad"
              maxLength={5} // 4 digits + 1 colon
              textColor="#fff"
            />
          ) : (
            <Text
              onLongPress={() => setIsEditing(true)}
              style={{
                fontSize: 48,
                color: "#fff",
                fontWeight: "bold",
                padding: 8,
              }}
            >
              <Text
                style={{
                  color:
                    selectedPart === "min" ? Constants.primaryBlue : "#fff",
                }}
              >
                {formatTime(value).split(":")[0]}
              </Text>
              :
              <Text
                style={{
                  color:
                    selectedPart === "sec" ? Constants.primaryBlue : "#fff",
                }}
              >
                {formatTime(value).split(":")[1]}
              </Text>
            </Text>
          )}
        </TouchableWithoutFeedback>

        <Button
          mode="contained"
          onPress={() => changeTime(1)}
          onLongPress={() => setSpulenVor(true)}
          onResponderRelease={() => setSpulenVor(false)}
          textColor="#fff"
          style={{
            backgroundColor: Constants.primaryBlue,
            height: 40,
            minWidth: 40,
            borderRadius: 20,
            alignSelf: "center",
          }}
          contentStyle={{
            height: 40,
          }}
          labelStyle={{ fontSize: 18, lineHeight: 18 }}
        >
          +
        </Button>
      </View>
    </View>
  );
}
