import * as migration_20260905_141652_init from './20260905_141652_init';
import * as migration_20260910_135501_add_works_and_sectors from './20260910_135501_add_works_and_sectors';
import * as migration_20260910_145544_add_assets_and_work_sections from './20260910_145544_add_assets_and_work_sections';

export const migrations = [
  {
    up: migration_20260905_141652_init.up,
    down: migration_20260905_141652_init.down,
    name: '20260905_141652_init',
  },
  {
    up: migration_20260910_135501_add_works_and_sectors.up,
    down: migration_20260910_135501_add_works_and_sectors.down,
    name: '20260910_135501_add_works_and_sectors',
  },
  {
    up: migration_20260910_145544_add_assets_and_work_sections.up,
    down: migration_20260910_145544_add_assets_and_work_sections.down,
    name: '20260910_145544_add_assets_and_work_sections'
  },
];
