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

    async saveSubscription(userId) {

        let [newPurchase] = await DBConnection.query(
            `UPDATE purchases SET user_id = ?
            WHERE purchase_date <= NOW() - INTERVAL 5 MINUTE
            AND purchase_type = 'suscription'
            AND subscription_id = 0`,
            [userId]
        )

        if (newPurchase.affectedRows == 1) return 1

        const inProcess = await this.#isSubscriptionInProcess();

        if (!inProcess) {
            await DBConnection.query(
                'INSERT INTO purchases(user_id, purchase_type) VALUES (?,?)',
                [userId, 'suscription']
            );
            return 1
        }
        else if (inProcess.user_id == userId) {
            DBConnection.query(
                `UPDATE purchases SET user_id = ?
                WHERE subscription_id = 0`,
                [userId]
            )
            return 1
        }

        return 0;
    }

    async confirmSubscription(subscriptionId) {
        await DBConnection.query(
            `UPDATE purchases JOIN users 
            SET purchases.subscription_id = ?, users.role = 'premium'
            WHERE purchases.subscription_id = 0 
            AND users.id = purchases.user_id
            AND purchases.purchase_type = "suscription";`,
            [subscriptionId]
        )
    }

    async #isSubscriptionInProcess() {
        const [[data]] = await DBConnection.query(
            "SELECT user_id FROM purchases WHERE subscription_id = 0 AND purchase_type = 'suscription'"
        )
        return data;
    }

    async getSuscriptionPrice() {
        return await DBConnection.query(
            'SELECT suscription FROM prices'
        )
    }

    async getSubscriptionIdByUserId(userID) {
        const [[{ subscription_id }]] = await DBConnection.query(
            'SELECT subscription_id FROM purchases WHERE user_id = ? AND purchase_type = "suscription"',
            [userID]
        )

        return subscription_id
    }

    async cancelSubscription(userID) {
        DBConnection.query(
            'UPDATE users SET role = "free" WHERE id = ?',
            [userID]
        )
        DBConnection.query(
            'DELETE FROM purchases WHERE user_id = ? AND purchase_type = "suscription"',
            [userID]
        )

    }
}