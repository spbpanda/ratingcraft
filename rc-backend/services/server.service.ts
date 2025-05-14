// import { Server } from '../interfaces/server.interface';
// import { randomUUID } from 'crypto';
// import fs from 'fs';
// import { getMinecraftServerStatus } from '../minecraft-server-util/minecraft-server-util';
// import { JAVA_DEFAULT_PORT, BEDROCK_DEFAULT_PORT } from '../consts/ports';
// import { pingJava } from '../mineping/java';
// import { pingBedrock } from '../mineping/bedrock';

// export async function addNewServer(data: any, userId: string): Promise<Server> {
//   // вся логика создания сервера
// }

// export async function getServerInfo(address: string, port?: number) {
//   return await getMinecraftServerStatus(address, port) ??
//          await pingJava(address, { port }) ??
//          await pingBedrock(address, { port });
// }