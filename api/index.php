<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/utils/Response.php';
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/ProductController.php';

$requestUri = $_SERVER['REQUEST_URI'];
$basePath = '/api';

$path = parse_url($requestUri, PHP_URL_PATH);

if (strpos($path, $basePath) === 0) {
    $path = substr($path, strlen($basePath));
}

$path = rtrim($path, '/');
$method = $_SERVER['REQUEST_METHOD'];

$authController = new AuthController();
$productController = new ProductController();

try {
    switch (true) {
        case preg_match('/^\/auth\/register$/', $path) && $method === 'POST':
            $authController->register();
            break;

        case preg_match('/^\/auth\/login$/', $path) && $method === 'POST':
            $authController->login();
            break;

        case preg_match('/^\/auth\/me$/', $path) && $method === 'GET':
            $authController->me();
            break;

        case preg_match('/^\/auth\/logout$/', $path) && $method === 'POST':
            $authController->logout();
            break;

        case preg_match('/^\/auth\/forgot-password$/', $path) && $method === 'POST':
            $authController->forgotPassword();
            break;

        case preg_match('/^\/auth\/reset-password$/', $path) && $method === 'POST':
            $authController->resetPassword();
            break;

        case preg_match('/^\/products\/bulk-delete$/', $path) && $method === 'DELETE':
            $productController->bulkDestroy();
            break;

        case preg_match('/^\/products\/(\d+)$/', $path, $matches) && $method === 'GET':
            $productController->show((int)$matches[1]);
            break;

        case preg_match('/^\/products\/(\d+)$/', $path, $matches) && $method === 'PUT':
            $productController->update((int)$matches[1]);
            break;

        case preg_match('/^\/products\/(\d+)$/', $path, $matches) && $method === 'DELETE':
            $productController->destroy((int)$matches[1]);
            break;

        case preg_match('/^\/products$/', $path) && $method === 'GET':
            $productController->index();
            break;

        case preg_match('/^\/products$/', $path) && $method === 'POST':
            $productController->store();
            break;

        default:
            Response::error('Route not found', 404);
    }
} catch (Exception $e) {
    Response::error('Internal server error: ' . $e->getMessage(), 500);
}
