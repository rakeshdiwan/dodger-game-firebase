import { Router } from 'express';
import type { Timestamp } from 'firebase-admin/firestore';
import { db, SESSIONS_COLLECTION, USERS_COLLECTION } from '../lib/firebase';

const router = Router();

router.get('/history/:userId', async (req, res, next) => {
  try {
    const sessionsSnap = await db
      .collection(SESSIONS_COLLECTION)
      .where('userId', '==', req.params.userId)
      .orderBy('createdAt', 'desc')
      .get();

    const sessions = sessionsSnap.docs.map((doc) => {
      const data = doc.data();
      return {
        _id: doc.id,
        score: data.score,
        duration: data.duration,
        createdAt: (data.createdAt as Timestamp).toDate().toISOString(),
      };
    });

    res.json({ success: true, data: sessions });
  } catch (error) {
    next(error);
  }
});

router.get('/highest/:userId', async (req, res, next) => {
  try {
    const userDoc = await db.collection(USERS_COLLECTION).doc(req.params.userId).get();
    if (!userDoc.exists) {
      res.json({ success: true, data: { highestScore: 0 } });
      return;
    }

    const highestScore = typeof userDoc.data()?.highestScore === 'number' ? userDoc.data()?.highestScore : 0;
    res.json({ success: true, data: { highestScore } });
  } catch (error) {
    next(error);
  }
});

router.get('/leaderboard', async (_req, res, next) => {
  try {
    const usersSnap = await db.collection(USERS_COLLECTION).orderBy('highestScore', 'desc').limit(20).get();

    const leaderboard = usersSnap.docs
      .map((doc) => {
        const data = doc.data();
        return {
          userId: doc.id,
          name: data.name,
          score: typeof data.highestScore === 'number' ? data.highestScore : 0,
        };
      })
      .filter((item) => item.score > 0);

    res.json({ success: true, data: leaderboard });
  } catch (error) {
    next(error);
  }
});

export default router;
