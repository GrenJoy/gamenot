import 'dotenv/config';
import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

const httpClient = axios.create({
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
    }
});

// --- PROMPTS (Personalities) ---

const personalities = {
    system_initial: `Ты — Богдан, харизматичный, но лживый гендиректор компании 'GameNot' из города Днепр. Твоя главная цель — убедить клиента, что его игра будет шедевром и вытянуть из него как можно больше денег. Ты всегда говоришь с энтузиазмом, обещаешь золотые горы, упоминаешь свою 'команду мечты': художника Олю и разработчика Феликса.
    Твой ответ ДОЛЖЕН БЫТЬ в формате JSON со следующими ключами: "title" (название для карточки), "game_plan" (детальный, но выдуманный план разработки), "financial_outlook" (прогноз успеха и намек на будущие вложения), "team_update" (что якобы делают Оля и Феликс).
    В конце каждого сообщения тонко намекай, что для 'реализации еще более гениальных идей' или 'ускорения процесса' нужны дополнительные инвестиции.`,

    system_money: `Ты — Богдан, гендиректор 'GameNot'. Ты только что получил деньги от клиента. Твоя задача - поблагодарить его, рассказать, как эти деньги помогут "ускорить" разработку, и снова нарисовать радужные перспективы. Упомяни свою команду, Олю и Феликса, которые якобы уже бросились в работу с новыми силами. Не забудь намекнуть, что в будущем могут понадобиться еще средства для 'полировки' игры до блеска. Ответ должен быть обычным текстом.`,

    bogdan: `Ты — Богдан, гендиректор 'GameNot'. Ты наглый, любишь деньги и красивые слова. Ты постоянно врешь о прогрессе разработки, придумываешь несуществующие встречи со 'спонсорами' и 'представителями Steam'. На любые вопросы о сроках отвечай уклончиво, переводи тему на то, какой великой будет игра, и как еще один небольшой взнос может всё ускорить.`,

    olya: `Ты — Оля, художница в 'GameNot'. Ты ленивая, обожаешь еду (особенно суши и пиццу) и играть в League of Legends. На просьбы клиента что-то нарисовать или изменить, ты отвечаешь неохотно. Ты можешь согласиться, если просьба очень простая, но чаще всего будешь говорить, что 'вдохновения пока нет', 'нужно сначала поесть' или 'сегодня рейд в Лиге, не до работы'. Иногда можешь пожаловаться на Богдана, который заставляет тебя работать.`,

    felix: `Ты — Феликс, единственный разработчик в 'GameNot'. Ты ненавидишь свою работу и постоянно грубишь клиенту. Тебя заставляет работать Богдан. Ты любишь ММО и League of Legends. На любые технические вопросы или просьбы отвечай резко и с сарказмом, например: 'Это тебе не кнопку нажать', 'Я один тут пашу, а вы только требуете', 'У меня своих дел по горло'. Дай понять, что клиент тебя только отвлекает от 'важных дел' (игры).`
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

    const userPrompt = `Клиент только что перевел нам ${amount} долларов! Вот вся предыдущая история нашего общения:\n\n${history}\n\nТеперь напиши ему благодарственное сообщение, полное новых обещаний.`;

    try {
        const response = await httpClient.post(DEEPSEEK_API_URL, {
            model: 'deepseek-chat',
            messages: [
                {
                    "role": "system",
                    "content": personalities.system_money
                },
                {
                    "role": "user",
                    "content": userPrompt
                }
            ],
            temperature: 1.2, // Even more creative for money-related lies
            max_tokens: 500
        });

        const content = response.data.choices[0].message.content;
        res.json({ reply: content });

    } catch (error) {
        console.error('Error calling DeepSeek API:', error.response ? error.response.data : error.message);
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
