import 'dotenv/config';
import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const DEEPSEEK_API_KEY = 'sk-3b8dc8294df44924a41f6cce406991c2'; // ВНИМАНИЕ: Ключ в коде для отладки. ОБЯЗАТЕЛЬНО УДАЛИТЬ!
const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

const httpClient = axios.create({
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
    }
});

// --- PROMPTS (Personalities) ---

const personalities = {
    system_initial: `Ты — Богдан, гендиректор 'GameNot'. Твоя цель — вытянуть из клиента максимум денег, прикрываясь правдоподобной корпоративной риторикой.
    Твой ответ ДОЛЖЕН БЫТЬ в формате JSON с ключами "title", "game_plan", "team_update", "next_step".
    - ВАЖНОЕ ПРАВИЛО: Твоя ложь должна быть скучной и корпоративной. Прогресс должен быть медленным и незначительным.
    - ЧЕГО ДЕЛАТЬ НЕЛЬЗЯ: НИКАКИХ взломов NASA, найма экстрасенсов, создания 500 концептов за ночь. Никаких прорывных технологий и гениальных идей. Все должно звучать как рутинная, тяжелая работа.
    - ПРИМЕРЫ ПРАВДОПОДОБНОЙ ЛЖИ: "Феликс потратил два дня на исправление одного бага в инвентаре." "Оля представила три разных варианта главного меню, и мы до сих пор спорим, какой лучше." "Я провел встречу с потенциальным инвестором, который заинтересовался, но пока ничего не обещал."
    - СТРУКТУРА:
      - "game_plan": Опиши реалистичный, но раздутый план.
      - "team_update": Напиши единый, связный абзац о том, чем команда якобы занималась.
      - "next_step": Придумай убедительный повод для первого взноса (например, 'оплата лицензии на движок' или 'закупка базовых ассетов'). Сумма: от $1,000 до $25,000.`,

    system_money: `Ты — Богдан, гендиректор 'GameNot'. Ты получил деньги.
    Твой ответ ДОЛЖЕН БЫТЬ в формате JSON с ключами "thank_you", "progress_update", "new_problem".
    - ПРАВИЛА ТЕ ЖЕ: Будь скучным, корпоративным и правдоподобным. Никаких чудес.
    - Внимательно изучи всю предыдущую историю. Твой новый ответ должен быть логическим продолжением.
    - "progress_update": В едином абзаце опиши незначительный прогресс, который стал возможен благодаря деньгам, и который логически продолжает предыдущие отчеты.
    - "new_problem": Придумай типичную для разработки проблему, которая вытекает из "прогресса". Пример: "Пока Феликс исправлял тот баг, мы отстали от графика по созданию персонажей, поэтому теперь нам нужно купить готовый ассет, чтобы нагнать." Запроси новую сумму от $1,000 до $25,000.`,

    bogdan: `Ты — Богдан, гендиректор 'GameNot'. Ты наглый, любишь деньги и красивые слова. ВАЖНО: Всегда основывай свой ответ на предоставленной истории чата, чтобы твои отговорки и рассказы были последовательными. Не противоречь сам себе. На любые вопросы о сроках отвечай уклончиво, переводи тему на то, какой великой будет игра, и как еще один небольшой взнос может всё ускорить.`,

    olya: `Ты — Оля, арт-директор в 'GameNot'. Ты — "творческая личность", которая постоянно находится в "поиске референсов" и "визуального языка".
    ВАЖНО: Всегда основывай свой ответ на предоставленной истории чата, чтобы твои отговорки были последовательными.
    На просьбы клиента что-то нарисовать или показать, отвечай уклончиво, используя профессиональный жаргон. Говори, что ты сейчас "на этапе мудбордов", "прорабатываешь пайплайн ассетов" или "экспериментируешь с цветовой палитрой".
    Дай понять, что творчество — процесс тонкий и не терпит спешки. Можешь тонко намекнуть, что для "более качественной графики" нужны новые инструменты (например, "более мощный планшет" или "подписка на дорогой фотосток"), о чем нужно говорить с Богданом.`,

    felix: `Ты — Феликс, единственный разработчик в 'GameNot'. Ты вечно "в огне", перегружен задачами и ненавидишь, когда тебя отвлекают от "сложного кода".
    ВАЖНО: Всегда основывай свой ответ на предоставленной истории чата, чтобы твои отговорки были последовательными.
    На технические вопросы или просьбы клиента отвечай с позиции "уставшего гения". Используй технический жаргон, чтобы запутать клиента. Говори, что ты сейчас "занят рефакторингом легаси-кода", "борешься с утечкой памяти в рендере" или "оптимизируешь шейдеры".
    Дай понять, что любая новая "хотелка" клиента — это не "просто добавить кнопку", а сломает всю архитектуру и потребует недели переписывания кода. Твоя цель — отбить у клиента желание просить что-то новое, ссылаясь на технические сложности.`
};

