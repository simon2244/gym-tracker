import { ScrollView, StyleSheet, View } from "react-native";
import { Exercise } from "../(tabs)";

type ExerciseDetailsProps = {
  exercise: Exercise;
};

export default function ExerciseDetails({ exercise }: ExerciseDetailsProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <Text style={styles.title}> {exercise.name} </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "bold",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#888",
    textAlign: "center",
    color: "#fff",
  },
});
