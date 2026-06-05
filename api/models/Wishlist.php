<?php

require_once __DIR__ . '/../config/database.php';

class Wishlist {
    private $conn;

    public function __construct() {
        $this->conn = (new Database())->getConnection();
    }

    public function findByUser($userId) {
        $stmt = $this->conn->prepare(
            "SELECT w.*, p.* FROM wishlists w
             JOIN products p ON w.product_id = p.id
             WHERE w.user_id = :user_id
             ORDER BY w.created_at DESC"
        );
        $stmt->execute([':user_id' => $userId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function add($userId, $productId) {
        $stmt = $this->conn->prepare(
            "INSERT IGNORE INTO wishlists (user_id, product_id) VALUES (:user_id, :product_id)"
        );
        $stmt->execute([':user_id' => $userId, ':product_id' => $productId]);
        return $stmt->rowCount() > 0;
    }

    public function remove($userId, $productId) {
        $stmt = $this->conn->prepare(
            "DELETE FROM wishlists WHERE user_id = :user_id AND product_id = :product_id"
        );
        $stmt->execute([':user_id' => $userId, ':product_id' => $productId]);
        return $stmt->rowCount() > 0;
    }

    public function isWishlisted($userId, $productId) {
        $stmt = $this->conn->prepare(
            "SELECT id FROM wishlists WHERE user_id = :user_id AND product_id = :product_id"
        );
        $stmt->execute([':user_id' => $userId, ':product_id' => $productId]);
        return (bool)$stmt->fetch();
    }
}
