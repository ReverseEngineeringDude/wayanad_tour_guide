import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDoc,
    setDoc,
    query,
    where,
    orderBy,
    limit
} from 'firebase/firestore';

export { where, orderBy, limit };
import { db } from './config';

// --- Generic Firestore Helpers ---

/**
 * Fetch all documents from a collection
 * @param {string} collectionName 
 * @returns {Promise<Array>} List of documents with IDs
 */
export const fetchCollection = async (collectionName) => {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Fetch documents with a query
 * @param {string} collectionName 
 * @param {Array} constraints - Array of query constraints (where, orderBy, etc.)
 * @returns {Promise<Array>} List of documents
 */
export const fetchQuery = async (collectionName, ...constraints) => {
    const q = query(collection(db, collectionName), ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Fetch a single document by ID
 * @param {string} collectionName 
 * @param {string} docId 
 * @returns {Promise<Object>} Document data with ID
 */
export const fetchDocument = async (collectionName, docId) => {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
    } else {
        throw new Error("Document not found");
    }
};

/**
 * Add a new document to a collection
 * @param {string} collectionName 
 * @param {Object} data 
 * @returns {Promise<string>} New Document ID
 */
export const addDocument = async (collectionName, data) => {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
};

/**
 * Update an existing document
 * @param {string} collectionName 
 * @param {string} docId 
 * @param {Object} data 
 */
export const updateDocument = async (collectionName, docId, data) => {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, data);
};

/**
 * Delete a document
 * @param {string} collectionName 
 * @param {string} docId 
 */
export const deleteDocument = async (collectionName, docId) => {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
};

/**
 * Set a document with a specific ID (useful for Users)
 * @param {string} collectionName 
 * @param {string} docId 
 * @param {Object} data 
 */
export const setDocument = async (collectionName, docId, data) => {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, data, { merge: true });
};

// --- Image Handling (Base64) ---

/**
 * Convert File object to Base64 string
 * @param {File} file 
 * @returns {Promise<string>} Base64 string
 */
export const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
};
