<?php

require_once __DIR__ . '/AuthMiddleware.php';

class RoleMiddleware {
    public static function requireRole($roles = array()) {
        $user = AuthMiddleware::authenticate();
        if (!in_array($user['role'], $roles)) {
            Response::error('Access denied: insufficient permissions', 403);
        }
        return $user;
    }

    public static function requireSeller() {
        return self::requireRole(array('seller', 'admin'));
    }

    public static function requireAdmin() {
        return self::requireRole(array('admin'));
    }
}
