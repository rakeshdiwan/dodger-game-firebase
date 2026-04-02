import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { Timestamp } from 'firebase-admin/firestore';
import { z } from 'zod';
import { validateBody } from '../middleware/validate';
import { ApiError } from '../middleware/errorHandler';
import { db, SESSIONS_COLLECTION, USERS_COLLECTION } from '../lib/firebase';

const router = Router();

const startSchema = z.object({ userId: z.string().min(1) });
const endSchema = z.object({
  userId: z.string().min(1),
  score: z.number().int().min(0),
  duration: z.number().min(0),
});

router.post('/start', validateBody(startSchema), async (req, res, next) => {
  try {
    const { userId } = req.body as z.infer<typeof startSchema>;
    const userDoc = await db.collection(USERS_COLLECTION).doc(userId).get();

    if (!userDoc.exists) {
      throw new ApiError(404, 'User not found');
    }

    res.json({ success: true, data: { sessionId: randomUUID(), startedAt: new Date().toISOString() } });
  } catch (error) {
    next(error);
  }
});

router.post('/end', validateBody(endSchema), async (req, res, next) => {
  try {
    const { userId, score, duration } = req.body as z.infer<typeof endSchema>;
    const userRef = db.collection(USERS_COLLECTION).doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new ApiError(404, 'User not found');
    }

    const createdAt = Timestamp.now();
    const sessionRef = db.collection(SESSIONS_COLLECTION).doc();
    await sessionRef.set({ userId, score, duration, createdAt });

    const userData = userDoc.data();
    const highestScore = typeof userData?.highestScore === 'number' ? userData.highestScore : 0;
    await userRef.set(
      {
        lastPlayedAt: createdAt,
        highestScore: Math.max(highestScore, score),
      },
      { merge: true },
    );

    res.status(201).json({
      success: true,
      data: {
        _id: sessionRef.id,
        userId,
        score,
        duration,
        createdAt: createdAt.toDate().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
