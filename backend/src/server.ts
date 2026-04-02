import app from './app';
import { env } from './config/env';
import './lib/firebase';

const bootstrap = async (): Promise<void> => {
  app.listen(env.PORT, () => {
    console.log(`Backend listening on port ${env.PORT}`);
  });
};

bootstrap().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});
