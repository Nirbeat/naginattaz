import { MercadoPagoConfig, Preference } from 'mercadopago';
import { environment } from './env.js';

const client = new MercadoPagoConfig({ accessToken: environment.mercadopago.token});
const preference = new Preference(client);

export async function paymentProcessing(course){
    return await preference.create({
        body:{
            items: [
                {
                    id: course.id,
                    title: course.course_name,
                    quantity: 1,
                    currency_id: 'ARS',
                    unit_price: course.course_price
                }
            ],
            back_urls:{
                failure:'http://localhost:8080/api/payment/failure',
                pending:'http://localhost:8080/api/payment/pending',
                success:'http://localhost:8080/api/payment/success'
            },
            auto_return: 'approved'
        }
    });

}



