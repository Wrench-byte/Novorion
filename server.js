require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// 1. Decirle a Express que sirva la carpeta "public" (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Función para enviar la notificación a Telegram
async function sendTelegramNotification(data) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    const textMessage = `
<b>🚀 Новая заявка с сайта!</b>

👤 <b>Имя:</b> ${data.name}
📞 <b>Контакт:</b> ${data.email}
💻 <b>Тип проекта:</b> ${data.projectType}
📝 <b>Сообщение:</b> ${data.message}
    `;

    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text: textMessage,
            parse_mode: 'HTML'
        })
    });

    if (!response.ok) {
        throw new Error('Error enviando notificación a Telegram');
    }
}

// 2. Ruta API para el formulario
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, projectType, message } = req.body;

        if (!name || !email || !projectType || !message) {
            return res.status(400).json({
                success: false,
                message: 'Пожалуйста, заполните все поля.'
            });
        }

        await sendTelegramNotification({ name, email, projectType, message });

        return res.status(200).json({
            success: true,
            message: 'Заявка успешно получена!'
        });

    } catch (error) {
        console.error('❌ Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Ошибка при отправке сообщения.'
        });
    }
});

// 3. Servir el HTML principal en la ruta raíz (opcional pero recomendado)
// POR ESTO:
app.get('(.*)', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});