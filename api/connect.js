export default async function handler(req, res) {
    try {
        res.status(200).json({
            status: 'ok',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
