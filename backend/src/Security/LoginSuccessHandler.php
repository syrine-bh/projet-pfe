<?php
namespace App\Security;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

class LoginSuccessHandler implements AuthenticationSuccessHandlerInterface
{
    private $jwtManager;

    public function __construct(JWTTokenManagerInterface $jwtManager)
    {
        $this->jwtManager = $jwtManager;
    }


    public function onAuthenticationSuccess(Request $request, TokenInterface $token): Response
    {
        // Get the authenticated user
        $user = $token->getUser();

        // Generate the JWT token
        $token = $this->jwtManager->create($user);


        // Return the user data and the JWT token as a JSON response
        return new JsonResponse([
            "id"=>$user->getId(),
            "firstname"=>$user->getFirstname(),
            "lastname"=>$user->getLastname(),
            "email"=>$user->getEmail(),
            "phoneNumber"=>$user->getPhoneNumber(),
            "getIsActive"=>$user->getIsActive(),
            "isVerified"=>$user->getIsVerified(),
            "roles"=>$user->getRoles(),
            'token' => $token,
        ],200);
    }
}