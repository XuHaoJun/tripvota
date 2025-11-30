import { PgSimplifyInflectionPreset } from '@graphile/simplify-inflection';
import { postgisPlugin } from '@xuhaojun/graphile-postgis';
import { PostGraphileConnectionFilterPreset } from 'postgraphile-plugin-connection-filter';
import { makePgService } from 'postgraphile/@dataplan/pg/adaptors/pg';
import { PostGraphileAmberPreset } from 'postgraphile/presets/amber';

const preset: GraphileConfig.Preset = {
  extends: [PostGraphileAmberPreset, PgSimplifyInflectionPreset, PostGraphileConnectionFilterPreset, postgisPlugin],
  pgServices: [
    makePgService({
      connectionString: process.env.DATABASE_URL || 'postgres://postgres:test@localhost:5432/tripvota',
      schemas: ['public'],
      pubsub: true,
    }),
  ],
  grafast: {
    explain: true,
  },
  grafserv: {
    websockets: true,
  },
  schema: {
    pgJwtSecret: 'example-secret-key-change-in-production',
    connectionFilterAllowEmptyObjectInput: true,
    connectionFilterAllowNullInput: true,
  },
};

export default preset;
