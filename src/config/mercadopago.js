import { MercadoPagoConfig, Preference, PreApproval } from 'mercadopago';
import { environment } from './env.js';
import { PurchasesDAO } from '../database/DAO/PurchasesDAO.js';

const client = new MercadoPagoConfig({ accessToken: environment.mercadopago.token });
const preference = new Preference(client);

export async function paymentProcessing(course) {
    return await preference.create({
        body: {
            items: [
                {
                    id: course.id,
                    title: course.class_name,
                    quantity: 1,
                    currency_id: 'ARS',
                    unit_price: course.class_price
                }
            ],
            back_urls: {
                failure: environment.googleAuth.redirectURL + '/api/payment/failure',
                pending: environment.googleAuth.redirectURL + '/api/payment/pending',
                success: environment.googleAuth.redirectURL + '/api/payment/success'
            },
            auto_return: 'approved'
        }
    });
}