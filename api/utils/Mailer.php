<?php

require_once __DIR__ . '/../config/mail.php';

class Mailer {
    private $host;
    private $port;
    private $username;
    private $password;
    private $from;
    private $fromName;
    private $encryption;

    public function __construct() {
        $this->host = MAIL_HOST;
        $this->port = MAIL_PORT;
        $this->username = MAIL_USERNAME;
        $this->password = MAIL_PASSWORD;
        $this->from = MAIL_FROM;
        $this->fromName = MAIL_FROM_NAME;
        $this->encryption = MAIL_ENCRYPTION;
    }

    public function send($to, $subject, $htmlBody) {
        $sent = $this->sendSmtp($to, $subject, $htmlBody);

        if (!$sent && function_exists('mail')) {
            $headers = "MIME-Version: 1.0\r\n";
            $headers .= "Content-type: text/html; charset=utf-8\r\n";
            $headers .= "From: " . $this->fromName . " <" . $this->from . ">\r\n";

            set_error_handler(function () {});
            $sent = mail($to, $subject, $htmlBody, $headers);
            restore_error_handler();
        }

        return $sent;
    }

    private function sendSmtp($to, $subject, $htmlBody) {
        $boundary = md5(uniqid(mt_rand(), true));

        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "Content-type: text/html; charset=utf-8\r\n";
        $headers .= "From: " . $this->fromName . " <" . $this->from . ">\r\n";
        $headers .= "Reply-To: " . $this->from . "\r\n";

        $body = $headers . "\r\n" . $htmlBody;

        try {
            $useTls = $this->encryption === 'tls';
            $useSsl = $this->encryption === 'ssl';

            if ($useSsl) {
                $address = 'ssl://' . $this->host;
            } else {
                $address = $this->host;
            }

            set_error_handler(function () {});
            $socket = fsockopen($address, $this->port, $errno, $errstr, 15);
            restore_error_handler();

            if (!$socket) {
                error_log("Mailer: Connection failed to $address:{$this->port} - $errstr ($errno)");
                return false;
            }

            $this->smtpRead($socket);
            $this->smtpCommand($socket, "EHLO " . gethostname());

            if ($useTls) {
                $this->smtpCommand($socket, "STARTTLS");
                stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
                $this->smtpCommand($socket, "EHLO " . gethostname());
            }

            $this->smtpCommand($socket, "AUTH LOGIN");
            $this->smtpCommand($socket, base64_encode($this->username));
            $this->smtpCommand($socket, base64_encode($this->password));
            $this->smtpCommand($socket, "MAIL FROM:<{$this->from}>");
            $this->smtpCommand($socket, "RCPT TO:<$to>");
            $this->smtpCommand($socket, "DATA");
            fwrite($socket, $body . "\r\n.\r\n");
            $this->smtpRead($socket);
            $this->smtpCommand($socket, "QUIT");

            fclose($socket);
            return true;
        } catch (Exception $e) {
            error_log("Mailer: SMTP error - " . $e->getMessage());
            return false;
        }
    }

    private function smtpRead($socket) {
        $response = '';
        while ($line = fgets($socket, 512)) {
            $response .= $line;
            if (substr($line, 3, 1) === ' ') {
                break;
            }
        }
        return $response;
    }

    private function smtpCommand($socket, $command) {
        fwrite($socket, $command . "\r\n");
        return $this->smtpRead($socket);
    }
}
