// サーバーサイドでのみ実行
if (typeof window === 'undefined') {
  import('./lib/jetstream/subscription')
    .then(({ jetstream }) => {
      console.log('Starting Jetstream subscription...');
      try {
        // start() は void を返す可能性があるため、Promise.resolve でラップ
        return Promise.resolve(jetstream.start())
          .catch((error: unknown) => {
            console.error('Failed to start Jetstream:', error);
          });
      } catch (error) {
        console.error('Error starting Jetstream:', error);
        return Promise.resolve();
      }
    })
    .catch((error: unknown) => {
      console.error('Failed to load Jetstream module:', error);
    });
}
