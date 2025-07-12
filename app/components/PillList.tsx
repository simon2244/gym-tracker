import React, { use, useRef, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView, Modal, TouchableWithoutFeedback } from 'react-native';
import Constants from '../constants';

type PillListProps = {
    items: Record<string, string>;
    selectedIndex?: number;
    onSelect?: (selectedItem: string) => void;
    addPlan?: () => void;
    deletePlan?: (planId: string) => void;
}


export default function PillGroup({ items, selectedIndex, onSelect, addPlan, deletePlan }: PillListProps){

  const [selected, setSelected] = useState(items[selectedIndex || 0]);
  const [popupVisible, setPopupVisible] = useState(false);
  const pressedItemIdRef = useRef<string>(null);
  const pressedItemNameRef = useRef<string>(null);

  function handleLongPress (id: string, name: string) {
      setPopupVisible(true);
      pressedItemIdRef.current = id;
      pressedItemNameRef.current = name;
  };
  function closeMenu (){
    setPopupVisible(false);
  };
   function handleDelete ()  {
   if (!pressedItemIdRef.current || !deletePlan) return;
      deletePlan(pressedItemIdRef.current);
      closeMenu();
  };
  function handleChangeOrder(){
    // Implement logic to change the order of items
    console.log("Change order functionality not implemented yet.");
  }


  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.container}>
        {Object.entries(items).map(([planId, planName]) => (
    <TouchableOpacity
      key={planId}
      onPress={() => {
        setSelected(planId);
        onSelect?.(planId);
      }}
      onLongPress={() => handleLongPress(planId, planName)}  
      style={[
        styles.pill,
        selected === planId && styles.selectedPill,  
      ]}
    >
      <Text
        style={[
          styles.pillText,
          selected === planId && styles.selectedPillText, 
        ]}
      >
        {planName}  
      </Text>
    </TouchableOpacity>
        ))}
        <TouchableOpacity 
        onPress={addPlan}
        style={[
             styles.pill
            ]}>
          <Text style={styles.pillText}>+</Text>
        </TouchableOpacity>
      </View>
      <Modal
        transparent={true}
        visible={popupVisible}
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <TouchableWithoutFeedback onPress={closeMenu}>
          <View style={styles.modalOverlay}>
            <View style={styles.menuContainer}>
              <Text style={styles.menuTitle}>{pressedItemNameRef.current}</Text>

              <TouchableOpacity style={styles.menuItem} onPress={handleDelete}>
                <Text style={styles.menuItemText}>Delete</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.menuItem} onPress={handleChangeOrder}>
                <Text style={styles.menuItemText}>Change Order</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.cancelButton} onPress={closeMenu}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      
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
    textAlign: 'center',
  },
  selectedPillText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    width: '80%',
    backgroundColor: Constants.backgroundDark,
    borderRadius: 10,
    overflow: 'hidden',
     
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#888',
    textAlign: 'center',
    color: '#fff',
  },
  menuItem: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#888',
   
  },
  menuItemText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  cancelButton: {
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: Constants.backgroundDark,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Constants.primaryBlue,
  },
});


