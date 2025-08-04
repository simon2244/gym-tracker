import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const DifficultyMeter = ({
  difficulty,
  onChange,
}: {
  difficulty: number;
  onChange: (value: number) => void;
}) => {
  return (
    <View style={styles.difficultyContainer}>
      <Text style={styles.difficultyLabel}>Difficulty:</Text>
      <View style={styles.difficultyMeter}>
        <TouchableOpacity
          style={[
            styles.difficultyButton,
            { backgroundColor: difficulty === 1 ? "#4CAF50" : "#1A3D1C" },
          ]}
          onPress={() => onChange(1)}
        />
        <TouchableOpacity
          style={[
            styles.difficultyButton,
            { backgroundColor: difficulty === 2 ? "#FFC107" : "#5D4B10" },
          ]}
          onPress={() => onChange(2)}
        />
        <TouchableOpacity
          style={[
            styles.difficultyButton,
            { backgroundColor: difficulty === 3 ? "#F44336" : "#541B16" },
          ]}
          onPress={() => onChange(3)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  difficultyContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    width: "100%",
  },
  difficultyLabel: {
    color: "#ccc",
    marginRight: 10,
    fontSize: 14,
  },
  difficultyMeter: {
    flexDirection: "row",
    gap: 8,
  },
  difficultyButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#555",
  },
});

export default DifficultyMeter;
