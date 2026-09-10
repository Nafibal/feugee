import * as migration_20260905_141652_init from './20260905_141652_init';
import * as migration_20260910_135501_add_works_and_sectors from './20260910_135501_add_works_and_sectors';

export const migrations = [
  {
    up: migration_20260905_141652_init.up,
    down: migration_20260905_141652_init.down,
    name: '20260905_141652_init',
  },
  {
    up: migration_20260910_135501_add_works_and_sectors.up,
    down: migration_20260910_135501_add_works_and_sectors.down,
    name: '20260910_135501_add_works_and_sectors'
  },
];
