import * as migration_20260508_073200 from './20260508_073200';
import * as migration_20260508_100635 from './20260508_100635';

export const migrations = [
  {
    up: migration_20260508_073200.up,
    down: migration_20260508_073200.down,
    name: '20260508_073200',
  },
  {
    up: migration_20260508_100635.up,
    down: migration_20260508_100635.down,
    name: '20260508_100635'
  },
];
