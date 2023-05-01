<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\Mailer;
use Symfony\Component\Mailer\Transport;
use Symfony\Component\Mime\Address;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Annotation\Route;

class MailingController extends AbstractController
{
    public function sendMail(string|Address $to,string $subject,string $body): void
    {
        $from = $this->getParameter("app.mailer_email");
        $password = $this->getParameter("app.mailer_password");

        $transport = Transport::fromDsn("smtp://$from:$password@smtp.office365.com:587");
        $mailer = new Mailer($transport);
        $mail = (new Email());
        $mail->from($from);
        $mail->to($to);
        $mail->subject($subject);
        $mail->html(body: $body);
        $mailer->send($mail);
    }
}
