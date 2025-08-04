import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  Button,
  Dialog,
  Icon,
  IconButton,
  PaperProvider,
  TextInput,
} from "react-native-paper";
import ExerciseBox from "../components/exerciseBox";
import PillList from "../components/PillList";
import Constants from "../constants";
import rawData from "../data.json";
import { usePlans } from "../context/planscontext";
import { Exercise, Plan } from "../context/planscontext";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";

// Clean up data to remove undefined exercises
const data = rawData.map((plan) => ({
  ...plan,
  exercises: Object.fromEntries(
    Object.entries(plan.exercises).filter(([_, ex]) => ex !== undefined),
  ),
}));

export default function Index() {
  const { plans, setPlans, isLoading } = usePlans();
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const plansMap: Record<string, string> = plans.reduce(
    (acc, plan) => {
      acc[plan.id] = plan.name;
      return acc;
    },
    {} as Record<string, string>,
  );

  const [showAddPlanDialog, setShowAddPlanDialog] = useState(false);
  const [newPlanName, setNewPlanName] = useState("");
  const screenWidth = Dimensions.get("window").width;
  const [reorderMode, setReorderMode] = useState(false);
  const [isAtListEnd, setIsAtListEnd] = useState(false);

  function handleReorder(newOrder: Exercise[]) {
    setPlans((prevPlans) =>
      prevPlans.map((plan) => {
        if (plan.id === selectedPlan) {
          const reordered = Object.fromEntries(
            newOrder.map((ex) => [ex.id, ex]),
          );
          return {
            ...plan,
            exercises: reordered,
          };
        }
        return plan;
      }),
    );
  }

  // Function to get the next plan ID based on existing plans
  function nextPlanId() {
    let maxId = 0;

    plans.forEach((plan) => {
      const planIdNum = parseInt(plan.id.replace("plan", ""), 10);
      if (!isNaN(planIdNum) && planIdNum > maxId) {
        maxId = planIdNum;
      }
    });

    return maxId + 1;
  }

  // Function to get the next exercise ID based on existing exercises in all plans
  function nextExerciseId() {
    let maxId = 0;

    plans.forEach((plan) => {
      plan.exercises &&
        Object.values(plan.exercises).forEach((exercise) => {
          const exerciseIdNum = parseInt(exercise.id.replace("ex", ""), 10);
          if (!isNaN(exerciseIdNum) && exerciseIdNum > maxId) {
            maxId = exerciseIdNum;
          }
        });
    });
    return maxId + 1;
  }

  // Function to get exercises by plan name
  function getExercisesByPlan(planName: string) {
    const plan = plans.find((p) => p.name === planName);

    if (
      !plan ||
      typeof plan.exercises !== "object" ||
      plan.exercises === null
    ) {
      return [];
    }

    return Object.values(plan.exercises);
  }
  function getExercisesByPlanId(planId: string) {
    const plan = plans.find((p) => p.id === planId);

    if (
      !plan ||
      typeof plan.exercises !== "object" ||
      plan.exercises === null
    ) {
      return [];
    }

    return Object.values(plan.exercises);
  }

  function handleAddExerciseButtonPress() {
    let id = nextExerciseId();
    if (typeof selectedPlan === "string" && selectedPlan.trim() !== "") {
      addExerciseToPlan(selectedPlan, {
        id: `ex${id}`,
        name: "New Exercise",
        sets: "0",
        weight: "0",
        reps: "0",
        difficulty: 0,
      });
    }
  }

  function addExerciseToPlan(planId: string, newExercise: Exercise) {
    setPlans((prevPlans) =>
      prevPlans.map((plan) => {
        if (plan.id === planId) {
          return {
            ...plan,
            exercises: {
              ...plan.exercises,
              [newExercise.id]: newExercise,
            },
          };
        }
        return plan;
      }),
    );
  }

  function handleDeleteExercise(id: string): void {
    setPlans((prevPlans) =>
      prevPlans.map((plan) => {
        if (plan.id === selectedPlan) {
          return {
            ...plan,
            exercises: Object.fromEntries(
              Object.entries(plan.exercises).filter(
                ([_, exercise]) => exercise.id !== id,
              ),
            ),
          };
        }
        return plan;
      }),
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

    setPlans((prevPlans) => [...prevPlans, newPlan]);
    setShowAddPlanDialog(false);
    setNewPlanName("");
  }
  // Function to check if we're near the end of the list
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 5;
    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;

    setIsAtListEnd(isCloseToBottom);
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <View style={[styles.topBar, { alignItems: "center" }]}>
          <PillList
            items={plansMap}
            selectedIndex={plans.findIndex((plan) => plan.id === selectedPlan)}
            onSelect={(planId) => setSelectedPlan(planId)}
            addPlan={handleAddPlan}
            deletePlan={(planId) =>
              setPlans(plans.filter((plan) => plan.id !== planId))
            }
          />
          <View style={{ flex: 1 }} />
          <View>
            <IconButton
              icon={reorderMode ? "check" : "drag"}
              mode="contained"
              iconColor="#fff"
              size={24}
              onPress={() => setReorderMode(!reorderMode)}
              style={{
                backgroundColor: Constants.primaryBlue,
                marginRight: 15,
              }}
            />
          </View>
        </View>

        {Platform.OS === "web" ? (
          <KeyboardAvoidingView style={{ flex: 1 }}>
            <ScrollView
              style={{ flex: 1, width: "100%" }}
              contentContainerStyle={{
                width: screenWidth,
                paddingHorizontal: screenWidth > 1200 ? 300 : 20,
              }}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >
              {getExercisesByPlanId(selectedPlan).map((item) => (
                <View
                  key={`${selectedPlan}-${item.id}`}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    opacity: 1,
                    paddingHorizontal: 8,
                  }}
                >
                  {reorderMode && (
                    <IconButton
                      icon="drag"
                      size={20}
                      style={{ marginRight: 8, marginLeft: 4 }}
                      iconColor="#ccc"
                    />
                  )}
                  <View style={{ flex: 1 }}>
                    <ExerciseBox
                      {...item}
                      exercise_id={item.id}
                      plan_id={selectedPlan}
                      onDelete={() => handleDeleteExercise(item.id)}
                      onEdit={() => handleEditExercise(item.id)}
                    />
                  </View>
                </View>
              ))}
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <IconButton
                  icon="plus"
                  size={24}
                  iconColor="white"
                  style={styles.iconButton}
                  onPress={handleAddExerciseButtonPress}
                  disabled={selectedPlan === ""}
                />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        ) : (
          <GestureHandlerRootView style={{ flex: 1, width: "100%" }}>
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
            >
              <View
                style={{
                  width: screenWidth,
                  paddingHorizontal: screenWidth > 1200 ? 300 : 20,
                }}
              >
                <DraggableFlatList
                  data={getExercisesByPlanId(selectedPlan)}
                  keyExtractor={(item) => `${selectedPlan}-${item.id}`}
                  onDragEnd={({ data }) => handleReorder(data)}
                  onScroll={handleScroll}
                  scrollEventThrottle={16}
                  renderItem={({
                    item,
                    drag,
                    isActive,
                  }: RenderItemParams<Exercise>) => (
                    // Dein bestehender renderItem-Code
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        opacity: isActive ? 0.8 : 1,
                        paddingHorizontal: 8,
                        backgroundColor: isActive
                          ? "rgba(0,0,0,0.1)"
                          : "transparent",
                        transform: [{ scale: isActive ? 1.02 : 1 }], // Leichte Vergrößerung beim Ziehen
                      }}
                    >
                      {reorderMode && (
                        <IconButton
                          icon="drag"
                          size={20}
                          onPressIn={drag}
                          {...(Platform.OS === "web" && {
                            onMouseDown: drag,
                          })}
                          style={{ marginRight: 8, marginLeft: 4 }}
                          iconColor="#ccc"
                        />
                      )}
                      <View style={{ flex: 1 }}>
                        <ExerciseBox
                          {...item}
                          exercise_id={item.id}
                          plan_id={selectedPlan}
                          onDelete={() => handleDeleteExercise(item.id)}
                          onEdit={() => handleEditExercise(item.id)}
                        />
                      </View>
                    </View>
                  )}
                  ListFooterComponent={
                    <View
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      <IconButton
                        icon="plus"
                        size={24}
                        iconColor="white"
                        style={styles.iconButton}
                        onPress={handleAddExerciseButtonPress}
                        disabled={selectedPlan === ""}
                      />
                    </View>
                  }
                />
              </View>
            </KeyboardAvoidingView>
          </GestureHandlerRootView>
        )}

        <Dialog
          style={{
            width: "70%",
            height: "30%",
            borderRadius: 20,
            alignSelf: "center",
            backgroundColor: Constants.backgroundDark,
          }}
          visible={showAddPlanDialog}
          onDismiss={() => setShowAddPlanDialog(false)}
        >
          <Dialog.Title style={{ color: "#fff" }}>Add New Plan</Dialog.Title>
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
            <View style={{ borderRadius: 50, flexDirection: "row" }}>
              <Button
                mode="text"
                onPress={() => {
                  setShowAddPlanDialog(false);
                  setNewPlanName("");
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
                  !newPlanName.trim() && { color: "#888" },
                ]}
                disabled={!newPlanName.trim()}
              >
                Add
              </Button>
            </View>
          </Dialog.Actions>
        </Dialog>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    backgroundColor: Constants.backgroundDark,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
  },
  buttonLabelStyle: {
    color: Constants.primaryBlue,
    fontSize: 16,
  },
  topBar: {
    position: "relative",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
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
    backgroundColor: "#333",
    color: "white",
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 8,
    outlineColor: Constants.primaryBlue,
  },
});
