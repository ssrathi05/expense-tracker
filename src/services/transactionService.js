import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  where,
  limit,
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

export async function sampleTransactionExists(userId, sampleKey) {
  const transactionsRef = collection(db, "users", userId, "transactions");
  const q = query(
    transactionsRef,
    where("sampleKey", "==", sampleKey),
    limit(1)
  );

  const snapshot = await getDocs(q);
  return !snapshot.empty;
}

export async function addSampleTransaction(userId, transaction) {
  const { sampleKey, ...fields } = transaction;

  if (sampleKey) {
    const exists = await sampleTransactionExists(userId, sampleKey);
    if (exists) {
      return "skipped";
    }
  }

  const transactionsRef = collection(db, "users", userId, "transactions");

  await addDoc(transactionsRef, {
    ...fields,
    sampleKey,
    source: "sample",
    createdAt: serverTimestamp(),
  });

  return "imported";
}

export async function plaidTransactionExists(userId, plaidTransactionId) {
  const transactionsRef = collection(db, "users", userId, "transactions");
  const q = query(
    transactionsRef,
    where("plaidTransactionId", "==", plaidTransactionId),
    limit(1)
  );

  const snapshot = await getDocs(q);
  return !snapshot.empty;
}

export async function addPlaidTransaction(userId, transaction) {
  const plaidTransactionId = transaction.transaction_id;

  if (plaidTransactionId) {
    const exists = await plaidTransactionExists(userId, plaidTransactionId);
    if (exists) {
      return "skipped";
    }
  }

  const transactionsRef = collection(db, "users", userId, "transactions");

  await addDoc(transactionsRef, {
    plaidTransactionId,
    merchant:
      transaction.merchant_name || transaction.name || "Unknown Merchant",
    amount: Number(transaction.amount),
    category: transaction.personal_finance_category?.primary || "Other",
    date: transaction.date,
    emoji: getEmojiForCategory(transaction.personal_finance_category?.primary),
    source: "plaid",
    createdAt: serverTimestamp(),
  });

  return "imported";
}

function getEmojiForCategory(category) {
  switch (category) {
    case "FOOD_AND_DRINK":
      return "🍔";
    case "TRANSPORTATION":
      return "🚗";
    case "TRAVEL":
      return "✈️";
    case "GENERAL_MERCHANDISE":
      return "🛍️";
    default:
      return "💳";
  }
}