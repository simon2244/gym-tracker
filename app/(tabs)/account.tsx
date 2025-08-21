import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Constants from "../constants";
import { View, StyleSheet } from 'react-native';
import { Avatar, Text, ActivityIndicator, Surface } from 'react-native-paper';
import { TouchableOpacity } from 'react-native';

export default function AuthAccountInfo() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (!error) setUser(data.user);
        };
        fetchUser();
    }, []);

    if (!user) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator animating color="#fff" />
                <Text style={{ color: '#fff', marginTop: 16 }}>Loading account info...</Text>
            </View>
        );
    }

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };
    return (
        <Surface style={styles.surface}>
            <View style={styles.profileContainer}>
            <Avatar.Icon
                size={96}
                icon="account"
                style={{ backgroundColor: '#222', marginBottom: 16 }}
                color="#fff"
            />
            <Text style={styles.email}>{user.email}</Text>
            </View>
            <TouchableOpacity onPress={handleLogout}>
                <Avatar.Icon
                    size={48}
                    icon="logout"
                    style={{ backgroundColor: Constants.primaryBlue, marginBottom: 8 }}
                    color="#fff"
                />
            </TouchableOpacity>
        </Surface>
    );
}

const styles = StyleSheet.create({
    surface: {
        backgroundColor: Constants.backgroundDark,
        minHeight: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 48,
    },
    profileContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    email: {
        fontSize: 18,
        fontWeight: '500',
        color: '#fff',
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: Constants.backgroundDark,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
