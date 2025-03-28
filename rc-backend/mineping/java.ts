import net from "node:net";
import varint from "./varint";

interface PingOptions {
    port?: number;
    timeout?: number;
    protocolVersion?: number;
    virtualHost?: string;
}

interface JavaPingResponse {
    version?: {
        name: string;
        protocol: number;
    };
    players?: {
        max: number;
        online: number;
        sample?: Array<{
            name: string;
            id: string;
        }>;
    };
    description: {
        text: string;
    };
    favicon?: string;
    modinfo?: {
        type: string;
        modList: Array<{
            modid: string;
            version: string;
        }>;
    };
}

/**
 * Ping a Minecraft Java server.
 * @param {string} host The host of the Java server.
 * @param {string} virtualHost The host sent in handshake.
 * @param {number} port The port of the Java server (default: 25565).
 * @param {number} timeout The timeout duration in milliseconds (default: 5000).
 * @param {number} protocolVersion The protocol version of the Java client (default: -1).
 * @returns {Promise<JavaPingResponse>} The server response.
 * @throws {Error} If the ping fails or times out.
 */
async function pingJavaServer(
    host: string,
    virtualHost: string = host,
    port: number = 25565,
    timeout: number = 5000,
    protocolVersion: number = -1
): Promise<JavaPingResponse> {
    return new Promise((resolve, reject) => {
        const socket = net.createConnection({ host, port });
        let didFireError = false;
        let incomingBuffer = Buffer.alloc(0);

        // Set timeout for the connection
        const timeoutTask = setTimeout(() => {
            handleError(new Error("Connection timeout"));
        }, timeout);

        const closeSocket = () => {
            socket.destroy();
            clearTimeout(timeoutTask);
        };

        const handleError = (err: Error) => {
            closeSocket();
            if (!didFireError) {
                didFireError = true;
                reject(err);
            }
        };

        socket.setNoDelay(true);

        socket.on("connect", () => {
            try {
                const handshake = varint.concat([
                    varint.encodeInt(0), // Packet ID for handshake
                    varint.encodeInt(protocolVersion),
                    varint.encodeInt(virtualHost.length),
                    varint.encodeString(virtualHost),
                    varint.encodeUShort(port),
                    varint.encodeInt(1), // Next state: status
                ]);

                const request = varint.concat([varint.encodeInt(0)]); // Request packet

                socket.write(handshake);
                socket.write(request);
            } catch (err) {
                handleError(err instanceof Error ? err : new Error(String(err)));
            }
        });

        socket.on("data", (data) => {
            incomingBuffer = Buffer.concat([incomingBuffer, data]);

            // Minimum 5 bytes needed for VarInt header
            if (incomingBuffer.length < 5) return;

            try {
                let offset = 0;
                const packetLength = varint.decodeInt(incomingBuffer, offset);
                offset += varint.decodeLength(packetLength);

                // Check if we have the complete packet
                if (incomingBuffer.length < offset + packetLength) return;

                const packetId = varint.decodeInt(incomingBuffer, offset);
                offset += varint.decodeLength(packetId);

                if (packetId === 0) { // Response packet
                    const responseLength = varint.decodeInt(incomingBuffer, offset);
                    offset += varint.decodeLength(responseLength);

                    const responseData = incomingBuffer.subarray(offset, offset + responseLength);
                    const response = JSON.parse(responseData.toString('utf8'));

                    closeSocket();
                    resolve(response);
                } else {
                    handleError(new Error(`Unexpected packet ID: ${packetId}`));
                }
            } catch (err) {
                handleError(err instanceof Error ? err : new Error(String(err)));
            }
        });

        socket.on("error", (err) => {
            handleError(err instanceof Error ? err : new Error(String(err)));
        });
    });
}

/**
 * Asynchronously ping Minecraft Java server with options.
 * @param {string} host The Java server address.
 * @param {PingOptions} options Configuration options.
 * @returns {Promise<JavaPingResponse>} The server response.
 * @throws {Error} If host is not provided or ping fails.
 */
export async function pingJava(host: string, options: PingOptions = {}): Promise<JavaPingResponse> {
    if (!host) {
        throw new Error("Host argument is required");
    }

    const {
        port = 25565,
        timeout = 5000,
        protocolVersion = -1,
        virtualHost = host
    } = options;

    return pingJavaServer(host, virtualHost, port, timeout, protocolVersion);
}
