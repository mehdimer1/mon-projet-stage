<?php

require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../utils/Mailer.php';

class AuthController {
    private $userModel;

    public function __construct() {
        $this->userModel = new User();
    }

    public function register() {
        $input = json_decode(file_get_contents('php://input'), true);

        if (empty($input['name']) || empty($input['email']) || empty($input['password'])) {
            Response::error('Name, email and password are required', 400);
        }

        if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
            Response::error('Invalid email format', 400);
        }

        if (strlen($input['password']) < 6) {
            Response::error('Password must be at least 6 characters', 400);
        }

        if ($this->userModel->findByEmail($input['email'])) {
            Response::error('Email already exists', 409);
        }

        $role = 'seller';

        $userId = $this->userModel->create(
            $input['name'],
            $input['email'],
            $input['password'],
            $role
        );

        $token = $this->generateToken($userId);

        Response::success([
            'user' => [
                'id' => (int)$userId,
                'name' => $input['name'],
                'email' => $input['email'],
                'role' => $role
            ],
            'token' => $token
        ], 'Registration successful', 201);
    }

    public function login() {
        $input = json_decode(file_get_contents('php://input'), true);

        if (empty($input['email']) || empty($input['password'])) {
            Response::error('Email and password are required', 400);
        }

        $user = $this->userModel->findByEmail($input['email']);

        if (!$user || !password_verify($input['password'], $user['password'])) {
            Response::error('Invalid credentials', 401);
        }

        $token = $this->generateToken($user['id']);

        Response::success([
            'user' => [
                'id' => (int)$user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'role' => $user['role']
            ],
            'token' => $token
        ], 'Login successful');
    }

    public function me() {
        $user = AuthMiddleware::authenticate();
        $userData = $this->userModel->findById($user['id']);
        Response::success($userData);
    }

    public function logout() {
        $user = AuthMiddleware::authenticate();
        $headers = getallheaders();
        $token = substr($headers['Authorization'], 7);

        $db = (new Database())->getConnection();
        $stmt = $db->prepare("DELETE FROM auth_tokens WHERE token = :token");
        $stmt->execute([':token' => $token]);

        Response::success(null, 'Logout successful');
    }

    public function forgotPassword() {
        $input = json_decode(file_get_contents('php://input'), true);

        if (empty($input['email'])) {
            Response::error('Email is required', 400);
        }

        if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
            Response::error('Invalid email format', 400);
        }

        $user = $this->userModel->findByEmail($input['email']);

        if (!$user) {
            Response::success(null, 'Si cet email existe, un lien de réinitialisation a été envoyé.');
        }

        $token = bin2hex(openssl_random_pseudo_bytes(32));
        $expiresAt = date('Y-m-d H:i:s', strtotime('+1 hour'));

        $db = (new Database())->getConnection();

        $stmt = $db->prepare("DELETE FROM password_reset_tokens WHERE user_id = :user_id");
        $stmt->execute([':user_id' => $user['id']]);

        $stmt = $db->prepare(
            "INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (:user_id, :token, :expires_at)"
        );
        $stmt->execute([
            ':user_id' => $user['id'],
            ':token' => $token,
            ':expires_at' => $expiresAt
        ]);

        $resetLink = APP_URL . '/reset-password?token=' . $token;

        $subject = 'Réinitialisation de votre mot de passe';
        $htmlBody = "
        <!DOCTYPE html>
        <html>
        <head><meta charset='utf-8'></head>
        <body style='font-family: Arial, sans-serif; background: #f4f4f4; padding: 40px;'>
            <div style='max-width: 500px; margin: 0 auto; background: white; border-radius: 12px; padding: 32px; box-shadow: 0 2px 12px rgba(0,0,0,0.1);'>
                <h2 style='color: #1e293b; margin-bottom: 16px;'>Réinitialisation de mot de passe</h2>
                <p style='color: #475569; line-height: 1.6;'>
                    Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe.
                </p>
                <div style='text-align: center; margin: 32px 0;'>
                    <a href='{$resetLink}' style='display: inline-block; padding: 12px 32px; background: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;'>
                        Réinitialiser mon mot de passe
                    </a>
                </div>
                <p style='color: #94a3b8; font-size: 14px;'>
                    Ce lien expire dans 1 heure. Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
                </p>
            </div>
        </body>
        </html>";

        $mailer = new Mailer();
        $sent = $mailer->send($user['email'], $subject, $htmlBody);

        if (!$sent) {
            error_log("Password reset: Failed to send email to {$user['email']} - check SMTP config in api/config/mail.php");
        }

        $data = null;
        if (defined('MAIL_DEBUG') && MAIL_DEBUG) {
            $data = ['reset_link' => $resetLink];
        }

        Response::success($data, 'Si cet email existe, un lien de réinitialisation a été envoyé.');
    }

    public function resetPassword() {
        $input = json_decode(file_get_contents('php://input'), true);

        if (empty($input['token']) || empty($input['password'])) {
            Response::error('Token and password are required', 400);
        }

        if (strlen($input['password']) < 6) {
            Response::error('Password must be at least 6 characters', 400);
        }

        $db = (new Database())->getConnection();

        $stmt = $db->prepare(
            "SELECT * FROM password_reset_tokens WHERE token = :token AND used = 0 AND expires_at > NOW()"
        );
        $stmt->execute([':token' => $input['token']]);
        $resetToken = $stmt->fetch();

        if (!$resetToken) {
            Response::error('Token invalide ou expiré', 400);
        }

        $hashedPassword = password_hash($input['password'], PASSWORD_BCRYPT);

        $stmt = $db->prepare("UPDATE users SET password = :password WHERE id = :id");
        $stmt->execute([
            ':password' => $hashedPassword,
            ':id' => $resetToken['user_id']
        ]);

        $stmt = $db->prepare("UPDATE password_reset_tokens SET used = 1 WHERE id = :id");
        $stmt->execute([':id' => $resetToken['id']]);

        $stmt = $db->prepare("DELETE FROM auth_tokens WHERE user_id = :user_id");
        $stmt->execute([':user_id' => $resetToken['user_id']]);

        Response::success(null, 'Mot de passe réinitialisé avec succès.');
    }

    private function generateToken($userId) {
        $db = (new Database())->getConnection();
        $token = bin2hex(openssl_random_pseudo_bytes(32));
        $expiresAt = date('Y-m-d H:i:s', strtotime('+7 days'));

        $stmt = $db->prepare(
            "INSERT INTO auth_tokens (user_id, token, expires_at) VALUES (:user_id, :token, :expires_at)"
        );
        $stmt->execute([
            ':user_id' => $userId,
            ':token' => $token,
            ':expires_at' => $expiresAt
        ]);

        return $token;
    }
}
