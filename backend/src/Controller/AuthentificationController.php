<?php

namespace App\Controller;

use App\Entity\Notification;
use App\Repository\UserRepository;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\Mailer;
use Symfony\Component\Mailer\Transport;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\User;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;


class AuthentificationController extends AbstractController
{
    /**
     * @Route("/register", name="register", methods={"POST"})
     */
    public function register(ManagerRegistry $doctrine,
                             Request $request,
                            UserRepository $userRepository,
                             NormalizerInterface $normalizer): Response
    {

        $em = $doctrine->getManager();
        $decoded = json_decode($request->getContent());



        $firstname = $decoded->firstname;
        $lastname = $decoded->lastname;
        $email = $decoded->email;
        //$plaintextPassword = $decoded->password;
        $phoneNumber= $decoded->phoneNumber;
        $company= $decoded->company ?? null;
        $activationToken= $decoded->activationToken ?? null;


        if(!$firstname){return $this->json(['status'=> 'error','message' => 'please provide firstname']);}
        if(!$lastname){return $this->json(['status'=> 'error','message' => 'please provide lastname']);}
        if(!$email){return $this->json(['status'=> 'error','message' => 'please provide email']);}
        //if(!$plaintextPassword){return $this->json(['status'=> 'error','message' => 'please provide password']);}
        if(!$phoneNumber){return $this->json(['status'=> 'error','message' => 'please provide phoneNumber']);}


        $userWithSameEmail = $userRepository->findOneBy(['email' => $email]);
        if ($userWithSameEmail) {
            return $this->json(['status'=> 'error','message' => 'user with same email exist']);
        }

        $user = new User();

        //$hashedPassword = $passwordHasher->hashPassword($user,$plaintextPassword);

        $user->setFirstname($firstname);
        $user->setLastname( $lastname);
        $user->setPhoneNumber($phoneNumber);
        $user->setPassword("");
        $user->setEmail($email);

        $user->setIsVerified(0);
        $user->setIsActive(0);
        $user->setVerificationCode("");
        $user->setActivationToken("");

        $user->setRoles(['ROLE_MEMBRE']);
        $user->setCompany("");
        if(!$company){
            $user->setRoles(['ROLE_MEMBRE']);
            $user->setCompany("");
        }else{
            $user->setRoles(['ROLE_CLIENT']);
            $user->setCompany($company);
        }

        $em->persist($user);
        $em->flush();

        $admins = $userRepository->getUsersWithAdminRole();


        $notification = new Notification();
        foreach ($admins as $admin) {
            $notification->addDestination($admin);
        }
        $notification->setContenu("new user ");
        $notification->setType('user');
        $notification->setLink($user->getId());
        $notification->setCreatedAt(new \DateTimeImmutable());
        $notification->setVu(0);

        $em->persist($notification);
        $em->flush();


        //list of destination emails
        $destinations = [];
        foreach( $admins as $admin ){
            array_push($destinations,$admin->getEmail());
        }


        $notificationId = $notification->getId();

        $from = $this->getParameter("app.mailer_email");
        $password = $this->getParameter("app.mailer_password");

        $transport = Transport::fromDsn("smtp://$from:$password@smtp.office365.com:587");
        $mailer = new Mailer($transport);
        $mail = (new Email());
        $mail->from($from);
        $mail->to(...$destinations);
        $mail->subject('notification');
        $mail->html(body: "<div> 
        you have a new user registered to wevioo feedback! <br>
        firstname : $firstname <br>
        lastname : $lastname <br>
        email : $email <br>
        phone : $phoneNumber <br>
       <a href='http://localhost:3000/#/validateUser/$notificationId'>more details</a>  
        </div>");
        $mailer->send($mail);



        return $this->json(['status'=> 'success','message' => 'Registered Successfully']);
    }

    /**
     * @Route("/login", name="login", methods={"POST"})
     */
    public function login(Request $request,
                          UserPasswordHasherInterface $passwordHasher,
                          UserRepository $userRepository,
                          JWTTokenManagerInterface $JWTManager): Response
    {


        $decoded = json_decode($request->getContent());

        $email = $decoded->email;
        $password = $decoded->password;


        if(!$email){return new JsonResponse(['status'=> 'error','message' => 'please provide email'],201);}
        if(!$password){return new JsonResponse(['status'=> 'error','message' => 'please provide password'],201);}


        $user = $userRepository->findOneBy(['email' => $email]);
        if (!$user) {
            return new JsonResponse(['status'=> 'error','message' => 'user not found'],201);
        }

        if(!$passwordHasher->isPasswordValid($user,$password)){
            return new JsonResponse(['status'=> 'error','message' => 'password incorrect'],201);
        }

        if($user->getIsActive()==0){
            return new JsonResponse(['status'=> 'error','message' => 'user is not active'],201);
        }

        $token = $JWTManager->create($user);
        return new JsonResponse([
            "id"=>$user->getId(),
            "firstname"=>$user->getFirstname(),
            "lastname"=>$user->getLastname(),
            "email"=>$user->getEmail(),
            "phoneNumber"=>$user->getPhoneNumber(),
            "isActive"=>$user->getIsActive(),
            "isVerified"=>$user->getIsVerified(0),
            "roles"=>$user->getRoles(),
            'token' => $token,
        ],200);
    }


    /**
     * @Route(path="/logout", name="app_logout")
     * @return void
     */
    public function logout()
    {
    }



}