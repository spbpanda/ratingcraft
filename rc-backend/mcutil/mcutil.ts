const net = require('net');
const dns = require('dns').promises;

class MinecraftPinger {

  async resolveSRV(host: any) {
    try {
      const records = await dns.resolveSrv(`_minecraft._tcp.${host}`);
      if (records.length > 0) {
        return {
          host: records[0].name,
          port: records[0].port
        };
      }
    } catch (e) {
      // Если SRV-запись не найдена
    }
    return { host, port: 25565 };
  }

  async ping(host: string, port = 25565, timeout = 5000) {
    const resolved = await this.resolveSRV(host);
    const actualPort = port || resolved.port;
    
    return new Promise((resolve, reject) => {
      const socket = net.createConnection({
        host: resolved.host,
        port: actualPort,
        timeout
      });

      let buffer = Buffer.alloc(0);
      let state = 'handshake';

      const sendPacket = (packetId: number, data = Buffer.alloc(0)) => {
        const packetLength = Buffer.concat([
          this.writeVarInt(packetId),
          data
        ]);
        socket.write(Buffer.concat([
          this.writeVarInt(packetLength.length),
          packetLength
        ]));
      };

      socket.on('connect', () => {
        // Отправляем handshake
        sendPacket(0, Buffer.concat([
          this.writeString(host),
          Buffer.from([actualPort >> 8, actualPort & 0xFF]),
          this.writeVarInt(1) // Статус
        ]));

        // Запрос статуса
        sendPacket(0);
      });

      socket.on('data', (data: any) => {
        buffer = Buffer.concat([buffer, data]);
        
        while (buffer.length > 0) {
          try {
            const { value: length, bytesRead } = this.readVarInt(buffer as any);
            if (buffer.length < length + bytesRead) break;

            const packet = buffer.slice(bytesRead, bytesRead + length);
            buffer = buffer.slice(bytesRead + length);

            const { value: packetId, bytesRead: idBytes } = this.readVarInt(packet as any);
            const packetData = packet.slice(idBytes);

            if (state === 'handshake' && packetId === 0) {
              const json = JSON.parse(packetData.toString('utf8'));
              resolve(json);
              socket.end();
            }
          } catch (e) {
            reject(e);
            socket.destroy();
          }
        }
      });

      socket.on('error', reject);
      socket.on('timeout', () => {
        socket.destroy();
        reject(new Error('Connection timeout'));
      });
    });
  }

  // Вспомогательные методы для работы с VarInt
  writeVarInt(value: number) {
    const buffer = [];
    while (value > 0x7F) {
      buffer.push((value & 0x7F) | 0x80);
      value >>>= 7;
    }
    buffer.push(value & 0x7F);
    return Buffer.from(buffer);
  }

  readVarInt(buffer: string | any[]) {
    let result = 0;
    let shift = 0;
    let bytesRead = 0;
    
    while (true) {
      if (bytesRead >= buffer.length) {
        throw new Error('VarInt too big');
      }
      
      const byte = buffer[bytesRead++];
      result |= (byte & 0x7F) << shift;
      shift += 7;
      
      if ((byte & 0x80) === 0) {
        return { value: result, bytesRead };
      }
    }
  }

  writeString(str: any) {
    const strBuf = Buffer.from(str, 'utf8');
    return Buffer.concat([
      this.writeVarInt(strBuf.length),
      strBuf
    ]);
  }
}

// Пример использования
export async function test() {
  const pinger = new MinecraftPinger();
  try {
    const response: any = await pinger.ping('mc.hypixel.net');
    console.log('Server status:', {
      version: response.version.name,
      players: `${response.players.online}/${response.players.max}`,
      motd: response.description.text
    });
  } catch (e: any) {
    console.error('Error:', e.message);
  }
}