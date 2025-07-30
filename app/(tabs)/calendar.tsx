import React, { useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import dayjs from 'dayjs';
import { usePlans } from '../context/planscontext';
import Constants from '../constants';
import { IconButton, Modal, Portal, Button, PaperProvider, Menu, Checkbox } from 'react-native-paper';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function CalendarScreen() {
  const { schedule, setSchedule, plans, dailyOverrides, setDailyOverrides } = usePlans();
  const [startDate, setStartDate] = useState(dayjs());
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [menuVisibleDay, setMenuVisibleDay] = useState<string | null>(null);
  const [editDate, setEditDate] = useState<dayjs.Dayjs | null>(null);
  // const [dailyOverrides, setDailyOverrides] = useState<Record<string, string[]>>({});
  const isPast = (item: dayjs.Dayjs) => item.isBefore(dayjs(), 'day');
  const flatListRef = useRef<FlatList>(null);


  // Generate list of future days
  const generateDates = () => {
     const today = dayjs();
  
    // 30 Tage in der Vergangenheit (gestern als letzter Tag) + heute + 90 Tage in der Zukunft
    const pastDays = Array.from({ length: 30 }, (_, i) => today.subtract(30 - i, 'day'));
    const futureDays = Array.from({ length: 90 }, (_, i) => today.add(i + 1, 'day'));
    
    // Kombiniere vergangene Tage + heute + zukünftige Tage
    return [...pastDays, today, ...futureDays];
  };

   // Memoize the dates to avoid regenerating on each render
  const dates = React.useMemo(() => generateDates(), []);
  
  // Finde den Index des heutigen Tages in der Liste
  const getTodayIndex = () => {
    const today = dayjs().format('YYYY-MM-DD');
    return dates.findIndex(date => date.format('YYYY-MM-DD') === today);
  };
   // Scroll zum heutigen Tag, wenn die Komponente geladen wird
  useEffect(() => {
    const todayIndex = getTodayIndex();
    if (todayIndex !== -1 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: todayIndex,
          animated: false ,
          viewPosition: 0.3,
        });
      }, 100);
    }
  }, []);

  const getPlannedPlans = (date: dayjs.Dayjs): string[] => {
  const dateKey = date.format('YYYY-MM-DD');
  const overridePlans = dailyOverrides[dateKey];

  const planIds = overridePlans ?? schedule[date.format('dddd') as keyof typeof schedule];

  if (!Array.isArray(planIds)) return [];

  return planIds
    .map(id => plans.find(p => p.id === id)?.name)
    .filter(Boolean) as string[];
};

  const getPlansForDate = (date: dayjs.Dayjs): string[] => {
  const dateKey = date.format('YYYY-MM-DD');
  if (dailyOverrides[dateKey]) {
    return dailyOverrides[dateKey];
  }
  const weekday = date.format('dddd') as keyof typeof schedule;
  return schedule[weekday] || [];
};


  function editDay(date: dayjs.Dayjs): void {
   setEditDate(date);
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        <View style={styles.topBar}>
          
          <IconButton
            icon="calendar-today"
            mode="contained"
            iconColor="#fff"
            size={24}
            onPress={() => {
              const todayIndex = getTodayIndex();
              if (todayIndex !== -1 && flatListRef.current) {
                flatListRef.current.scrollToIndex({
                  index: todayIndex,
                  animated: true,
                  viewPosition: 0.3,
                });
              }
            }}
            style={{ backgroundColor: Constants.primaryBlue}}
          />
          <IconButton
            icon="dots-horizontal"
            mode="contained"
            iconColor="#fff"
            size={24}
            onPress={() => setShowScheduleModal(true)}
            style={{ backgroundColor: Constants.primaryBlue }}
          />
        </View>

        <FlatList
          ref={flatListRef}
          data={generateDates()}
          keyExtractor={item => item.format('YYYY-MM-DD')}
          onScrollToIndexFailed={info => {
            const wait = new Promise(resolve => setTimeout(resolve, 500));
            wait.then(() => {
              flatListRef.current?.scrollToIndex({ 
                index: info.index, 
                animated: false 
              });
            });
          }}
          renderItem={({ item }) => {
            const dateStr = item.format('dddd, DD MMM');
            const plannedPlanNames = getPlannedPlans(item);
            const hasPlans = plannedPlanNames.length > 0;
            const isToday = item.format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD');

            return (
                <View style={[
                  styles.dayRow, 
                  isPast(item) && styles.pastDayRow, // Zusätzliches Styling für vergangene Tage
                  isToday && styles.todayRow // Hebe den heutigen Tag hervor
                ]}>
                  <Text style={[
                    styles.dateText,
                    isPast(item) && { color: '#777' }, 
                    isToday && { color: '#fff', fontWeight: 'bold' } 
                  ]}>
                    {dateStr}
                  </Text>
                  <View style={styles.planRow}>
                    <Text style={[
                      styles.planText,
                      isPast(item) && { color: '#666' } // Dunklere Textfarbe für vergangene Tage
                    ]}>
                      {hasPlans ? plannedPlanNames.join(', ') : 'Break Day'}
                    </Text>
                    <IconButton
                      icon="pencil"
                      size={18}
                      style={styles.editIcon}
                      iconColor={isPast(item) ? "#666" : "#aaa"} // Dunklere Iconfarbe für vergangene Tage
                      onPress={() => editDay(item)}
                    />
                  </View>
    </View>
            );
          }} />
        

        {/* Schedule Config Modal */}
        <Portal>
          <Modal
            visible={showScheduleModal}
            onDismiss={() => setShowScheduleModal(false)}
            contentContainerStyle={styles.modalContainer}
          >
            <Text style={styles.modalTitle}>Weekly Plan</Text>
            {daysOfWeek.map(day => {
              const selectedPlanIds = schedule[day as keyof typeof schedule] || [];
              const selectedPlanNames = plans
                .filter(p => selectedPlanIds.includes(p.id))
                .map(p => p.name)
                .join(', ') || 'Break Day';

              return (
                <View key={day} style={styles.scheduleRow}>
                  <Text style={styles.dayText}>{day}</Text>

                  <Menu
                    visible={menuVisibleDay === day}
                    onDismiss={() => setMenuVisibleDay(null)}
                    anchor={
                      <Button
                        mode="outlined"
                        onPress={() => setMenuVisibleDay(day)}
                        textColor="#fff"
                      >
                        {selectedPlanNames}
                      </Button>
                    }
                    contentStyle={{ backgroundColor: '#333' }}
                  >
                    {plans.map(plan => {
                      const isSelected = selectedPlanIds.includes(plan.id);
                      return (
                        <Menu.Item
                          key={plan.id}
                          onPress={() => {
                            const updated = isSelected
                              ? selectedPlanIds.filter(id => id !== plan.id)
                              : [...selectedPlanIds, plan.id];

                            setSchedule(prev => ({
                              ...prev,
                              [day]: updated,
                            }));
                          }}
                          title={
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <Checkbox
                                status={isSelected ? 'checked' : 'unchecked'}
                                onPress={() => {
                                  const updated = isSelected
                                    ? selectedPlanIds.filter(id => id !== plan.id)
                                    : [...selectedPlanIds, plan.id];
                                  setSchedule(prev => ({
                                    ...prev,
                                    [day]: updated,
                                  }));
                                }}
                                color={Constants.primaryBlue}
                                uncheckedColor="#ccc"
                              />
                              <Text style={{ color: '#fff' }}>{plan.name}</Text>
                            </View>
                          }
                        />
                      );
                    })}
                  </Menu>
                </View>
              );
            })}

            <Button
              mode="contained"
              onPress={() => setShowScheduleModal(false)}
              textColor='#fff'
              style={{ marginTop: 16, backgroundColor: Constants.primaryBlue }}
            >
              Ok
            </Button>
          </Modal>
        </Portal>
        <Portal>
  {editDate && (
    <Modal
      visible={true}
      onDismiss={() => setEditDate(null)}
      contentContainerStyle={styles.modalContainer}
    >
      <Text style={styles.modalTitle}>
        Plans on {editDate.format('dddd, DD MMM')}
      </Text>

      {plans.map(plan => {
        const dateKey = editDate.format('YYYY-MM-DD');
        const selectedPlanIds = getPlansForDate(editDate);
        const isSelected = selectedPlanIds.includes(plan.id);

        const togglePlan = () => {
          const updated = isSelected
            ? selectedPlanIds.filter(id => id !== plan.id)
            : [...selectedPlanIds, plan.id];

          setDailyOverrides(prev => ({
            ...prev,
            [dateKey]: updated,
          }));
        };

        return (
          <View key={plan.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Checkbox
              status={isSelected ? 'checked' : 'unchecked'}
              onPress={togglePlan}
              color={Constants.primaryBlue}
              uncheckedColor="#ccc"
            />
            <Text style={{ color: '#fff' }}>{plan.name}</Text>
          </View>
        );
      })}

      <Button
        mode="contained"
        onPress={() => setEditDate(null)}
        textColor= '#fff'
        style={{ marginTop: 16, backgroundColor: Constants.primaryBlue }}
      >
        Ok
      </Button>
    </Modal>
  )}
</Portal>

      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.backgroundDark,
    paddingTop: 50,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  dayRow: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  dateText: {
    fontSize: 16,
    color: '#fff',
  },
  planText: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 4,
  },
  modalContainer: {
    backgroundColor: '#222',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 16,
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayText: {
    color: '#fff',
    fontSize: 16,
  },
  planRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 8,
  },
  editIcon: {
    marginLeft: 8,
    padding: 0,
    height: 24,
    width: 24,
    backgroundColor: 'transparent',
  },
  pastDayRow: {
  backgroundColor: '#1a1a1a', 
},
 todayRow: {
    backgroundColor: Constants.primaryBlue + '40', 
    borderLeftWidth: 3,
    borderLeftColor: Constants.primaryBlue,
  },

});
