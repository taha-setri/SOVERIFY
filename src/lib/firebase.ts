import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { AuditReport, DpoSecurityAlert } from '../types';

// Initialize Firebase App safely
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Cloud Firestore using the configured database ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

// Helper: Sign in with Google Popup
export const signInWithGoogle = async (): Promise<User | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
};

// Helper: Sign Out
export const logoutFirebase = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Firebase Sign-Out Error:', error);
    throw error;
  }
};

// Helper: Save Audit Report to Cloud Firestore
export const saveReportToFirestore = async (userId: string, report: AuditReport): Promise<string> => {
  try {
    const reportRef = doc(collection(db, 'auditReports'));
    const reportData = {
      ...report,
      id: report.id || reportRef.id,
      userId,
      createdAt: serverTimestamp(),
      savedAt: new Date().toISOString()
    };
    await setDoc(reportRef, reportData);
    return reportRef.id;
  } catch (error) {
    console.error('Failed to save audit report to Firestore:', error);
    throw error;
  }
};

// Helper: Fetch User Audit Reports from Firestore
export const fetchUserReportsFromFirestore = async (userId: string): Promise<AuditReport[]> => {
  try {
    const q = query(
      collection(db, 'auditReports'),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    const reports: AuditReport[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data() as AuditReport;
      reports.push({
        ...data,
        id: docSnap.id
      });
    });
    // Sort descending by timestamp
    return reports.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (error) {
    console.error('Failed to fetch user reports from Firestore:', error);
    return [];
  }
};

// Helper: Real-time listener for user reports
export const subscribeToUserReports = (
  userId: string, 
  callback: (reports: AuditReport[]) => void
) => {
  const q = query(
    collection(db, 'auditReports'),
    where('userId', '==', userId)
  );

  return onSnapshot(q, (snapshot) => {
    const reports: AuditReport[] = [];
    snapshot.forEach((docSnap) => {
      reports.push({
        ...(docSnap.data() as AuditReport),
        id: docSnap.id
      });
    });
    reports.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    callback(reports);
  }, (err) => {
    console.error('Firestore listener error:', err);
  });
};

// Helper: Delete report from Firestore
export const deleteReportFromFirestore = async (reportId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'auditReports', reportId));
  } catch (error) {
    console.error('Failed to delete report from Firestore:', error);
    throw error;
  }
};

// Helper: Save DPO Security Alert to Firestore
export const saveDpoAlertToFirestore = async (
  userId: string,
  alert: DpoSecurityAlert
): Promise<void> => {
  try {
    await setDoc(doc(db, 'dpoAlerts', alert.id), {
      ...alert,
      userId,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Failed to save DPO alert to Firestore:', error);
    throw error;
  }
};

// Helper: Real-time listener for DPO alerts
export const subscribeToUserAlerts = (
  userId: string,
  callback: (alerts: DpoSecurityAlert[]) => void
) => {
  const q = query(
    collection(db, 'dpoAlerts'),
    where('userId', '==', userId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const alerts: DpoSecurityAlert[] = [];
      snapshot.forEach((docSnap) => {
        alerts.push({
          ...(docSnap.data() as DpoSecurityAlert),
          id: docSnap.id
        });
      });
      alerts.sort(
        (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
      );
      callback(alerts);
    },
    (err) => {
      console.error('Firestore alerts listener error:', err);
    }
  );
};
