import { statusBedrock, status } from "minecraft-server-util";
import { BEDROCK_DEFAULT_PORT, JAVA_DEFAULT_PORT } from "../consts/ports";

/**
 * Получает информацию о Minecraft сервере.
 * @param {string} host - Адрес сервера (IP или домен).
 * @param {number} port - Порт сервера (по умолчанию 25565).
 * @returns {Promise<Object>} - Информация о сервере.
 */
export default async function getMinecraftServerStatus(host: string, port?: number) {
    if (!host || typeof host !== 'string' || host.trim() === '') {
        throw new Error('Некорректный адрес сервера (host)');
    }
    const safePort = (typeof port === 'number' && port > 0) ? port : JAVA_DEFAULT_PORT;

    try {
        const response = await status(host, safePort) 
            ?? await statusBedrock(host, port ?? BEDROCK_DEFAULT_PORT);

        return {
            online: true,
            host: response.srvRecord?.host ?? host,
            port: response.srvRecord?.port ?? safePort,
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
            host,
            port: safePort,
            error: error.message,
        };
    }
}