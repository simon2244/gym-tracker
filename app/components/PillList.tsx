import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import Constants from '../constants';
type PillListProps = {
    items: string[];
    selectedIndex?: number;
    onSelect?: (selectedItem: string) => void;
}


export default function PillGroup({ items, selectedIndex, onSelect }: PillListProps){

  const [selected, setSelected] = useState(items[selectedIndex || 0]);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.container}>
        {items.map((item) => (
          <TouchableOpacity
            key={item}
             onPress={() => {
              setSelected(item);
              onSelect?.(item); // Optionaler Callback
            }}
            style={[
              styles.pill,
              selected === item && styles.selectedPill,
            ]}
          >
            <Text
              style={[
                styles.pillText,
                selected === item && styles.selectedPillText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#eee',
  },
  selectedPill: {
    backgroundColor: Constants.primaryBlue,
  },
  pillText: {
    color: '#333',
    fontSize: 14,
  },
  selectedPillText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});


