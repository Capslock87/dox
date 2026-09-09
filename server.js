/**
 * Green Crops - REST API Backend Server
 * Express + MySQL2
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Отдача статических файлов фронтенда (index.html, styles.css, app.js)
app.use(express.static(path.join(__dirname)));

// Пул соединений с MySQL
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'green_crops_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000
};

let pool;
try {
    pool = mysql.createPool(dbConfig);
} catch (err) {
    console.error('❌ Ошибка инициализации пула MySQL:', err.message);
}

// Преобразование строки БД в формат для фронтенда
function formatLocation(row) {
    let polygonData = null;
    if (row.polygon) {
        if (typeof row.polygon === 'string') {
            try {
                polygonData = JSON.parse(row.polygon);
            } catch (e) {
                console.warn(`Не удалось распарсить полигон для ID ${row.id}`);
            }
        } else if (Array.isArray(row.polygon)) {
            polygonData = row.polygon;
        }
    }

    return {
        id: Number(row.id),
        type: row.type,
        name: row.name,
        lat: parseFloat(row.lat),
        lng: parseFloat(row.lng),
        address: row.address || null,
        phone: row.phone || null,
        email: row.email || null,
        area: row.area !== null ? parseFloat(row.area) : null,
        crop: row.crop || null,
        description: row.description || '',
        polygon: polygonData
    };
}

// =========================================================
// API Маршруты
// =========================================================

// 1. Проверка работоспособности и статуса БД
app.get('/api/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({
            status: 'ok',
            database: 'connected',
            databaseName: dbConfig.database,
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        res.status(503).json({
            status: 'degraded',
            database: 'disconnected',
            error: err.message,
            hint: 'Убедитесь, что служба MySQL запущена и параметры в .env корректны.'
        });
    }
});

// 2. Получение всех активных объектов (офисы и поля)
app.get('/api/locations', async (req, res) => {
    try {
        const { type } = req.query;
        let query = 'SELECT * FROM locations WHERE is_active = 1';
        const params = [];

        if (type && (type === 'office' || type === 'field')) {
            query += ' AND type = ?';
            params.push(type);
        }

        query += ' ORDER BY type ASC, id ASC';

        const [rows] = await pool.query(query, params);
        const formatted = rows.map(formatLocation);
        res.json(formatted);
    } catch (err) {
        console.error('Ошибка при выборке объектов из MySQL:', err.message);
        res.status(500).json({
            error: 'Ошибка базы данных при получении списка объектов',
            details: err.message
        });
    }
});

// 3. Получение одного объекта по ID
app.get('/api/locations/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM locations WHERE id = ? AND is_active = 1', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Объект не найден' });
        }
        res.json(formatLocation(rows[0]));
    } catch (err) {
        console.error('Ошибка при поиске объекта:', err.message);
        res.status(500).json({ error: 'Ошибка сервера при поиске объекта', details: err.message });
    }
});

// 4. Добавление нового объекта (Офис или Поле)
app.post('/api/locations', async (req, res) => {
    try {
        const { type, name, lat, lng, address, phone, email, area, crop, description, polygon } = req.body;

        if (!type || !name || lat === undefined || lng === undefined) {
            return res.status(400).json({ error: 'Поля type, name, lat и lng обязательны' });
        }

        const polygonJson = polygon ? JSON.stringify(polygon) : null;

        const insertQuery = `
            INSERT INTO locations (type, name, lat, lng, address, phone, email, area, crop, description, polygon, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
        `;

        const [result] = await pool.query(insertQuery, [
            type,
            name,
            lat,
            lng,
            address || null,
            phone || null,
            email || null,
            area !== undefined ? area : null,
            crop || null,
            description || null,
            polygonJson
        ]);

        const [createdRow] = await pool.query('SELECT * FROM locations WHERE id = ?', [result.insertId]);
        res.status(201).json(formatLocation(createdRow[0]));
    } catch (err) {
        console.error('Ошибка создания объекта:', err.message);
        res.status(500).json({ error: 'Не удалось создать объект', details: err.message });
    }
});

// 5. Обновление объекта
app.put('/api/locations/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { type, name, lat, lng, address, phone, email, area, crop, description, polygon } = req.body;

        const [existing] = await pool.query('SELECT * FROM locations WHERE id = ? AND is_active = 1', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ error: 'Объект не найден' });
        }

        const polygonJson = polygon !== undefined ? (polygon ? JSON.stringify(polygon) : null) : existing[0].polygon;

        const updateQuery = `
            UPDATE locations SET
                type = COALESCE(?, type),
                name = COALESCE(?, name),
                lat = COALESCE(?, lat),
                lng = COALESCE(?, lng),
                address = ?,
                phone = ?,
                email = ?,
                area = ?,
                crop = ?,
                description = COALESCE(?, description),
                polygon = ?
            WHERE id = ?
        `;

        await pool.query(updateQuery, [
            type,
            name,
            lat,
            lng,
            address !== undefined ? address : existing[0].address,
            phone !== undefined ? phone : existing[0].phone,
            email !== undefined ? email : existing[0].email,
            area !== undefined ? area : existing[0].area,
            crop !== undefined ? crop : existing[0].crop,
            description,
            polygonJson,
            id
        ]);

        const [updatedRow] = await pool.query('SELECT * FROM locations WHERE id = ?', [id]);
        res.json(formatLocation(updatedRow[0]));
    } catch (err) {
        console.error('Ошибка обновления объекта:', err.message);
        res.status(500).json({ error: 'Не удалось обновить объект', details: err.message });
    }
});

// 6. Удаление (мягкое отключение)
app.delete('/api/locations/:id', async (req, res) => {
    try {
        const [result] = await pool.query('UPDATE locations SET is_active = 0 WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Объект не найден' });
        }
        res.json({ success: true, message: `Объект с ID ${req.params.id} деактивирован` });
    } catch (err) {
        console.error('Ошибка удаления объекта:', err.message);
        res.status(500).json({ error: 'Не удалось удалить объект', details: err.message });
    }
});

// Запуск сервера
app.listen(PORT, async () => {
    console.log(`\n🌱 ================================================`);
    console.log(`🚀 Сервер Green Crops запущен на: http://localhost:${PORT}`);
    console.log(`📡 REST API доступен по: http://localhost:${PORT}/api/locations`);
    console.log(`🌱 ================================================`);

    // Проверка подключения к MySQL при старте
    try {
        await pool.query('SELECT 1');
        console.log(`✅ Успешное подключение к базе данных MySQL (${dbConfig.database}) на ${dbConfig.host}:${dbConfig.port}\n`);
    } catch (err) {
        console.warn(`⚠️  Внимание: Не удалось подключиться к MySQL (${err.code || err.message}).`);
        console.warn(`👉 Проверьте, запущена ли MySQL и создана ли БД green_crops_db (см. database.sql).`);
        console.warn(`💡 Сайт будет использовать встроенные данные по умолчанию (fallback mode).\n`);
    }
});
