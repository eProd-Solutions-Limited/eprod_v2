import * as migration_20260508_073200 from './20260508_073200';
import * as migration_20260508_115436 from './20260508_115436';

export const migrations = [
  {
    up: migration_20260508_073200.up,
    down: migration_20260508_073200.down,
    name: '20260508_073200',
  },
  {
    up: migration_20260508_115436.up,
    down: migration_20260508_115436.down,
    name: '20260508_115436'
  },
];
