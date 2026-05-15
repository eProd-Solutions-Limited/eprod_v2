import * as migration_20260508_073200 from './20260508_073200';
import * as migration_20260508_100635 from './20260508_100635';
import * as migration_20260508_115436 from './20260508_115436';
import * as migration_20260514_100031 from './20260514_100031';
import * as migration_20260514_add_case_studies_cta_link_video from './20260514_add_case_studies_cta_link_video';
import * as migration_20260514_add_logo_links from './20260514_add_logo_links';
import * as migration_20260515_063736 from './20260515_063736';

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
    up: migration_20260508_115436.up,
    down: migration_20260508_115436.down,
    name: '20260508_115436',
  },
  {
    up: migration_20260514_100031.up,
    down: migration_20260514_100031.down,
    name: '20260514_100031',
  },
  {
    up: migration_20260514_add_case_studies_cta_link_video.up,
    down: migration_20260514_add_case_studies_cta_link_video.down,
    name: '20260514_add_case_studies_cta_link_video',
  },
  {
    up: migration_20260514_add_logo_links.up,
    down: migration_20260514_add_logo_links.down,
    name: '20260514_add_logo_links',
  },
  {
    up: migration_20260515_063736.up,
    down: migration_20260515_063736.down,
    name: '20260515_063736'
  },
];
