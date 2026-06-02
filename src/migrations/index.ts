import * as migration_20260508_073200 from './20260508_073200';
import * as migration_20260508_100635 from './20260508_100635';
import * as migration_20260508_115436 from './20260508_115436';
import * as migration_20260514_100031 from './20260514_100031';
import * as migration_20260514_add_case_studies_cta_link_video from './20260514_add_case_studies_cta_link_video';
import * as migration_20260514_add_logo_links from './20260514_add_logo_links';
import * as migration_20260515_063736 from './20260515_063736';
import * as migration_20260515_case_studies_result_richtext from './20260515_case_studies_result_richtext';
import * as migration_20260520_072301 from './20260520_072301';
import * as migration_20260520_logo_wall_active from './20260520_logo_wall_active';
import * as migration_20260601_071007 from './20260601_071007';
import * as migration_20260601_074513 from './20260601_074513';
import * as migration_20260602_074925 from './20260602_074925';
import * as migration_20260602_enquiry_settings_global from './20260602_enquiry_settings_global';

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
    name: '20260515_063736',
  },
  {
    up: migration_20260515_case_studies_result_richtext.up,
    down: migration_20260515_case_studies_result_richtext.down,
    name: '20260515_case_studies_result_richtext',
  },
  {
    up: migration_20260520_072301.up,
    down: migration_20260520_072301.down,
    name: '20260520_072301',
  },
  {
    up: migration_20260520_logo_wall_active.up,
    down: migration_20260520_logo_wall_active.down,
    name: '20260520_logo_wall_active',
  },
  {
    up: migration_20260601_071007.up,
    down: migration_20260601_071007.down,
    name: '20260601_071007',
  },
  {
    up: migration_20260601_074513.up,
    down: migration_20260601_074513.down,
    name: '20260601_074513',
  },
  {
    up: migration_20260602_074925.up,
    down: migration_20260602_074925.down,
    name: '20260602_074925'
  },
  {
    up: migration_20260602_enquiry_settings_global.up,
    down: migration_20260602_enquiry_settings_global.down,
    name: '20260602_enquiry_settings_global',
  },
];
