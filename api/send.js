// api/send.js — Contact form handler (Node/Express or Vercel Edge)

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, roblox, message } = req.body || {};

    if (!name || !email || !message || message.length < 16) {
        return res.status(400).json({ error: 'Invalid payload' });
    }

    const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK_URL || '';

    if (DISCORD_WEBHOOK) {
        try {
            await fetch(DISCORD_WEBHOOK, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    embeds: [{
                        title: '📬 Nova Mensagem — NeoX Studio',
                        color: 0x00e5ff,
                        fields: [
                            { name: 'Nome', value: name, inline: true },
                            { name: 'E-mail', value: email, inline: true },
                            { name: 'Roblox', value: roblox || '—', inline: true },
                            { name: 'Mensagem', value: message }
                        ],
                        timestamp: new Date().toISOString()
                    }]
                })
            });
        } catch (e) {
            console.error('Webhook error:', e);
        }
    }

    return res.status(200).json({ ok: true });
}