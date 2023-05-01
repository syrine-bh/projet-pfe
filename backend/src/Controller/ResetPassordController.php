<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\Mailer;
use Symfony\Component\Mailer\Transport;
use Symfony\Component\Mime\Email;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;


use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\ResetPassword;
use Symfony\Component\HttpFoundation\JsonResponse;
use Doctrine\Persistence\ManagerRegistry;
use App\Repository\UserRepository;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Csrf\TokenGenerator\TokenGeneratorInterface;
class ResetPassordController extends AbstractController
{
    #[Route('/sendVerificationCode', name: 'api_sendVerificationCode',methods: ['PUT'])]
    public function sendVerificationCode(Request $request, UserRepository $userRepository, ManagerRegistry $doctrine)
    {
        $decoded = json_decode($request->getContent());
        $email = $decoded->email;
        if(!$email){return $this->json(['status'=> 'error','message' => 'please provide email']);}


        $verificationCode = rand(100000, 1000000); //generer le code de verification composé de 6 chiffres
        $em = $doctrine->getManager();
        $user = $userRepository->findOneBy(['email' => $email]); //recuperer l'utilisateur avec l'email

        if (!$user){
            return $this->json(['status' => 'error', 'message' => 'User not found']);
        }
        if ($user->getIsActive()==0){
            return $this->json(['status' => 'error', 'message' => 'User is inactive ']);
        }
        $user->setVerificationCode($verificationCode); //modifier le code dans la base
        $em->flush();

        //envoyer le code de verifiaction par mail (un compte microsoft , le bundle mailer ne fonctionne pas avec les comptes gmail)
        $transport = Transport::fromDsn('smtp://stagepfe2023@outlook.com:sbh18051998@smtp.office365.com:587');
        $mailer = new Mailer($transport);
        $mail = (new Email());
        $mail->from('stagepfe2023@outlook.com');
        $mail->to($email);
        $mail->subject('Activate account code');
        $mail->html(body: "<div>Voici le code d'activation de votre compte : " . $verificationCode . " </div>");
        $mailer->send($mail);

        return $this->json(['status' => 'success', 'message' => 'Email sent Successfully']);


    }

    #[Route('/verifyCode', name: 'api_verifyCode',methods: ['POST'])]
    public function verifyCode(Request $request, UserRepository $userRepository, ManagerRegistry $doctrine)
    {

        $decoded = json_decode($request->getContent());
        $email = $decoded->email;
        $code = $decoded->code;

        if(!$email){return $this->json(['status'=> 'error','message' => 'please provide email']);}
        if(!$code){return $this->json(['status'=> 'error','message' => 'please provide code']);}



        $user = $userRepository->findOneBy(['email' => $email]);
        //verifier le code envoyé est correct ou pas
        if ($user->getVerificationCode() == $code) {
            return $this->json(['status' => 'success', 'message' => 'correct code']);
        }

        return $this->json(['status' => 'error', 'message' => 'incorrect code,try again']);
    }

    #[Route('/resetPassword', name: 'api_resetPassword',methods: ['PUT'])]
    public function resetPassword(Request $request, UserRepository $userRepository, ManagerRegistry $doctrine, UserPasswordHasherInterface $passwordHasher)
    {

        $decoded = json_decode($request->getContent());
        $email = $decoded->email;
        $code = $decoded->code;
        $newPlainTextPassword = $decoded->password;

        $em = $doctrine->getManager();
        $user = $userRepository->findOneBy(['email' => $email]);

        if (!$user){
            return $this->json(['error' => 'success', 'message' => 'user not found']);
        }

        if($code == $user->getVerificationCode()){
            $newhashedPassword = $passwordHasher->hashPassword($user,$newPlainTextPassword);
            $user->setPassword($newhashedPassword);
            $em->flush();
            return $this->json(['error' => 'success', 'message' => 'password updated successfully']);
        }

        return $this->json(['error' => 'error', 'message' => 'incorrect code']);






    }
}



