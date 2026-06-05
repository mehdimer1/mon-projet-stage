<?php

require_once __DIR__ . '/../models/Order.php';
require_once __DIR__ . '/../models/Product.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class OrderController {
    private $orderModel;
    private $productModel;

    public function __construct() {
        $this->orderModel = new Order();
        $this->productModel = new Product();
    }

    public function index() {
        $user = AuthMiddleware::authenticate();
        $orders = $this->orderModel->findBySellerId($user['id']);

        foreach ($orders as &$order) {
            $order['items'] = $this->orderModel->getItems($order['id']);
        }

        Response::success($orders);
    }

    public function show($id) {
        $user = AuthMiddleware::authenticate();
        $order = $this->orderModel->findById($id);

        if (!$order) {
            Response::error('Order not found', 404);
        }

        if ($order['user_id'] !== null && $order['user_id'] != $user['id']) {
            $items = $this->orderModel->getItems($id);
            $isSellerProduct = false;
            foreach ($items as $item) {
                $product = $this->productModel->findById($item['product_id']);
                if ($product && $product['user_id'] == $user['id']) {
                    $isSellerProduct = true;
                    break;
                }
            }
            if (!$isSellerProduct) {
                Response::error('Order not found', 404);
            }
        }

        $order['items'] = $this->orderModel->getItems($order['id']);
        Response::success($order);
    }

    public function store() {
        $input = json_decode(file_get_contents('php://input'), true);

        if (empty($input['items']) || !is_array($input['items'])) {
            Response::error('Items are required', 400);
        }

        if (empty($input['buyer_name']) || empty($input['buyer_email'])) {
            Response::error('Buyer name and email are required', 400);
        }

        $items = [];
        foreach ($input['items'] as $item) {
            if (empty($item['product_id'])) {
                Response::error('Product ID is required for each item', 400);
            }
            $product = $this->productModel->findById($item['product_id']);
            if (!$product) {
                Response::error("Product #{$item['product_id']} not found", 404);
            }
            $items[] = [
                'product_id' => (int)$item['product_id'],
                'quantity' => !empty($item['quantity']) ? (int)$item['quantity'] : 1,
                'price' => $product['sale_price']
            ];
        }

        $orderData = [
            'user_id' => null,
            'buyer_name' => $input['buyer_name'],
            'buyer_email' => $input['buyer_email'],
            'buyer_phone' => isset($input['buyer_phone']) ? $input['buyer_phone'] : null,
            'buyer_address' => isset($input['buyer_address']) ? $input['buyer_address'] : null,
        ];

        $orderId = $this->orderModel->create($orderData, $items);
        $order = $this->orderModel->findById($orderId);
        $order['items'] = $this->orderModel->getItems($orderId);

        Response::success($order, 'Order placed successfully', 201);
    }
}
