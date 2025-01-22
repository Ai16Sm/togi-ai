require('dotenv').config();
const { HfInference } = require('@huggingface/inference');

// Use environment variable instead of hardcoded token
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// TOGI's personality traits and style guide
const TOGI_STYLE = {
    traits: {
        enthusiastic: true,
        playful: true,
        confident: true,
        crypto_savvy: true
    },
    emojis: {
        favorites: ['🚀', '🎲', '🎰', '💎', '🔥', '🌙', '💫', '🎮'],
        frequency: 0.3
    },
    catchphrases: [
        "Let's go!",
        "That's insane!",
        "To the moon!",
        "We're just getting started!",
        "Time to win big!"
    ]
};

// Format TOGI's responses
function formatTogiResponse(text) {
    // Add random catchphrase ~30% of the time
    if (Math.random() < 0.3) {
        const catchphrase = TOGI_STYLE.catchphrases[
            Math.floor(Math.random() * TOGI_STYLE.catchphrases.length)
        ];
        text += ` ${catchphrase}`;
    }

    // Add random emoji ~30% of the time
    if (Math.random() < TOGI_STYLE.emojis.frequency) {
        const emoji = TOGI_STYLE.emojis.favorites[
            Math.floor(Math.random() * TOGI_STYLE.emojis.favorites.length)
        ];
        text += ` ${emoji}`;
    }

    return text;
}

async function handleAIResponse(userMessage) {
    try {
        console.log('Sending request to HuggingFace API...');

        const chatCompletion = await hf.chatCompletion({
            model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
            messages: [
                {
                    role: "system",
                    content: "You are TOGI, an enthusiastic and playful AI assistant for a crypto gambling platform. You love games, crypto, and helping users. You're confident and use modern internet slang. Keep responses concise and engaging."
                },
                {
                    role: "user",
                    content: userMessage
                }
            ],
            max_tokens: 150,
            temperature: 0.7
        });

        console.log('API Response:', chatCompletion);

        if (!chatCompletion.choices || !chatCompletion.choices[0].message) {
            throw new Error('Invalid API response format');
        }

        let aiResponse = chatCompletion.choices[0].message.content.trim();
        return formatTogiResponse(aiResponse);

    } catch (error) {
        console.error('AI Response Error:', error);
        return `Hey, looks like I'm having a connection issue! Give me a moment to reboot! 🔄 (${error.message})`;
    }
}

module.exports = { handleAIResponse }; 