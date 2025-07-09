import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import Constants from '../constants';

const daysOfWeek = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstWeekdayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay(); // Sonntag=0, Montag=1, ...
  // Umrechnung: Montag=0, Sonntag=6
  return day === 0 ? 6 : day - 1;
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const daysInMonth = getDaysInMonth(year, month);
  const firstWeekday = getFirstWeekdayOfMonth(year, month);

  const screenWidth = Dimensions.get('window').width;
  const cellSize = screenWidth / 7;

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Build array of days with empty slots for leading blanks
  const calendarDays = [];

  for (let i = 0; i < firstWeekday; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={prevMonth} style={styles.navButton}>
          <Text style={styles.navButtonText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.monthText}>
          {currentDate.toLocaleString('de-DE', { month: 'long' })} {year}
        </Text>
        <TouchableOpacity onPress={nextMonth} style={styles.navButton}>
          <Text style={styles.navButtonText}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      {/* Days of week header */}
      <View style={styles.weekdaysRow}>
        {daysOfWeek.map((day) => (
          <View key={day} style={[styles.dayCell, { width: cellSize }]}>
            <Text style={styles.weekdayText}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <ScrollView contentContainerStyle={styles.calendarGrid}>
        {calendarDays.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.dayCell, { width: cellSize, height: cellSize }]}
            disabled={day === null}
            onPress={() => day && alert(`Tag ${day}.${month + 1}.${year} ausgewählt`)}
          >
            <Text style={[styles.dayText, day === currentDate.getDate() ? styles.todayText : null]}>
              {day || ''}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.backgroundDark,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  navButton: {
    padding: 10,
    backgroundColor: Constants.primaryBlue,
    borderRadius: 8,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 20,
  },
  monthText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  weekdaysRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#555',
  },
  dayCell: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#444',
  },
  weekdayText: {
    color: '#aaa',
    fontWeight: '600',
    paddingVertical: 6,
  },
  dayText: {
    color: '#eee',
    fontSize: 16,
  },
  todayText: {
    backgroundColor: Constants.primaryBlue,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
    overflow: 'hidden',
    color: 'white',
    fontWeight: 'bold',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
