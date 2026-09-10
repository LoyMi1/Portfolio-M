<?php
namespace PHPMailer\PHPMailer;

/**
 * PHPMailer - PHP email creation and transport class.
 */
class PHPMailer
{
    const CHARSET_ASCII = 'us-ascii';
    const CHARSET_ISO88591 = 'iso-8859-1';
    const CHARSET_UTF8 = 'utf-8';

    const CONTENT_TYPE_PLAINTEXT = 'text/plain';
    const CONTENT_TYPE_TEXT_HTML = 'text/html';

    const ENCRYPTION_STARTTLS = 'tls';
    const ENCRYPTION_SMTPS = 'ssl';

    public $CharSet = self::CHARSET_UTF8;
    public $ContentType = self::CONTENT_TYPE_TEXT_HTML;
    public $Encoding = '8bit';
    public $ErrorInfo = '';
    public $From = '';
    public $FromName = '';
    public $Sender = '';
    public $Subject = '';
    public $Body = '';
    public $AltBody = '';

    public $Host = 'localhost';
    public $Port = 25;
    public $SMTPSecure = '';
    public $SMTPAuth = false;
    public $Username = '';
    public $Password = '';
    public $Timeout = 300;
    public $SMTPOptions = [];

    protected $smtp = null;
    protected $to = [];
    protected $replyTo = [];
    protected $exceptions = false;

    public function __construct($exceptions = null)
    {
        if ($exceptions !== null) {
            $this->exceptions = (bool) $exceptions;
        }
    }

    public function isSMTP()
    {
        // Enforce SMTP protocol
    }

    public function setFrom($address, $name = '', $auto = true)
    {
        $this->From = trim($address);
        $this->FromName = trim($name);
        return true;
    }

    public function addAddress($address, $name = '')
    {
        $this->to[] = [trim($address), trim($name)];
        return true;
    }

    public function addReplyTo($address, $name = '')
    {
        $this->replyTo[] = [trim($address), trim($name)];
        return true;
    }

    public function isHTML($isHtml = true)
    {
        $this->ContentType = $isHtml ? self::CONTENT_TYPE_TEXT_HTML : self::CONTENT_TYPE_PLAINTEXT;
    }

    public function send()
    {
        try {
            if (empty($this->From)) {
                throw new Exception('From address is empty');
            }
            if (empty($this->to)) {
                throw new Exception('At least one recipient address is required');
            }

            return $this->postSend();
        } catch (Exception $e) {
            $this->setError($e->getMessage());
            if ($this->exceptions) {
                throw $e;
            }
            return false;
        }
    }

    protected function postSend()
    {
        $this->smtp = new SMTP();
        $this->smtp->Timeout = $this->Timeout;

        $host = $this->Host;
        $port = $this->Port;

        if ($this->SMTPSecure === self::ENCRYPTION_SMTPS && strpos($host, 'ssl://') === false) {
            $host = 'ssl://' . $host;
        }

        if (!$this->smtp->connect($host, $port, $this->Timeout, $this->SMTPOptions)) {
            throw new Exception('SMTP connect() failed: ' . json_encode($this->smtp->getLastError()));
        }

        if (!$this->smtp->hello(gethostname() ?: 'localhost')) {
            throw new Exception('SMTP HELLO failed');
        }

        if ($this->SMTPSecure === self::ENCRYPTION_STARTTLS) {
            if (!$this->smtp->startTLS()) {
                throw new Exception('SMTP STARTTLS failed: ' . json_encode($this->smtp->getLastError()));
            }
            // Re-send EHLO after TLS negotiation
            $this->smtp->hello(gethostname() ?: 'localhost');
        }

        if ($this->SMTPAuth) {
            if (!$this->smtp->authenticate($this->Username, $this->Password)) {
                throw new Exception('SMTP Authentication failed. Please check your Gmail address and 16-character App Password. Error: ' . json_encode($this->smtp->getLastError()));
            }
        }

        $sender = !empty($this->Sender) ? $this->Sender : $this->From;
        if (!$this->smtp->mail($sender)) {
            throw new Exception('MAIL FROM failed: ' . json_encode($this->smtp->getLastError()));
        }

        foreach ($this->to as $to) {
            if (!$this->smtp->recipient($to[0])) {
                throw new Exception('RCPT TO <' . $to[0] . '> failed: ' . json_encode($this->smtp->getLastError()));
            }
        }

        $header = $this->createHeader();
        $body = $this->createBody();

        if (!$this->smtp->data($header . "\r\n" . $body)) {
            throw new Exception('DATA transmission failed: ' . json_encode($this->smtp->getLastError()));
        }

        $this->smtp->quit();
        $this->smtp->close();
        return true;
    }

    protected function createHeader()
    {
        $lines = [];
        $lines[] = 'Date: ' . date('r');
        $lines[] = 'To: ' . $this->formatAddrList($this->to);

        $fromName = $this->FromName ? '=?UTF-8?B?' . base64_encode($this->FromName) . '?=' : '';
        $lines[] = 'From: ' . ($fromName ? $fromName . ' ' : '') . '<' . $this->From . '>';

        if (!empty($this->replyTo)) {
            $lines[] = 'Reply-To: ' . $this->formatAddrList($this->replyTo);
        }

        $subject = '=?UTF-8?B?' . base64_encode($this->Subject) . '?=';
        $lines[] = 'Subject: ' . $subject;
        $lines[] = 'MIME-Version: 1.0';
        $lines[] = 'Content-Type: ' . $this->ContentType . '; charset="' . $this->CharSet . '"';
        $lines[] = 'Content-Transfer-Encoding: ' . $this->Encoding;
        $lines[] = 'X-Mailer: PHPMailer-Mini-Pro/6.9.1 (https://github.com/PHPMailer/PHPMailer)';

        return implode("\r\n", $lines);
    }

    protected function createBody()
    {
        return $this->Body;
    }

    protected function formatAddrList($addrList)
    {
        $formatted = [];
        foreach ($addrList as $addr) {
            if (!empty($addr[1])) {
                $name = '=?UTF-8?B?' . base64_encode($addr[1]) . '?=';
                $formatted[] = $name . ' <' . $addr[0] . '>';
            } else {
                $formatted[] = '<' . $addr[0] . '>';
            }
        }
        return implode(', ', $formatted);
    }

    protected function setError($msg)
    {
        $this->ErrorInfo = $msg;
    }
}

