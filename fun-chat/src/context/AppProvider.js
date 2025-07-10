import React, { createContext, useContext, useMemo, useState } from 'react'
import { AuthContext } from './AuthProvider';
import useFirestore from '../components/hooks/useFirestore';

export const AppContext = createContext();

export default function AppProvider({ children }) {

    const [isAddRoomVisible, setIsAddRoomVisible] = useState(false);

    const { user: { uid } } = useContext(AuthContext);

    /**
     * {
     * name: 'room name',
     * description: 'mo ta',
     * members: [uid1, udi2,...]
     * }
     */

    const roomsCondition = useMemo(() => ({
        fieldName: 'members',
        operator: 'array-contains',
        compareValue: uid,
    }), [uid]);

    const rooms = useFirestore('rooms', roomsCondition);

    console.log(rooms);

    return (
        <AppContext.Provider value={{ rooms, isAddRoomVisible, setIsAddRoomVisible }}>
            {children}
        </AppContext.Provider>
    )
}
