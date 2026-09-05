import * as migration_20260905_141652_init from './20260905_141652_init';

export const migrations = [
  {
    up: migration_20260905_141652_init.up,
    down: migration_20260905_141652_init.down,
    name: '20260905_141652_init'
  },
];
