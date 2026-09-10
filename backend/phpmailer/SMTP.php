<?php
namespace PHPMailer\PHPMailer;

/**
 * PHPMailer RFC-compliant SMTP implementation.
 */
class SMTP
{
    const VERSION = '6.9.1';
    const CRLF = "\r\n";
    const DEFAULT_PORT = 25;
    const MAX_LINE_LENGTH = 998;
    const DEBUG_OFF = 0;
    const DEBUG_CLIENT = 1;
    const DEBUG_SERVER = 2;
    const DEBUG_CONNECTION = 3;
    const DEBUG_LOWLEVEL = 4;

    public $do_debug = self::DEBUG_OFF;
    public $Debugoutput = 'echo';
    public $do_verp = false;
    public $Timeout = 300;
    public $Timelimit = 300;

    protected $smtp_conn;
    protected $error = ['error' => '', 'detail' => '', 'smtp_code' => '', 'smtp_code_ex' => ''];
    protected $helo_rply;
    protected $server_caps;
    protected $last_reply = '';

    public function connect($host, $port = null, $timeout = 30, $options = [])
    {
        $this->setError('');
        if ($this->connected()) {
            $this->setError('Already connected to a server');
            return false;
        }
        if (empty($port)) {
            $port = self::DEFAULT_PORT;
        }

        $socket_context = stream_context_create($options);
        set_error_handler([$this, 'errorHandler']);
        $this->smtp_conn = stream_socket_client(
            $host . ':' . $port,
            $errno,
            $errstr,
            $timeout,
            STREAM_CLIENT_CONNECT,
            $socket_context
        );
        restore_error_handler();

        if (!is_resource($this->smtp_conn)) {
            $this->setError(
                'Failed to connect to server',
                '',
                (string) $errno,
                $errstr
            );
            return false;
        }

        stream_set_timeout($this->smtp_conn, $timeout, 0);
        $announce = $this->get_lines();
        return true;
    }

    public function startTLS()
    {
        if (!$this->sendCommand('STARTTLS', 'STARTTLS', 220)) {
            return false;
        }

        $crypto_method = STREAM_CRYPTO_METHOD_TLS_CLIENT;
        if (defined('STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT')) {
            $crypto_method |= STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT;
            $crypto_method |= STREAM_CRYPTO_METHOD_TLSv1_1_CLIENT;
        }

        set_error_handler([$this, 'errorHandler']);
        $crypto_ok = stream_socket_enable_crypto(
            $this->smtp_conn,
            true,
            $crypto_method
        );
        restore_error_handler();

        return (bool) $crypto_ok;
    }

    public function authenticate($user, $pass, $authtype = null)
    {
        if (!$this->sendCommand('AUTH LOGIN', 'AUTH LOGIN', 334)) {
            return false;
        }
        if (!$this->sendCommand('User', base64_encode($user), 334)) {
            return false;
        }
        if (!$this->sendCommand('Password', base64_encode($pass), 235)) {
            return false;
        }
        return true;
    }

    public function connected()
    {
        if (is_resource($this->smtp_conn)) {
            $sock_status = stream_get_meta_data($this->smtp_conn);
            if ($sock_status['eof']) {
                $this->close();
                return false;
            }
            return true;
        }
        return false;
    }

    public function close()
    {
        $this->setError('');
        $this->server_caps = null;
        $this->helo_rply = null;
        if (is_resource($this->smtp_conn)) {
            fclose($this->smtp_conn);
            $this->smtp_conn = null;
        }
    }

    public function data($msg_data)
    {
        if (!$this->sendCommand('DATA', 'DATA', 354)) {
            return false;
        }

        $lines = explode("\n", str_replace(["\r\n", "\r"], "\n", $msg_data));
        $field = substr($lines[0], 0, strpos($lines[0], ':'));
        $in_headers = false;
        if (!empty($field) && strpos($field, ' ') === false) {
            $in_headers = true;
        }

        foreach ($lines as $line) {
            $lines_out = [];
            if ($in_headers && $line === '') {
                $in_headers = false;
            }
            while (isset($line[self::MAX_LINE_LENGTH])) {
                $pos = strrpos(substr($line, 0, self::MAX_LINE_LENGTH), ' ');
                if (!$pos) {
                    $pos = self::MAX_LINE_LENGTH - 1;
                    $lines_out[] = substr($line, 0, $pos);
                    $line = substr($line, $pos);
                } else {
                    $lines_out[] = substr($line, 0, $pos);
                    $line = substr($line, $pos + 1);
                }
                if ($in_headers) {
                    $line = "\t" . $line;
                }
            }
            $lines_out[] = $line;

            foreach ($lines_out as $line_out) {
                if (!empty($line_out) && $line_out[0] === '.') {
                    $line_out = '.' . $line_out;
                }
                $this->client_send($line_out . self::CRLF);
            }
        }

        $savetimelimit = $this->Timelimit;
        $this->Timelimit = $this->Timeout;
        $result = $this->sendCommand('DATA END', '.', 250);
        $this->Timelimit = $savetimelimit;

        return $result;
    }

    public function hello($host = '')
    {
        return $this->sendHello('EHLO', $host) or $this->sendHello('HELO', $host);
    }

