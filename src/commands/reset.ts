import type { CommandName } from './commands';
import { deleteAllTableData } from '../lib/db/queries/reset';

export async function handlerDeleteAllTableRows(_: CommandName) {
    await deleteAllTableData();
    console.log("NOTICE: all tables were reset successfully.");
}