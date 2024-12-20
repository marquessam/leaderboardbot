export default async function handler(req, res) {
    try {
        const response = await fetch('https://leaderboardbot.vercel.app/api/discord');
        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
