import {
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
export async function saveSingleton(name, data) {
  await setDoc(
    doc(db, "site", name),
    { ...data, updatedAt: serverTimestamp() },
    { merge: true },
  );
}
export async function getSingleton(name) {
  const s = await getDoc(doc(db, "site", name));
  return s.exists() ? s.data() : null;
}
export async function createItem(name, data) {
  return addDoc(collection(db, name), {
    ...data,
    createdAt: serverTimestamp(),
  });
}
export async function updateItem(name, id, data) {
  return updateDoc(doc(db, name, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}
export async function removeItem(name, id) {
  return deleteDoc(doc(db, name, id));
}
