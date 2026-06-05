<?php

require_once __DIR__ . '/../config/database.php';

class Order {
    private $conn;

    public function __construct() {
        $this->conn = (new Database())->getConnection();
    }

    public function findById($id) {
        $stmt = $this->conn->prepare("SELECT * FROM orders WHERE id = :id");
        $stmt->execute([':id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function findByUser($userId) {
        $stmt = $this->conn->prepare(
            "SELECT * FROM orders WHERE user_id = :user_id ORDER BY created_at DESC"
        );
        $stmt->execute([':user_id' => $userId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function findBySellerId($sellerId) {
        $stmt = $this->conn->prepare(
            "SELECT DISTINCT o.* FROM orders o
             JOIN order_items oi ON o.id = oi.order_id
             JOIN products p ON oi.product_id = p.id
             WHERE p.user_id = :seller_id
             ORDER BY o.created_at DESC"
        );
        $stmt->execute([':seller_id' => $sellerId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function findByEmail($email) {
        $stmt = $this->conn->prepare(
            "SELECT * FROM orders WHERE buyer_email = :email ORDER BY created_at DESC"
        );
        $stmt->execute([':email' => $email]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function findAll() {
        $stmt = $this->conn->prepare(
            "SELECT o.*, u.name as user_name, u.email as user_email
             FROM orders o LEFT JOIN users u ON o.user_id = u.id
             ORDER BY o.created_at DESC"
        );
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function create($data, $items) {
        $total = 0;
        foreach ($items as $item) {
            $total += $item['price'] * $item['quantity'];
        }

        $this->conn->beginTransaction();
        try {
            $stmt = $this->conn->prepare(
                "INSERT INTO orders (user_id, buyer_name, buyer_email, buyer_phone, buyer_address, total)
                 VALUES (:user_id, :buyer_name, :buyer_email, :buyer_phone, :buyer_address, :total)"
            );
            $stmt->execute([
                ':user_id' => isset($data['user_id']) ? $data['user_id'] : null,
                ':buyer_name' => $data['buyer_name'],
                ':buyer_email' => $data['buyer_email'],
                ':buyer_phone' => isset($data['buyer_phone']) ? $data['buyer_phone'] : null,
                ':buyer_address' => isset($data['buyer_address']) ? $data['buyer_address'] : null,
                ':total' => $total
            ]);
            $orderId = $this->conn->lastInsertId();

            $stmt = $this->conn->prepare(
                "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (:order_id, :product_id, :quantity, :price)"
            );
            foreach ($items as $item) {
                $stmt->execute([
                    ':order_id' => $orderId,
                    ':product_id' => $item['product_id'],
                    ':quantity' => $item['quantity'],
                    ':price' => $item['price']
                ]);

                $updateStmt = $this->conn->prepare(
                    "UPDATE products SET sales = sales + :qty WHERE id = :id"
                );
                $updateStmt->execute([':qty' => $item['quantity'], ':id' => $item['product_id']]);
            }

            $this->conn->commit();
            return $orderId;
        } catch (Exception $e) {
            $this->conn->rollBack();
            throw $e;
        }
    }

    public function getItems($orderId) {
        $stmt = $this->conn->prepare(
            "SELECT oi.*, p.title, p.image FROM order_items oi
             JOIN products p ON oi.product_id = p.id
             WHERE oi.order_id = :order_id"
        );
        $stmt->execute([':order_id' => $orderId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function updateStatus($id, $status) {
        $stmt = $this->conn->prepare("UPDATE orders SET status = :status WHERE id = :id");
        $stmt->execute([':status' => $status, ':id' => $id]);
        return $stmt->rowCount() > 0;
    }
}
