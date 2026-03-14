import admin from 'firebase-admin';

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        })
    });
}

const db = admin.firestore();

export default async function handler(req, res) {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'Falta ID' });

    try {
        const orderDoc = await db.collection('orders_gg').doc(String(id)).get();
        
        if (orderDoc.exists && orderDoc.data().status === 'approved') {
            res.status(200).json({
                status: 'approved',
                email: orderDoc.data().email,
                senha: orderDoc.data().senha
            });
        } else {
            res.status(200).json({ status: 'pending' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao verificar status' });
    }
}