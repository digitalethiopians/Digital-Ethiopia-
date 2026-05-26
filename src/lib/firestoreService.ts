import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  onSnapshot,
  deleteDoc 
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { Course, SAMPLE_COURSES } from '../constants';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const syncUser = async (user: any) => {
  if (!user) return;
  const userRef = doc(db, 'users', user.uid);
  try {
    const isMaster = user.uid === "d0W2QF71NcXSCeF3qQxuVrRFqqx1" || user.email === "digitaloromiya@gmail.com";
    console.log('[Auth] Syncing user:', user.uid, 'isMaster:', isMaster);
    
    // Sync basic user info
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      role: isMaster ? 'admin' : 'student',
      lastLogin: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true });

    // If master admin, ensures they exist in the admins collection too
    if (isMaster) {
      try {
        const adminRef = doc(db, 'admins', user.uid);
        await setDoc(adminRef, {
          email: user.email,
          uid: user.uid,
          updatedAt: serverTimestamp(),
          assignedAt: serverTimestamp(),
          assignedBy: 'system-init'
        }, { merge: true });
        console.log('[Auth] Master admin record ensured');
      } catch (adminError) {
        console.warn('[Auth] Admin record sync skipped:', adminError);
      }
    }
  } catch (error) {
    console.error('[Auth] Error syncing user:', error);
    // Don't throw for permission errors during sync as it might be a race condition
    if (error instanceof Error && error.message.includes('permission')) {
       console.warn('[Auth] Permission denied during sync - this is expected on first login');
    } else {
       handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
    }
  }
};

export const getCourses = async () => {
  const coursesRef = collection(db, 'courses');
  try {
    const snapshot = await getDocs(coursesRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'courses');
  }
};

export const getEnrollments = (userId: string, callback: (enrollments: any[]) => void) => {
  const q = query(collection(db, 'enrollments'), where('userId', '==', userId));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, 'enrollments');
  });
};

export const seedCourses = async () => {
  try {
    console.log('[Seed] Checking for missing courses...');
    let addedCount = 0;
    for (const course of SAMPLE_COURSES) {
      const courseRef = doc(db, 'courses', course.id);
      const snap = await getDoc(courseRef);
      if (!snap.exists()) {
        const { id, ...data } = course;
        await setDoc(courseRef, { ...data, id });
        addedCount++;
        console.log(`[Seed] Added missing course: ${course.title}`);
      }
    }
    if (addedCount > 0) {
      console.log(`[Seed] Seeding completed. Added ${addedCount} new courses.`);
    } else {
      console.log('[Seed] No missing courses found.');
    }
  } catch (error) {
    console.error('[Seed] Error during seeding:', error);
  }
};

export const checkAdminStatus = async (user: any) => {
  if (!user) return false;
  
  const userId = user.uid;
  const userEmail = user.email;
  
  // Quick check for the master admin UID or Email
  const isMaster = userId === "d0W2QF71NcXSCeF3qQxuVrRFqqx1" || userEmail === "digitaloromiya@gmail.com";
  console.log('[Auth] Checking admin status for:', userId, 'isMaster:', isMaster);
  
  if (isMaster) return true;

  try {
    const adminRef = doc(db, 'admins', userId);
    const docSnap = await getDoc(adminRef);
    if (docSnap.exists()) return true;
    
    // Fallback: check users collection
    const userSnap = await getDoc(doc(db, 'users', userId));
    return userSnap.exists() && userSnap.data().role === 'admin';
  } catch (error) {
    console.warn('[Auth] Permission issue checking admin status:', error);
    return false;
  }
};

export const getAllEnrollments = async () => {
  const enrollmentsRef = collection(db, 'enrollments');
  try {
    const snapshot = await getDocs(enrollmentsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'enrollments');
  }
};

export const saveCourse = async (course: Partial<Course> & { id?: string }) => {
  const isNew = !course.id;
  const courseId = course.id || doc(collection(db, 'courses')).id;
  const courseRef = doc(db, 'courses', courseId);
  
  try {
    await setDoc(courseRef, {
      ...course,
      id: courseId,
      updatedAt: serverTimestamp(),
      createdAt: isNew ? serverTimestamp() : undefined
    }, { merge: true });
    return courseId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `courses/${courseId}`);
  }
};

export const deleteCourse = async (courseId: string) => {
  const courseRef = doc(db, 'courses', courseId);
  try {
    await deleteDoc(courseRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `courses/${courseId}`);
  }
};

export const getAllUsers = async () => {
  const usersRef = collection(db, 'users');
  try {
    const snapshot = await getDocs(usersRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'users');
  }
};

