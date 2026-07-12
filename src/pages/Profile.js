import { onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import {
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
  sendEmailVerification,
} from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCamera } from 'react-icons/fa';
import { useUserAuth } from '../Context/UserAuthContext';
import { useWatchlist } from '../Context/WatchlistContext';
import { imageUrl } from '../services/tmdb';
import { database, auth, storage } from '../firebase-config';
import { watchStats } from '../utils/watchProgress';
import Avatar from '../components/Avatar';

// Map the Firebase error codes we're most likely to hit to friendly copy.
const friendlyError = (code) => {
  switch (code) {
    case 'auth/requires-recent-login':
      return 'For security, please re-enter your current password to continue.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Your current password is incorrect.';
    case 'auth/email-already-in-use':
      return 'That email is already in use by another account.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    default:
      return 'Something went wrong. Please try again.';
  }
};

// Detail-page path for a stored watchlist item (movie vs TV).
const detailPath = (item) =>
  `/${item.media_type === 'tv' ? 'tvshows' : 'movie'}/${item.id}`;

const Profile = () => {
  const [newProfile, setNewProfile] = useState({
    newUsername: '',
    newEmail: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const { user } = useUserAuth();
  const { watchlist } = useWatchlist();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [userData, setUserData] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // edit-form banner
  const [overviewMsg, setOverviewMsg] = useState(null); // avatar / verification banner
  const [uploading, setUploading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // Danger zone
  const [showDelete, setShowDelete] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState(null);

  // Aggregate viewing stats from the player's localStorage progress (read once
  // on mount — the keys are written by the embedded player, not React state).
  const [stats, setStats] = useState({ watched: 0, inProgress: 0 });
  useEffect(() => {
    setStats(watchStats());
  }, []);

  useEffect(() => {
    if (user) {
      const unsub = onSnapshot(doc(database, 'users', auth.currentUser?.uid), (snap) =>
        setUserData(snap.data() || {})
      );
      return () => unsub();
    }
  }, [user]);

  const email = userData.email || auth.currentUser?.email || '';
  const displayName = userData.username || (email ? email.split('@')[0] : '');
  const photoURL = userData.photoURL || auth.currentUser?.photoURL || '';
  const verified = auth.currentUser?.emailVerified;
  const memberSince = (() => {
    const ts =
      userData.createdAt?.toDate?.() ||
      (auth.currentUser?.metadata?.creationTime
        ? new Date(auth.currentUser.metadata.creationTime)
        : null);
    return ts
      ? ts.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
      : null;
  })();

  const handleChange = (e) =>
    setNewProfile({ ...newProfile, [e.target.name]: e.target.value });

  // --- Avatar upload / removal ---
  const handleAvatarSelect = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file later
    if (!file) return;
    setOverviewMsg(null);
    if (!file.type.startsWith('image/')) {
      setOverviewMsg({ type: 'error', text: 'Please choose an image file.' });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setOverviewMsg({ type: 'error', text: 'Image must be under 2 MB.' });
      return;
    }
    setUploading(true);
    try {
      const uid = auth.currentUser.uid;
      const avatarRef = ref(storage, `avatars/${uid}`);
      await uploadBytes(avatarRef, file);
      const url = await getDownloadURL(avatarRef);
      await updateProfile(auth.currentUser, { photoURL: url });
      await updateDoc(doc(database, 'users', uid), { photoURL: url });
      setOverviewMsg({ type: 'success', text: 'Profile photo updated.' });
    } catch (err) {
      setOverviewMsg({
        type: 'error',
        text:
          err.code === 'storage/unauthorized'
            ? "Photo upload isn't available yet. Please try again later."
            : "Couldn't upload your photo. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    setOverviewMsg(null);
    setUploading(true);
    try {
      const uid = auth.currentUser.uid;
      await deleteObject(ref(storage, `avatars/${uid}`)).catch(() => {}); // ignore if already gone
      await updateProfile(auth.currentUser, { photoURL: '' });
      await updateDoc(doc(database, 'users', uid), { photoURL: '' });
      setOverviewMsg({ type: 'success', text: 'Profile photo removed.' });
    } catch (err) {
      setOverviewMsg({ type: 'error', text: "Couldn't remove your photo. Please try again." });
    } finally {
      setUploading(false);
    }
  };

  const handleResendVerification = async () => {
    setOverviewMsg(null);
    setVerifying(true);
    try {
      await sendEmailVerification(auth.currentUser);
      setOverviewMsg({ type: 'success', text: 'Verification email sent — check your inbox.' });
    } catch (err) {
      setOverviewMsg({ type: 'error', text: friendlyError(err.code) });
    } finally {
      setVerifying(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMessage(null);

    const username = newProfile.newUsername.trim();
    const nextEmail = newProfile.newEmail.trim();
    const { currentPassword, newPassword, confirmPassword } = newProfile;

    const changingUsername = username && username !== userData.username;
    const changingEmail = nextEmail && nextEmail !== email;
    const changingPassword = Boolean(newPassword);

    if (!changingUsername && !changingEmail && !changingPassword) {
      setMessage({ type: 'error', text: 'Nothing to update — change a field first.' });
      return;
    }

    if (changingPassword) {
      if (newPassword.length < 6) {
        setMessage({ type: 'error', text: 'New password should be at least 6 characters.' });
        return;
      }
      if (newPassword !== confirmPassword) {
        setMessage({ type: 'error', text: 'New password and confirmation do not match.' });
        return;
      }
    }

    if ((changingEmail || changingPassword) && !currentPassword) {
      setMessage({
        type: 'error',
        text: 'Please enter your current password to change your email or password.',
      });
      return;
    }

    setSaving(true);
    try {
      const uid = auth.currentUser.uid;

      if (changingEmail || changingPassword) {
        const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
        await reauthenticateWithCredential(auth.currentUser, credential);
      }

      if (changingUsername) {
        await updateProfile(auth.currentUser, { displayName: username });
        await updateDoc(doc(database, 'users', uid), { username });
      }
      if (changingEmail) {
        await updateEmail(auth.currentUser, nextEmail);
        await updateDoc(doc(database, 'users', uid), { email: nextEmail });
      }
      if (changingPassword) {
        await updatePassword(auth.currentUser, newPassword);
      }

      setMessage({ type: 'success', text: 'Your profile has been updated.' });
      setNewProfile({
        newUsername: '',
        newEmail: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setMessage({ type: 'error', text: friendlyError(err.code) });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setDeleteMsg(null);
    if (!deletePassword) {
      setDeleteMsg({ type: 'error', text: 'Enter your password to confirm.' });
      return;
    }
    setDeleting(true);
    try {
      const uid = auth.currentUser.uid;
      const credential = EmailAuthProvider.credential(auth.currentUser.email, deletePassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await deleteObject(ref(storage, `avatars/${uid}`)).catch(() => {});
      await deleteDoc(doc(database, 'users', uid)).catch(() => {});
      await deleteUser(auth.currentUser);
      navigate('/register');
    } catch (err) {
      setDeleteMsg({ type: 'error', text: friendlyError(err.code) });
      setDeleting(false);
    }
  };

  const savedCount = watchlist.length;

  return (
    <div className="profile-page">
      <header className="profile-heading">
        <h2>My Account</h2>
        <p className="profile-subtitle">Manage your account, security and saved titles.</p>
      </header>

      <div className="profile-grid">
        {/* --- Identity rail --- */}
        <aside className="profile-card identity-rail">
          <div className="identity-banner" aria-hidden="true" />

          <div className="avatar-block">
            <button
              type="button"
              className="avatar-edit"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              aria-label={photoURL ? 'Change photo' : 'Add photo'}
            >
              <Avatar name={displayName || email} src={photoURL} size={112} />
              <span className="avatar-cam" aria-hidden="true">
                <FaCamera />
              </span>
            </button>
            <div className="avatar-actions">
              <button
                type="button"
                className="link-btn"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? 'Working…' : photoURL ? 'Change photo' : 'Add photo'}
              </button>
              {photoURL && (
                <button
                  type="button"
                  className="link-btn danger"
                  onClick={handleRemovePhoto}
                  disabled={uploading}
                >
                  Remove
                </button>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleAvatarSelect}
              />
            </div>
          </div>

          <div className="identity-meta">
            <h3>{displayName}</h3>
            <p className="overview-email">
              {email}
              {verified ? (
                <span className="verified-badge">✓ Verified</span>
              ) : (
                <span className="unverified-badge">Unverified</span>
              )}
            </p>
            {!verified && (
              <button
                type="button"
                className="link-btn"
                onClick={handleResendVerification}
                disabled={verifying}
              >
                {verifying ? 'Sending…' : 'Resend verification email'}
              </button>
            )}
            {memberSince && <p className="overview-member">Member since {memberSince}</p>}
          </div>

          <div className="profile-stats">
            <div className="stat-chip">
              <span className="stat-num">{savedCount}</span>
              <span className="stat-label">Saved</span>
            </div>
            <div className="stat-chip">
              <span className="stat-num">{stats.watched}</span>
              <span className="stat-label">Watched</span>
            </div>
            <div className="stat-chip">
              <span className="stat-num">{stats.inProgress}</span>
              <span className="stat-label">In progress</span>
            </div>
          </div>

          {overviewMsg && (
            <div className={`profile-message ${overviewMsg.type}`} role="status">
              {overviewMsg.text}
            </div>
          )}
        </aside>

        {/* --- Settings column --- */}
        <div className="profile-settings">
          <form onSubmit={handleProfileUpdate}>
            {message && (
              <div className={`profile-message ${message.type}`} role="status">
                {message.text}
              </div>
            )}

            <section className="profile-card">
              <h3 className="section-title">Profile</h3>

              <div className="form-group-profile">
                <label htmlFor="username">
                  Username
                  {userData.username && (
                    <span className="current-value">Current: {userData.username}</span>
                  )}
                </label>
                <input
                  type="text"
                  className="form-input"
                  name="newUsername"
                  id="username"
                  placeholder="New username"
                  value={newProfile.newUsername}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group-profile">
                <label htmlFor="email">
                  Email
                  {email && <span className="current-value">Current: {email}</span>}
                </label>
                <input
                  type="email"
                  className="form-input"
                  name="newEmail"
                  id="email"
                  placeholder="New email"
                  value={newProfile.newEmail}
                  onChange={handleChange}
                />
              </div>
            </section>

            <section className="profile-card">
              <h3 className="section-title">Security</h3>

              <div className="form-group-profile">
                <label htmlFor="currentPassword">
                  Current Password
                  <span className="current-value">Required to change email or password</span>
                </label>
                <input
                  type="password"
                  className="form-input"
                  name="currentPassword"
                  id="currentPassword"
                  placeholder="Current password"
                  autoComplete="current-password"
                  value={newProfile.currentPassword}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group-profile">
                <label htmlFor="password">New Password</label>
                <input
                  type="password"
                  className="form-input"
                  name="newPassword"
                  id="password"
                  placeholder="New password"
                  autoComplete="new-password"
                  value={newProfile.newPassword}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group-profile">
                <label htmlFor="passwordConfirmation">Password Confirmation</label>
                <input
                  type="password"
                  className="form-input"
                  name="confirmPassword"
                  id="passwordConfirmation"
                  placeholder="Repeat new password"
                  autoComplete="new-password"
                  value={newProfile.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              <div className="save-button">
                <button className="saveBtn" type="submit" disabled={saving}>
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </section>
          </form>

          {/* --- Watchlist --- */}
          <section className="profile-card">
            <div className="watchlist-summary-head">
              <h3 className="section-title">My Watchlist</h3>
              {savedCount > 0 && (
                <Link to="/watchlist" className="link-btn">
                  View all
                </Link>
              )}
            </div>
            {savedCount === 0 ? (
              <p className="watchlist-empty">
                Your watchlist is empty. Tap the heart on any title to save it here.
              </p>
            ) : (
              <>
                <p className="watchlist-count">
                  {savedCount} {savedCount === 1 ? 'title' : 'titles'} saved
                </p>
                <div className="watchlist-thumbs">
                  {watchlist.slice(0, 6).map((item) => (
                    <Link
                      key={`${item.media_type}-${item.id}`}
                      to={detailPath(item)}
                      className="watchlist-thumb"
                      title={item.title || item.name}
                    >
                      <img
                        src={imageUrl(item.poster_path, 'w185')}
                        alt={item.title || item.name}
                      />
                    </Link>
                  ))}
                </div>
              </>
            )}
          </section>

          {/* --- Danger zone --- */}
          <section className="profile-card danger-zone">
            <h3 className="section-title">Danger Zone</h3>
            <p className="danger-desc">
              Permanently delete your account, watchlist and profile. This cannot be undone.
            </p>
            {!showDelete ? (
              <button type="button" className="danger-btn" onClick={() => setShowDelete(true)}>
                Delete my account
              </button>
            ) : (
              <form className="delete-form" onSubmit={handleDeleteAccount}>
                {deleteMsg && (
                  <div className={`profile-message ${deleteMsg.type}`} role="status">
                    {deleteMsg.text}
                  </div>
                )}
                <label htmlFor="deletePassword">Enter your password to confirm</label>
                <input
                  id="deletePassword"
                  type="password"
                  className="form-input"
                  autoComplete="current-password"
                  placeholder="Your password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                />
                <div className="delete-actions">
                  <button
                    type="button"
                    className="link-btn"
                    onClick={() => {
                      setShowDelete(false);
                      setDeletePassword('');
                      setDeleteMsg(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="danger-btn" disabled={deleting}>
                    {deleting ? 'Deleting…' : 'Permanently delete'}
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
