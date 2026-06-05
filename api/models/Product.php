<?php

require_once __DIR__ . '/../config/database.php';

class Product {
    private $db;
    private $conn;

    public function __construct() {
        $this->db = new Database();
        $this->conn = $this->db->getConnection();
    }

    public function findAll($filters = []) {
        $sql = "SELECT * FROM products WHERE 1=1";
        $params = [];

        if (!empty($filters['category'])) {
            $sql .= " AND category = :category";
            $params[':category'] = $filters['category'];
        }

        if (!empty($filters['status'])) {
            $sql .= " AND status = :status";
            $params[':status'] = $filters['status'];
        }

        if (!empty($filters['search'])) {
            $sql .= " AND (title LIKE :search OR description LIKE :search2)";
            $params[':search'] = '%' . $filters['search'] . '%';
            $params[':search2'] = '%' . $filters['search'] . '%';
        }

        if (!empty($filters['user_id'])) {
            $sql .= " AND user_id = :user_id";
            $params[':user_id'] = $filters['user_id'];
        }

        $sql .= " ORDER BY created_at DESC";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function findById($id) {
        $stmt = $this->conn->prepare("SELECT * FROM products WHERE id = :id");
        $stmt->execute([':id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function findByUserId($userId) {
        $stmt = $this->conn->prepare(
            "SELECT * FROM products WHERE user_id = :user_id ORDER BY created_at DESC"
        );
        $stmt->execute([':user_id' => $userId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function create($data) {
        $stmt = $this->conn->prepare(
            "INSERT INTO products (user_id, title, description, category, sale_price,
             original_price, discount, warranty, rating, sales, status, image)
             VALUES (:user_id, :title, :description, :category, :sale_price,
             :original_price, :discount, :warranty, :rating, :sales, :status, :image)"
        );
        $stmt->execute([
            ':user_id' => $data['user_id'],
            ':title' => $data['title'],
            ':description' => $data['description'],
            ':category' => $data['category'],
            ':sale_price' => $data['sale_price'],
            ':original_price' => $data['original_price'],
            ':discount' => $data['discount'],
            ':warranty' => $data['warranty'],
            ':rating' => $data['rating'],
            ':sales' => $data['sales'],
            ':status' => $data['status'],
            ':image' => $data['image']
        ]);
        return $this->conn->lastInsertId();
    }

    public function update($id, $data, $userId = null) {
        $fields = [];
        $params = [':id' => $id];

        if ($userId !== null) {
            $params[':user_id'] = $userId;
        }

        $allowedFields = ['title', 'description', 'category', 'sale_price',
            'original_price', 'discount', 'warranty', 'rating', 'sales',
            'status', 'image'];

        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $fields[] = "$field = :$field";
                $params[":$field"] = $data[$field];
            }
        }

        if (empty($fields)) {
            return false;
        }

        $sql = "UPDATE products SET " . implode(', ', $fields) .
               " WHERE id = :id";
        if ($userId !== null) {
            $sql .= " AND user_id = :user_id";
        }

        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);
        return $stmt->rowCount() > 0;
    }

    public function delete($id, $userId = null) {
        $sql = "DELETE FROM products WHERE id = :id";
        $params = [':id' => $id];
        if ($userId !== null) {
            $sql .= " AND user_id = :user_id";
            $params[':user_id'] = $userId;
        }
        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);
        return $stmt->rowCount() > 0;
    }

    public function bulkDelete($ids, $userId = null) {
        if (empty($ids)) return false;

        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        $params = $ids;
        $sql = "DELETE FROM products WHERE id IN ($placeholders)";
        if ($userId !== null) {
            $sql .= " AND user_id = ?";
            $params[] = $userId;
        }
        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);
        return $stmt->rowCount();
    }
}
