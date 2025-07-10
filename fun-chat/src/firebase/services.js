import { collection as firestoreCollection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from "./config";

export const addDocument = (collectionName, data) => {
    const query = firestoreCollection(db, collectionName);

    return addDoc(query, {
        ...data,
        createAt: serverTimestamp(),
    });
};