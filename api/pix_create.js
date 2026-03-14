import { MercadoPagoConfig, Payment } from 'mercadopago';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Método não permitido');

    const { valor, emailPayer, nomePayer } = req.body;

    // Configura o Mercado Pago com seu Access Token de Produção
    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
    const payment = new Payment(client);

    try {
        const response = await payment.create({
            body: {
                transaction_amount: Number(valor),
                description: 'GG Optimizer - Acesso VIP',
                payment_method_id: 'pix',
                payer: {
                    email: emailPayer,
                    first_name: nomePayer
                }
            }
        });

        res.status(200).json({
            id: response.id,
            qr_code_base64: response.point_of_interaction.transaction_data.qr_code_base64,
            qr_code_copia_cola: response.point_of_interaction.transaction_data.qr_code
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Falha ao gerar o PIX no Mercado Pago' });
    }
}