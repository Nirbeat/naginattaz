import { DBConnection } from "../database.js";

export class PurchasesDAO{

    async getPurchasesByUserId(userId){
        const userPurchases = await DBConnection.query(
            'SELECT * FROM purchases WHERE user_id = ?', [userId]
        );

        return userPurchases;
    }

    async saveCoursePurchase(userId, courseId, specialLessonId, purchaseType){

        const newPurchase = await DBConnection.query(
            'INSERT INTO purchases(user_id, class_id, special_lesson_id, purchase_type) VALUES (?,?, ?, ?)',
            [userId, courseId,specialLessonId || null, purchaseType || 'course']
        );

        return newPurchase;
    }

    async saveSpecialLessonPurchase(userId, lessonId){

        const newPurchase = await DBConnection.query(
            'INSERT INTO purchases(user_id, special_lesson_id) VALUES (?,?,?)',
            [userId, lessonId || null, purchaseType || 'course']
        );

        return newPurchase;
    }

    async saveSubscription(userId){

        const newPurchase = await DBConnection.query(
            'INSERT INTO purchases(user_id, purchase_type) VALUES (?,?)',
            [userId, 'subscription']
        );

        return newPurchase;
    }
}