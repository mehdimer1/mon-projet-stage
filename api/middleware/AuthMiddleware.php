<?php

require_once __DIR__ . '/../config/database.php';

class AuthMiddleware {
    public static function authenticate() {
        $headers = getallheaders();
        $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';

        if (empty($authHeader) && isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
        }
        if (empty($authHeader) && isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
            $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
        }

        if (empty($authHeader) || strpos($authHeader, 'Bearer ') !== 0) {
            Response::error('Authentication required', 401);
        }

        $token = substr($authHeader, 7);

        $db = (new Database())->getConnection();
        $stmt = $db->prepare(
            "SELECT t.user_id, t.expires_at, u.name, u.email
             FROM auth_tokens t
             JOIN users u ON t.user_id = u.id
             WHERE t.token = :token"
        );
        $stmt->execute([':token' => $token]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$result) {
            Response::error('Invalid token', 401);
        }

        if (strtotime($result['expires_at']) < time()) {
            $deleteStmt = $db->prepare("DELETE FROM auth_tokens WHERE token = :token");
            $deleteStmt->execute([':token' => $token]);
            Response::error('Token expired', 401);
        }

        return [
            'id' => (int)$result['user_id'],
            'name' => $result['name'],
            'email' => $result['email']
        ];
    }
}
