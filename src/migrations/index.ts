import * as migration_20260508_073200 from './20260508_073200';
import * as migration_20260508_100635 from './20260508_100635';
import * as migration_20260514_add_logo_links from './20260514_add_logo_links';
import * as migration_20260514_add_case_studies_cta from './20260514_add_case_studies_cta';

export const migrations = [
  {
    up: migration_20260508_073200.up,
    down: migration_20260508_073200.down,
    name: '20260508_073200',
  },
  {
    up: migration_20260508_100635.up,
    down: migration_20260508_100635.down,
    name: '20260508_100635',
  },
  {
    up: migration_20260514_add_logo_links.up,
    down: migration_20260514_add_logo_links.down,
    name: '20260514_add_logo_links',
  },
  {
    up: migration_20260514_add_case_studies_cta.up,
    down: migration_20260514_add_case_studies_cta.down,
    name: '20260514_add_case_studies_cta',
  },
];
