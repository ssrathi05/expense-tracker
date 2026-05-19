import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase/firebaseConfig";

export async function addTransaction(userId, transaction) {
  const transactionsRef = collection(db, "users", userId, "transactions");

  await addDoc(transactionsRef, {
    ...transaction,
    createdAt: serverTimestamp(),
  });
}

export async function getTransactions(userId) {
  const transactionsRef = collection(db, "users", userId, "transactions");
  const q = query(transactionsRef, orderBy("createdAt", "desc"));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
}

export async function deleteTransaction(userId, transactionId) {
  const transactionRef = doc(
    db,
    "users",
    userId,
    "transactions",
    transactionId
  );

  await deleteDoc(transactionRef);
}

export async function updateTransaction(userId, transactionId, updates) {
  const transactionRef = doc(
    db,
    "users",
    userId,
    "transactions",
    transactionId
  );

  await updateDoc(transactionRef, updates);
}