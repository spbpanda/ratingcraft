import { statusBedrock } from "minecraft-server-util";
import { BEDROCK_DEFAULT_PORT, JAVA_DEFAULT_PORT } from "../consts/ports";

const { status } = require('minecraft-server-util');

/**
 * Получает информацию о Minecraft сервере.
 * @param {string} host - Адрес сервера (IP или домен).
 * @param {number} port - Порт сервера (по умолчанию 25565).
 * @returns {Promise<Object>} - Информация о сервере.
 */
export default async function getMinecraftServerStatus(host: string, port?: number) {
    try {
        const response = await status(host, port ?? JAVA_DEFAULT_PORT) ?? await statusBedrock(host, port ?? BEDROCK_DEFAULT_PORT);
        return {
            online: true,
            host: host,
            port: port,
            version: {
                name: response.version.name,
                protocol: response.version.protocol,
            },
            players: {
                online: response.players.online,
                max: response.players.max,
            },
            description: response.motd.clean,
            ping: response.roundTripLatency,
        };
    } catch (error: any) {
        return {
            online: false,
            host: host,
            port: port,
            error: error.message
        };
    }
}