export const enrollInCourse = async (userId: string, courseId: string) => {
  const enrollmentId = `${userId}_${courseId}`;
  const enrollmentRef = doc(db, 'enrollments', enrollmentId);
  try {
    await setDoc(enrollmentRef, {
      userId,
      courseId,
      enrolledAt: serverTimestamp(),
      status: 'active',
      progress: 0
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `enrollments/${enrollmentId}`);
  }
};

export const updateEnrollmentProgress = async (userId: string, courseId: string, progress: number, completedLessons?: string[]) => {
  const enrollmentId = `${userId}_${courseId}`;
  const enrollmentRef = doc(db, 'enrollments', enrollmentId);
  try {
    const finalProgress = Math.min(100, progress);
    await setDoc(enrollmentRef, {
      progress: finalProgress,
      status: finalProgress === 100 ? 'completed' : 'active',
      completedLessons: completedLessons || undefined,
      updatedAt: serverTimestamp()
    }, { merge: true });

    if (finalProgress === 100) {
      await awardCertificate(userId, courseId);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `enrollments/${enrollmentId}`);
  }
};

export const getEnrollment = (userId: string, courseId: string, callback: (enrollment: any) => void) => {
  const enrollmentId = `${userId}_${courseId}`;
  const enrollmentRef = doc(db, 'enrollments', enrollmentId);
  return onSnapshot(enrollmentRef, (snapshot) => {
    if (snapshot.exists()) {
      callback({ id: snapshot.id, ...snapshot.data() });
    } else {
      callback(null);
    }
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, `enrollments/${enrollmentId}`);
  });
};

export const getCertificates = (userId: string, callback: (certs: any[]) => void) => {
  const q = query(collection(db, 'certificates'), where('userId', '==', userId));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, 'certificates');
  });
};

export const awardCertificate = async (userId: string, courseId: string) => {
  const certId = `cert_${userId}_${courseId}`;
  const certRef = doc(db, 'certificates', certId);
  
  try {
    const certSnap = await getDoc(certRef);
    if (certSnap.exists()) return; // Already awarded

    // Get user and course info for the certificate
    const [userSnap, courseSnap] = await Promise.all([
      getDoc(doc(db, 'users', userId)),
      getDoc(doc(db, 'courses', courseId))
    ]);

    const userData = userSnap.data();
    const courseData = courseSnap.data();

    await setDoc(certRef, {
      userId,
      courseId,
      certificateId: certId,
      userName: userData?.displayName || 'Student',
      courseTitle: courseData?.title || 'Digital Course',
      issuedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `certificates/${certId}`);
  }
};

export const verifyCertificate = async (certificateId: string) => {
  const certRef = doc(db, 'certificates', certificateId);
  try {
    const docSnap = await getDoc(certRef);
    if (docSnap.exists()) {
      return { valid: true, data: docSnap.data() };
    }
    return { valid: false };
  } catch (error) {
    // For verification, we don't necessarily want to throw a hard error that breaks the UI
    console.error('Verification error:', error);
    return { valid: false };
  }
};

export const getGovernmentRecords = async () => {
  const q = query(collection(db, 'government_records'), orderBy('updatedAt', 'desc'));
  try {
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'government_records');
    return [];
  }
};

export const saveGovernmentRecord = async (record: any) => {
  const recordId = record.id || `gov_${Date.now()}`;
  const recordRef = doc(db, 'government_records', recordId);
  const data = {
    ...record,
    updatedAt: serverTimestamp(),
  };
  delete data.id;

  try {
    await setDoc(recordRef, data, { merge: true });
    return recordId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `government_records/${recordId}`);
  }
};

export const submitForm = async (formType: string, formData: any) => {
  const formId = `${formType}_${Date.now()}_${auth.currentUser?.uid || 'anon'}`;
  const formRef = doc(db, 'submissions', formId);
  try {
    await setDoc(formRef, {
      ...formData,
      formType,
      userId: auth.currentUser?.uid || null,
      submittedAt: serverTimestamp(),
    });
    return formId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `submissions/${formId}`);
  }
};

export const submitAssignment = async (assignment: any) => {
  const assignmentId = `assignment_${Date.now()}_${auth.currentUser?.uid}`;
  const assignmentRef = doc(db, 'assignments', assignmentId);
  try {
    await setDoc(assignmentRef, {
      ...assignment,
      userId: auth.currentUser?.uid,
      submittedAt: serverTimestamp(),
      status: 'submitted'
    });
    return assignmentId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `assignments/${assignmentId}`);
  }
};

export const getAssignments = (userId: string, callback: (assignments: any[]) => void) => {
  const q = query(collection(db, 'assignments'), where('userId', '==', userId));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, 'assignments');
  });
};
