import type { CommandName } from './commands';
import { deleteAllTableData } from '../lib/db/queries/reset';

export async function handlerDeleteAllUsers(_: CommandName) {
    await deleteAllTableData();
    console.log("NOTICE: all tables were reset successfully.");
}