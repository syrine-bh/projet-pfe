<?php

namespace App\Controller;

use App\Repository\UserRepository;
use DateTime;
use Doctrine\Persistence\ManagerRegistry;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\Mailer;
use Symfony\Component\Mailer\Transport;
use Symfony\Component\Mime\Email;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;
use App\Repository\NotificationRepository;
use App\Entity\Notification ;

class NotificationController extends AbstractController
{
    #[Route('/api/notifications/{id}', name: 'app_notification')]
    public function index(int $id,UserRepository $userRepository,NormalizerInterface $normalizer): JsonResponse
    {
        $user = $userRepository->find($id);
        $notifications = $user->getNotifications()->toArray();
        $reversed = array_reverse($notifications);
        $json=$normalizer->normalize($reversed, 'json' ,['groups'=>'getNotifications']);
        return new JsonResponse($json, 200, []);
    }

    #[Route('/api/notificationsForPanel/{id}', name: 'app_notificationsForPanel')]
    public function notificationsForPanel(int $id,UserRepository $userRepository,NormalizerInterface $normalizer): JsonResponse
    {
        $user = $userRepository->find($id);
        $notifications = $user->getNotifications()->toArray();
        $seenNotifications = array_filter($notifications,function (Notification $notification) { return $notification->getVu() == 0;});
        $reversed = array_reverse($seenNotifications);
        $json=$normalizer->normalize($reversed, 'json' ,['groups'=>'getNotifications']);
        return new JsonResponse($json, 200, []);
    }

    #[Route('/api/notification/update/{id}', name: 'app_update_notification')]
    public function update(int $id,ManagerRegistry $doctrine,NotificationRepository $notificationRepository): JsonResponse
    {
        $em = $doctrine->getManager();
        $notification = $notificationRepository->find($id);
        if(!$notification){
            return $this->json(['status'=> 'error','message' => 'notification does not exist']);
        }
        $notification->setVu(1);
        $em->flush();

        return $this->json(['status'=> 'success','message' => 'notification updated successfully']);
    }

    #[Route('/api/validateUser/{id}', name: 'app_validateUser', methods:"POST")]
    public function validateUser(ManagerRegistry $doctrine,int $id,Request $request,UserRepository $userRepository,UserPasswordHasherInterface $passwordHasher,MailingController $mailingController): JsonResponse
    {

        $em = $doctrine->getManager();
        $user = $userRepository->find($id);
        if(!$user){
            return $this->json(['status'=> 'error','message' => 'user does not exist']);
        }


        $decoded = json_decode($request->getContent());
        $plaintextPassword = $decoded->password;
        $hashedPassword = $passwordHasher->hashPassword($user,$plaintextPassword);

        $user->setPassword($hashedPassword);
        $activationToken = md5(uniqid());
        $user->setActivationToken($activationToken);

        $em->flush();

        $activationLink = "http://localhost:8000/activateUser/$id/$activationToken";

        $mailingController->sendMail($user->getEmail(),
            'Activation de votre account',
            "<div>Voici votre mot de passe : $plaintextPassword <br>ainsi que votre lien d'activation de votre compte : <a href='$activationLink'>activer</a> </div>"
        );



        return $this->json(['status'=> 'success','message' => 'mail sent successfully']);
    }

    #[Route('/activateUser/{id}/{token}', name: 'app_activateUser', methods:"GET")]
    public function activateUser(int $id,string $token,UserRepository $userRepository,ManagerRegistry $doctrine): Response
    {
        $em = $doctrine->getManager();
        $user = $userRepository->find($id);
        if(!$user){
            return $this->json(['status'=> 'error','message' => 'user does not exist']);
        }

        if($user->getActivationToken()!=$token){
            return $this->json(['status'=> 'error','message' => 'invalid token']);
        }


        $user->setIsActive(1);
        $em->flush();


        return $this->render("verified.html.twig");
    }



}
