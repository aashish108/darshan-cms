const db = require('./helpers/db');

before(async () => {
  await db.setup();
});

after(() => {
  db.after();
});
