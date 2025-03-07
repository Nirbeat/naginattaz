import { MercadoPagoConfig, Preference, PreApprovalPlan } from 'mercadopago';
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



new PreApprovalPlan().create({body:{
payment_methods_allowed:{
    payment_methods:{
    
    }
}
}})

// curl -X POST \

//   "reason": "Yoga classes",
//   "auto_recurring": {
//     "frequency": 1,
//     "frequency_type": "months",
//     "repetitions": 12,
//     "billing_day": 10,
//     "billing_day_proportional": false,
//     "free_trial": {
//       "frequency": 1,
//       "frequency_type": "months"
//     },
//     "transaction_amount": 10,
//     "currency_id": "ARS"
//   },
//   "payment_methods_allowed": {
//     "payment_types": [
//       {
//         "id": "credit_card"
//       }
//     ],
//     "payment_methods": [
//       {
//         "id": "bolbradesco"
//       }
//     ]
//   },
//   "back_url": "https://www.yoursite.com"
// }'