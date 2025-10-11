import { DBConnection } from "../database.js";

export class PurchasesDAO {

    async getPurchasesByUserId(userId) {
        const userPurchases = await DBConnection.query(
            'SELECT * FROM purchases WHERE user_id = ?', [userId]
        );

        return userPurchases;
    }

    async saveClassPurchase(userId, classId, purchaseType) {

        const newPurchase = await DBConnection.query(
            'INSERT INTO purchases(user_id, class_id, purchase_type) VALUES (?,?,?)',
            [userId, classId, purchaseType || "class"]
        );

        return newPurchase;
    }

    async saveSpecialLessonPurchase(userId, lessonId) {

        const newPurchase = await DBConnection.query(
            'INSERT INTO purchases(user_id, special_lesson_id) VALUES (?,?,?)',
            [userId, lessonId || null, purchaseType || 'course']
        );

        return newPurchase;
    }

    async saveSubscription(userId) {

        const [[previousSub]] = await DBConnection.query(
            'SELECT id FROM purchases WHERE user_id = ?', [userId]
        );
        let newPurchase;
        if (!previousSub) {
            newPurchase = await DBConnection.query(
                'INSERT INTO purchases(user_id, purchase_type) VALUES (?,?)',
                [userId, 'suscription']
            );
        } else {
            newPurchase = await DBConnection.query(
                'UPDATE purchases SET user_id = ?, purchase_type = ? WHERE id = ?',
                [userId, 'suscription', previousSub.id]
            );
        }
        return newPurchase;
    }

    async getSuscriptionPrice() {
        return await DBConnection.query(
            'SELECT suscription FROM prices'
        )
    }
}