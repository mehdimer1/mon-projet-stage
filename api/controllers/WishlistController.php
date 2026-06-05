<?php

require_once __DIR__ . '/../models/Wishlist.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class WishlistController {
    private $wishlistModel;

    public function __construct() {
        $this->wishlistModel = new Wishlist();
    }

    public function index() {
        $user = AuthMiddleware::authenticate();
        $items = $this->wishlistModel->findByUser($user['id']);
        Response::success($items);
    }

    public function toggle() {
        $user = AuthMiddleware::authenticate();
        $input = json_decode(file_get_contents('php://input'), true);

        if (empty($input['product_id'])) {
            Response::error('Product ID is required', 400);
        }

        $productId = (int)$input['product_id'];

        if ($this->wishlistModel->isWishlisted($user['id'], $productId)) {
            $this->wishlistModel->remove($user['id'], $productId);
            Response::success(['wishlisted' => false], 'Removed from wishlist');
        } else {
            $this->wishlistModel->add($user['id'], $productId);
            Response::success(['wishlisted' => true], 'Added to wishlist');
        }
    }

    public function check($productId) {
        $headers = getallheaders();
        $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
        if (empty($authHeader)) {
            Response::success(['wishlisted' => false]);
            return;
        }
        try {
            $user = AuthMiddleware::authenticate();
            $wishlisted = $this->wishlistModel->isWishlisted($user['id'], (int)$productId);
            Response::success(['wishlisted' => $wishlisted]);
        } catch (Exception $e) {
            Response::success(['wishlisted' => false]);
        }
    }
}
