import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";

import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";

import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAqJ1YpXZfQGbCw-IxWQ9ZD4qriyG3uh_0",

  authDomain: "fire-base-app-6ae64.firebaseapp.com",

  projectId: "fire-base-app-6ae64",

  storageBucket: "fire-base-app-6ae64.appspot.com",

  messagingSenderId: "297882923268",

  appId: "1:297882923268:web:be88bf5ab4e9e89d1ba051",

  measurementId: "G-NMV5WWYDXJ",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
// const analytics = getAnalytics(app);
const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = async () => {
  await signOut(auth);
};

const addMessage = async (payload) => {
  try {
    await addDoc(collection(db, "messages"), {
      uid: payload.uid || "",
      name: payload.name || "",
      email: payload.email || "",
      message: payload.message || "",
      created_at: new Date(),
    });
    alert("success");
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};

const getMessage = async () => {
  try {
    const q = query(collection(db, "messages"), orderBy("created_at", "desc"));
    const querySnapshot = await getDocs(q);
    const arr = [];
    querySnapshot.forEach((doc) => {
      arr.push(doc.data());
    });
    return arr;
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};

const onListentMessage = (onFetch) => {
  const q = query(collection(db, "messages"));
  onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        onFetch();
      }
      if (change.type === "modified") {
        onFetch();
      }
      if (change.type === "removed") {
        onFetch();
      }
    });
  });
};

const uploadFile = (file, setPercent) => {
  if (!file) {
    alert("Please choose a file first!");
  }
  const storageRef = ref(storage, `/files/${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const percent = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );

      // update progress
      setPercent(percent);
    },
    (err) => console.log(err),
    () => {
      // download url
      getDownloadURL(uploadTask.snapshot.ref).then((url) => {
        console.log(url);
      });
    }
  );
};

export {
  auth,
  db,
  storage,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  addMessage,
  getMessage,
  onListentMessage,
  uploadFile,
};
