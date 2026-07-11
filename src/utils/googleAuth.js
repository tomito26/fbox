import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { auth, database } from '../firebase-config';

const provider = new GoogleAuthProvider();

/**
 * Sign in (or sign up) with Google. Mirrors the email/password flow: creates a
 * users/{uid} profile doc on first sign-in, otherwise just flags presence.
 * The Firestore writes are best-effort — they don't hold up the redirect,
 * matching the pattern in Login/Register.
 */
export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  const docRef = doc(database, 'users', user.uid);
  const snap = await getDoc(docRef).catch(() => null);

  if (snap && snap.exists()) {
    setDoc(docRef, { isOnline: true }, { merge: true }).catch((err) =>
      console.error('presence update failed:', err)
    );
  } else {
    setDoc(docRef, {
      username: user.displayName || (user.email ? user.email.split('@')[0] : ''),
      email: user.email || '',
      createdAt: Timestamp.fromDate(new Date()),
      isOnline: true,
    }).catch((err) => console.error('profile write failed:', err));
  }

  return user;
}
