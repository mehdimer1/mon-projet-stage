<?php

require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../models/Product.php';
require_once __DIR__ . '/../models/Order.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../middleware/RoleMiddleware.php';

class AdminController {
    private $userModel;
    private $productModel;
    private $orderModel;

    public function __construct() {
        $this->userModel = new User();
        $this->productModel = new Product();
        $this->orderModel = new Order();
    }

    public function users() {
        RoleMiddleware::requireAdmin();
        $filters = [];
        if (isset($_GET['role'])) $filters['role'] = $_GET['role'];
        if (isset($_GET['search'])) $filters['search'] = $_GET['search'];
        $users = $this->userModel->findAll($filters);
        Response::success($users);
    }

    public function updateUserRole($id) {
        RoleMiddleware::requireAdmin();
        $input = json_decode(file_get_contents('php://input'), true);

        if (empty($input['role']) || !in_array($input['role'], ['seller', 'admin'])) {
            Response::error('Valid role is required (seller, admin)', 400);
        }

        $db = (new Database())->getConnection();
        $stmt = $db->prepare("UPDATE users SET role = :role WHERE id = :id");
        $stmt->execute([':role' => $input['role'], ':id' => $id]);

        if ($stmt->rowCount() === 0) {
            Response::error('User not found', 404);
        }

        Response::success(null, 'User role updated successfully');
    }

    public function deleteUser($id) {
        RoleMiddleware::requireAdmin();
        $db = (new Database())->getConnection();

        $stmt = $db->prepare("SELECT id FROM users WHERE id = :id");
        $stmt->execute([':id' => $id]);
        if (!$stmt->fetch()) {
            Response::error('User not found', 404);
        }

        if ((int)$id === (int)RoleMiddleware::requireAdmin()['id']) {
            Response::error('Cannot delete yourself', 400);
        }

        $stmt = $db->prepare("DELETE FROM users WHERE id = :id");
        $stmt->execute([':id' => $id]);
        Response::success(null, 'User deleted successfully');
    }

    public function allProducts() {
        RoleMiddleware::requireAdmin();
        $filters = [];
        if (isset($_GET['category'])) $filters['category'] = $_GET['category'];
        if (isset($_GET['search'])) $filters['search'] = $_GET['search'];
        if (isset($_GET['user_id'])) $filters['user_id'] = (int)$_GET['user_id'];
        $products = $this->productModel->findAll($filters);
        Response::success($products);
    }

    public function deleteAnyProduct($id) {
        RoleMiddleware::requireAdmin();
        $deleted = $this->productModel->delete($id, null);
        if (!$deleted) {
            Response::error('Product not found', 404);
        }
        Response::success(null, 'Product deleted successfully');
    }

    public function stats() {
        RoleMiddleware::requireAdmin();
        $db = (new Database())->getConnection();

        $totalUsers = $db->query("SELECT COUNT(*) FROM users")->fetchColumn();
        $totalProducts = $db->query("SELECT COUNT(*) FROM products")->fetchColumn();
        $totalOrders = $db->query("SELECT COUNT(*) FROM orders")->fetchColumn();
        $totalRevenue = $db->query("SELECT COALESCE(SUM(total), 0) FROM orders WHERE status != 'cancelled'")->fetchColumn();

        $sellers = $db->query("SELECT COUNT(*) FROM users WHERE role = 'seller'")->fetchColumn();
        $admins = $db->query("SELECT COUNT(*) FROM users WHERE role = 'admin'")->fetchColumn();

        Response::success([
            'total_users' => (int)$totalUsers,
            'total_products' => (int)$totalProducts,
            'total_orders' => (int)$totalOrders,
            'total_revenue' => (float)$totalRevenue,
            'sellers' => (int)$sellers,
            'admins' => (int)$admins
        ]);
    }

    public function orders() {
        RoleMiddleware::requireAdmin();
        $orders = $this->orderModel->findAll();

        foreach ($orders as &$order) {
            $order['items'] = $this->orderModel->getItems($order['id']);
        }

        Response::success($orders);
    }

    public function updateOrderStatus($id) {
        RoleMiddleware::requireAdmin();
        $input = json_decode(file_get_contents('php://input'), true);

        if (empty($input['status']) || !in_array($input['status'], ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])) {
            Response::error('Valid status is required', 400);
        }

        $updated = $this->orderModel->updateStatus($id, $input['status']);
        if (!$updated) {
            Response::error('Order not found', 404);
        }

        Response::success(null, 'Order status updated successfully');
    }
}