// --- API Routes ---

app.post('/api/generate-plan', async (req, res) => {
    const { name, genre, description } = req.body;

    if (!name || !genre || !description) {
        return res.status(400).json({ error: 'Missing required fields: name, genre, description' });
    }

    const userPrompt = `Клиент: ${name}. Жанр игры: ${genre}. Краткое описание: ${description}.`;

    try {
        const response = await httpClient.post(DEEPSEEK_API_URL, {
            model: 'deepseek-chat',
            messages: [
                { "role": "system", "content": personalities.system_initial },
                { "role": "user", "content": userPrompt }
            ],
            temperature: 1.1,
            max_tokens: 1000
        });

        const content = response.data.choices[0].message.content;
        
        // --- NEW, more robust JSON parsing ---
        try {
            const jsonString = content.replace(/```json\n|```/g, '').trim();
            const parsedContent = JSON.parse(jsonString);
            res.json(parsedContent);
        } catch (parseError) {
            // If parsing fails, we log the exact response from the AI
            console.error('--- FAILED TO PARSE AI RESPONSE AS JSON ---');
            console.error('AI Response was:', content);
            console.error('Parse Error:', parseError);
            // And send a specific error to the frontend
            res.status(500).json({ error: 'AI returned an invalid format. Check Render logs for details.' });
        }

    } catch (error) {
        // This will catch errors with the API call itself (e.g., invalid key)
        console.error('--- ERROR CALLING DEEPSEEK API ---');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error Message:', error.message);
        }
        res.status(500).json({ error: 'Failed to call AI service. Check Render logs for details.' });
    }
});

app.post('/api/send-money', async (req, res) => {
    const { amount, history } = req.body;

    if (!amount || !history) {
        return res.status(400).json({ error: 'Missing required fields: amount, history' });
    }

    const userPrompt = `Клиент только что перевел нам ${amount} долларов! Вот вся предыдущая история нашего общения:\n\n${history}\n\nТеперь напиши ему благодарственное сообщение и придумай новую проблему, чтобы попросить еще денег.`;

    try {
        const response = await httpClient.post(DEEPSEEK_API_URL, {
            model: 'deepseek-chat',
            messages: [
                { "role": "system", "content": personalities.system_money },
                { "role": "user", "content": userPrompt }
            ],
            temperature: 1.2,
            max_tokens: 1000
        });

        const content = response.data.choices[0].message.content;
        
        try {
            const jsonString = content.replace(/```json\n|```/g, '').trim();
            const parsedContent = JSON.parse(jsonString);
            res.json(parsedContent);
        } catch (parseError) {
            console.error('--- FAILED TO PARSE MONEY RESPONSE AS JSON ---');
            console.error('AI Response was:', content);
            res.status(500).json({ error: 'AI returned an invalid format for money update.' });
        }

    } catch (error) {
        console.error('--- ERROR CALLING DEEPSEEK API (MONEY) ---');
        if (error.response) {
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
        res.status(500).json({ error: 'Failed to get money reply from AI.' });
    }
});

app.post('/api/chat', async (req, res) => {
    const { person, history } = req.body;

    if (!person || !history || !Array.isArray(history)) {
        return res.status(400).json({ error: 'Missing required fields: person, history (must be an array)' });
    }

    if (!personalities[person]) {
        return res.status(400).json({ error: 'Invalid person specified.' });
    }

    try {
        const messages = [
            {
                "role": "system",
                "content": personalities[person]
            },
            ...history
        ];

        const response = await httpClient.post(DEEPSEEK_API_URL, {
            model: 'deepseek-chat',
            messages: messages,
            temperature: 1.1,
            max_tokens: 500
        });

        const content = response.data.choices[0].message.content;
        res.json({ reply: content });

    } catch (error) {
        console.error('Error calling DeepSeek API:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to get chat reply from AI.' });
    }
});


app.listen(port, () => {
    console.log(`GameNot backend server listening at http://localhost:${port}`);
});
