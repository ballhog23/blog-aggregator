export type CommandName = 'login' | 'register' | 'reset';
type CommandHandler = (cmdName: CommandName, ...args: string[]) => Promise<void>;
export type CommandsRegistry = Partial<Record<CommandName, CommandHandler>>;

export function registerCommand(registry: CommandsRegistry, cmdName: CommandName, handler: CommandHandler) {
    registry[cmdName] = handler;
}

export async function runCommand(registry: CommandsRegistry, cmdName: CommandName, ...args: string[]) {
    const handler = registry[cmdName];
    if (!handler) throw new Error(`Unknown Command: ${cmdName}`);
    await handler(cmdName, ...args);
}