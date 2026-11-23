#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/a3b258464fbec7990baf8c55ef7864b4663cf278ac29e964da7260964ef8abea/contract';
import startContract from '../../snapshots/a3b258464fbec7990baf8c55ef7864b4663cf278ac29e964da7260964ef8abea/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/f406e2ea6dfb8debc580a339c44ed8c035226311d27cb7b9c10ceb9bd0ae74d7/contract';
import endContract from '../../snapshots/f406e2ea6dfb8debc580a339c44ed8c035226311d27cb7b9c10ceb9bd0ae74d7/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, placeholder } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropColumn({ schema: 'public', table: 'User', column: 'firstName' }),
      this.dropColumn({ schema: 'public', table: 'User', column: 'lastName' }),
      this.dropColumn({ schema: 'public', table: 'User', column: 'passwordHash' }),
      this.addColumn({
        schema: 'public',
        table: 'User',
        column: col('name', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.dataTransform(endContract, 'backfill-User-name', {
        check: () => placeholder('backfill-User-name:check'),
        run: () => placeholder('backfill-User-name:run'),
      }),
      this.setNotNull({ schema: 'public', table: 'User', column: 'name' }),
      this.addColumn({
        schema: 'public',
        table: 'User',
        column: col('password', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.dataTransform(endContract, 'backfill-User-password', {
        check: () => placeholder('backfill-User-password:check'),
        run: () => placeholder('backfill-User-password:run'),
      }),
      this.setNotNull({ schema: 'public', table: 'User', column: 'password' }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
