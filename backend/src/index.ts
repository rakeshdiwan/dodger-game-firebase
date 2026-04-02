import { onRequest } from 'firebase-functions/v2/https';
import app from './app';

// Cloud Function entrypoint for Firebase deploy.
export const api = onRequest({ region: 'us-central1' }, app);