    protected function sendHello($hello, $host)
    {
        $noerror = $this->sendCommand($hello, $hello . ' ' . $host, 250);
        $this->helo_rply = $this->last_reply;
        if ($noerror) {
            $this->parseHelloFields($hello);
        } else {
            $this->server_caps = null;
        }
        return $noerror;
    }

    protected function parseHelloFields($type)
    {
        $this->server_caps = [];
        $lines = explode("\n", $this->helo_rply);
        foreach ($lines as $n => $s) {
            $s = trim(substr($s, 4));
            if (empty($s)) {
                continue;
            }
            $fields = explode(' ', $s);
            if (!empty($fields)) {
                if (!$n) {
                    $name = $type;
                    $fields = $fields[0];
                } else {
                    $name = array_shift($fields);
                    switch ($name) {
                        case 'SIZE':
                            $fields = isset($fields[0]) ? $fields[0] : 0;
                            break;
                        case 'AUTH':
                            if (!is_array($fields)) {
                                $fields = [];
                            }
                            break;
                        default:
                            $fields = true;
                    }
                }
                $this->server_caps[$name] = $fields;
            }
        }
    }

    public function mail($from)
    {
        return $this->sendCommand('MAIL FROM', 'MAIL FROM:<' . $from . '>', 250);
    }

    public function quit($close_on_error = true)
    {
        $noerror = $this->sendCommand('QUIT', 'QUIT', 221);
        $err = $this->error;
        if ($noerror || $close_on_error) {
            $this->close();
            $this->error = $err;
        }
        return $noerror;
    }

    public function recipient($address, $dsn = '')
    {
        return $this->sendCommand('RCPT TO', 'RCPT TO:<' . $address . '>', [250, 251]);
    }

    public function sendCommand($commandName, $command, $expect)
    {
        if (!$this->connected()) {
            $this->setError("Called $commandName() without being connected");
            return false;
        }

        $this->client_send($command . self::CRLF, $commandName);
        $this->last_reply = $this->get_lines();
        $matches = [];
        if (preg_match('/^([0-9]{3})[ -](?:([0-9]\\.[0-9]\\.[0-9]{1,2}) )?/', $this->last_reply, $matches)) {
            $code = (int) $matches[1];
            $code_ex = isset($matches[2]) ? $matches[2] : null;
            $detail = preg_replace(
                "/{$code}[ -]" . ($code_ex ? str_replace('.', '\\.', $code_ex) . ' ' : '') . '/m',
                '',
                $this->last_reply
            );
        } else {
            $code = (int) substr($this->last_reply, 0, 3);
            $code_ex = null;
            $detail = substr($this->last_reply, 4);
        }

        $this->setError('', $detail, (string) $code, $code_ex);

        if (!is_array($expect)) {
            $expect = [$expect];
        }

        if (in_array($code, $expect, true)) {
            return true;
        }

        $this->setError(
            "$commandName command failed",
            $detail,
            (string) $code,
            $code_ex
        );
        return false;
    }

    protected function client_send($data, $commandName = '')
    {
        return fwrite($this->smtp_conn, $data);
    }

    public function getLastError()
    {
        return $this->error;
    }

    public function getServerExtList()
    {
        return $this->server_caps;
    }

    public function getServerExt($name)
    {
        if (!$this->server_caps) {
            $this->setError('No HELO/EHLO was sent');
            return null;
        }
        if (!array_key_exists($name, $this->server_caps)) {
            if ($name === 'HELO') {
                return $this->server_caps['EHLO'];
            }
            if ($name === 'EHLO') {
                return $this->server_caps['HELO'];
            }
            return null;
        }
        return $this->server_caps[$name];
    }

    protected function get_lines()
    {
        if (!is_resource($this->smtp_conn)) {
            return '';
        }
        $data = '';
        $endtime = 0;
        stream_set_timeout($this->smtp_conn, $this->Timeout);
        if ($this->Timelimit > 0) {
            $endtime = time() + $this->Timelimit;
        }
        $selR = [$this->smtp_conn];
        $selW = null;
        while (is_resource($this->smtp_conn) && !feof($this->smtp_conn)) {
            set_error_handler([$this, 'errorHandler']);
            $n = stream_select($selR, $selW, $selW, $this->Timelimit);
            restore_error_handler();

            if ($n === false) {
                break;
            }
            if (!$n) {
                $this->setError('SMTP timeout occurred');
                break;
            }
            $str = @fgets($this->smtp_conn, 515);
            $data .= $str;
            if (isset($str[3]) && $str[3] === ' ') {
                break;
            }
            $info = stream_get_meta_data($this->smtp_conn);
            if ($info['timed_out']) {
                $this->setError('SMTP timeout occurred');
                break;
            }
            if ($endtime && time() > $endtime) {
                $this->setError('SMTP timeout occurred');
                break;
            }
        }
        return $data;
    }

    protected function setError($message, $detail = '', $smtp_code = '', $smtp_code_ex = '')
    {
        $this->error = [
            'error' => $message,
            'detail' => $detail,
            'smtp_code' => $smtp_code,
            'smtp_code_ex' => $smtp_code_ex,
        ];
    }

    protected function errorHandler($errno, $errmsg, $errfile = '', $errline = 0)
    {
        $this->setError('Connection failed.', $errmsg, (string) $errno);
    }
}

