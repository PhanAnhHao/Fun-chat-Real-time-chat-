import React, { createContext, useContext, useMemo, useState } from 'react'
import { AuthContext } from './AuthProvider';
import useFirestore from '../components/hooks/useFirestore';

export const AppContext = createContext();

export default function AppProvider({ children }) {

    const [isAddRoomVisible, setIsAddRoomVisible] = useState(false);
    const [isInviteMemberVisible, setIsInviteMemberVisible] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState('');

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
    // console.log(rooms);

    const selectedRoom = useMemo(() => rooms.find((room) => room.id === selectedRoomId) || {}, [rooms, selectedRoomId]);

    const usersCondition = React.useMemo(() => {
        return {
            fieldName: 'uid',
            operator: 'in',
            compareValue: selectedRoom.members,
        };
    }, [selectedRoom.members]);

    const members = useFirestore('users', usersCondition);
    // console.log({ members, selectedMembers: selectedRoom.members });

    return (
        <AppContext.Provider value={{
            rooms,
            members,
            selectedRoom,
            isAddRoomVisible, setIsAddRoomVisible,
            selectedRoomId, setSelectedRoomId,
            isInviteMemberVisible, setIsInviteMemberVisible,
        }}>
            {children}
        </AppContext.Provider>
    )
}
