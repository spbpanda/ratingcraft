// minecraft-ping/minecraft-ping.ts
import net from 'net';
import dns from 'dns';

// Функция для создания VarInt (переменное целое число)
function createVarInt(value: number): Buffer {
    const buffer = [];
    while (true) {
        if ((value & 0xFFFFFF80) === 0) {
            buffer.push(value);
            break;
        }
        buffer.push((value & 0x7F) | 0x80);
        value >>>= 7;
    }
    return Buffer.from(buffer);
}

// Функция для преобразования хоста в IP-адрес
function resolveHost(host: string): Promise<string> {
    return new Promise((resolve, reject) => {
        dns.resolve(host, (err, addresses) => {
            if (err) reject(err);
            else resolve(addresses[0]);
        });
    });
}

function isJsonString(str: string): boolean {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
}

// Основная функция для ping Minecraft-сервера
export async function pingMinecraftServer(host: string, port: number = 25565): Promise<any> {
    const ip = await resolveHost(host); // Преобразуем хост в IP
    return new Promise((resolve, reject) => {
        const socket = net.createConnection({ host: ip, port }, () => {
            console.log('Подключено к серверу:', host, port);

            // Создаем Handshake-пакет
            const handshake = Buffer.concat([
                createVarInt(0), // ID пакета (Handshake)
                createVarInt(47), // Protocol version (varint 47 для 1.8+)
                createVarInt(host.length), // Длина хоста
                Buffer.from(host), // Хост
                Buffer.from([port >> 8, port & 0xFF]), // Порт
                createVarInt(1) // Next state (status)
            ]);

            // Добавляем длину пакета в начало
            const handshakePacket = Buffer.concat([
                createVarInt(handshake.length),
                handshake
            ]);

            // Создаем Status Request-пакет
            const statusRequest = Buffer.concat([
                createVarInt(0), // ID пакета (Status Request)
            ]);

            // Добавляем длину пакета в начало
            const statusRequestPacket = Buffer.concat([
                createVarInt(statusRequest.length),
                statusRequest
            ]);

            // Отправляем Handshake
            socket.write(handshakePacket);

            // Отправляем Status Request
            socket.write(statusRequestPacket);

            let buffer = '';
            // Ожидаем ответа
            socket.on('data', (data) => {
                try {
                    buffer += data.toString('utf8');
                    // Проверяем, завершен ли JSON (наличие закрывающей скобки)
                    if (buffer.includes('}')) {
                        const responseString = data.toString('utf8', data.indexOf('{'));
                        resolve(JSON.parse(responseString)); // Возвращаем данные сервера
                    }
                } catch (err) {
                    reject(new Error('Ошибка при разборе ответа: ' + (err as any).message));
                }
                socket.end();
            });

            socket.on('end', () => {
                console.log('Соединение закрыто');
            });
        });

        socket.on('error', (err) => {
            reject(new Error('Ошибка подключения: ' + err.message));
        });
    });
}