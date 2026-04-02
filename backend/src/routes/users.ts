import { Router } from 'express';
import { Timestamp } from 'firebase-admin/firestore';
import { z } from 'zod';
import { validateBody } from '../middleware/validate';
import { db, SESSIONS_COLLECTION, USERS_COLLECTION } from '../lib/firebase';

const router = Router();

const loginSchema = z.object({
  name: z.string().trim().min(2).max(20),
});

const logoutSchema = z.object({
  userId: z.string().min(1),
});

router.post('/login', validateBody(loginSchema), async (req, res, next) => {
  try {
    const { name } = req.body as z.infer<typeof loginSchema>;
    const usersRef = db.collection(USERS_COLLECTION);

    const existingUserSnap = await usersRef.where('name', '==', name).limit(1).get();

    let userId: string;
    let createdAt: string;
    let lastPlayedAt: string | undefined;
    let bestScore = 0;

    if (existingUserSnap.empty) {
      const now = Timestamp.now();
      const userDocRef = usersRef.doc();
      await userDocRef.set({
        name,
        createdAt: now,
        lastPlayedAt: null,
        highestScore: 0,
      });
      userId = userDocRef.id;
      createdAt = now.toDate().toISOString();
    } else {
      const userDoc = existingUserSnap.docs[0];
      const data = userDoc.data();
      userId = userDoc.id;
      createdAt = (data.createdAt as Timestamp).toDate().toISOString();
      lastPlayedAt = data.lastPlayedAt ? (data.lastPlayedAt as Timestamp).toDate().toISOString() : undefined;
      bestScore = typeof data.highestScore === 'number' ? data.highestScore : 0;

      if (!bestScore) {
        const bestSession = await db
          .collection(SESSIONS_COLLECTION)
          .where('userId', '==', userId)
          .orderBy('score', 'desc')
          .limit(1)
          .get();
        if (!bestSession.empty) {
          bestScore = bestSession.docs[0].data().score ?? 0;
        }
      }
    }

    res.json({
      success: true,
      data: {
        user: {
          id: userId,
          name,
          createdAt,
          lastPlayedAt,
        },
        bestScore,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post('/logout', validateBody(logoutSchema), async (req, res, next) => {
  try {
    const { userId } = req.body as z.infer<typeof logoutSchema>;
    await db.collection(USERS_COLLECTION).doc(userId).set({ lastPlayedAt: Timestamp.now() }, { merge: true });
    res.json({ success: true, data: { loggedOut: true } });
  } catch (error) {
    next(error);
  }
});

export default router;
