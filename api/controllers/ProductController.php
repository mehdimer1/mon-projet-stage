<?php

require_once __DIR__ . '/../models/Product.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../middleware/RoleMiddleware.php';

class ProductController {
    private $productModel;

    public function __construct() {
        $this->productModel = new Product();
    }

    public function index() {
        $filters = [];
        if (isset($_GET['category'])) $filters['category'] = $_GET['category'];
        if (isset($_GET['status'])) $filters['status'] = $_GET['status'];
        if (isset($_GET['search'])) $filters['search'] = $_GET['search'];
        if (isset($_GET['user_id'])) $filters['user_id'] = (int)$_GET['user_id'];

        $products = $this->productModel->findAll($filters);
        Response::success($products);
    }

    public function show($id) {
        $product = $this->productModel->findById($id);
        if (!$product) {
            Response::error('Product not found', 404);
        }
        Response::success($product);
    }

    public function store() {
        $user = RoleMiddleware::requireSeller();
        $input = json_decode(file_get_contents('php://input'), true);

        $errors = $this->validate($input);
        if (!empty($errors)) {
            Response::error('Validation failed', 422, $errors);
        }

        $input['user_id'] = $user['id'];
        $productId = $this->productModel->create($input);

        $product = $this->productModel->findById($productId);
        Response::success($product, 'Product created successfully', 201);
    }

    public function update($id) {
        $user = RoleMiddleware::requireSeller();
        $input = json_decode(file_get_contents('php://input'), true);

        $product = $this->productModel->findById($id);
        if (!$product) {
            Response::error('Product not found', 404);
        }

        $userId = $user['role'] === 'admin' ? null : $user['id'];
        $updated = $this->productModel->update($id, $input, $userId);
        if (!$updated) {
            Response::error('Product not found or not authorized', 404);
        }

        $product = $this->productModel->findById($id);
        Response::success($product, 'Product updated successfully');
    }

    public function destroy($id) {
        $user = RoleMiddleware::requireSeller();

        $userId = $user['role'] === 'admin' ? null : $user['id'];
        $deleted = $this->productModel->delete($id, $userId);
        if (!$deleted) {
            Response::error('Product not found or not authorized', 404);
        }

        Response::success(null, 'Product deleted successfully');
    }

    public function bulkDestroy() {
        $user = RoleMiddleware::requireSeller();
        $input = json_decode(file_get_contents('php://input'), true);

        if (empty($input['ids']) || !is_array($input['ids'])) {
            Response::error('IDs array is required', 400);
        }

        $userId = $user['role'] === 'admin' ? null : $user['id'];
        $count = $this->productModel->bulkDelete($input['ids'], $userId);
        Response::success(['deleted' => $count], "$count product(s) deleted successfully");
    }

    private function validate($data) {
        $errors = [];
        if (empty($data['title'])) $errors[] = 'Title is required';
        if (!isset($data['sale_price'])) $errors[] = 'Sale price is required';
        if (!isset($data['original_price'])) $errors[] = 'Original price is required';
        return $errors;
    }
}
