<?php

namespace App\Controller;
use App\Repository\UserRepository;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

class UserController extends AbstractController
{
    #[Route('/api/all', name: 'app_users', methods:"GET")]
    public function All(UserRepository $userRepository,NormalizerInterface $normalizer): JsonResponse
    {
        $users=$userRepository->findAll();
        $json=$normalizer->normalize($users, 'json' ,['groups'=>'post:read']);

        return new JsonResponse($json, 200, []);
    }
   #[Route('/api/AllPaginated', name: 'app-paginated_users', methods:"GET")]
    public function AllPaginated(Request $request, UserRepository $userRepository, NormalizerInterface $normalizer): JsonResponse
    {
        // Récupération des paramètres de pagination
        $page = $request->query->getInt('page', 1);
        $perPage = $request->query->getInt('perPage', 10);
        $searchString = $request->query->get('query', "");

        // Calcul de l'offset
        $offset = ($page - 1) * $perPage;


        // Récupération des utilisateurs paginés
        if($searchString!=""){
            //$users = $userRepository->findBy([], [], $perPage, $offset);
            $queryBuilder = $userRepository->createQueryBuilder('u');
            $queryBuilder->where(
                $queryBuilder->expr()->orX(
                    $queryBuilder->expr()->like('u.firstname', ':searchString'),
                    $queryBuilder->expr()->like('u.lastname', ':searchString'),
                    $queryBuilder->expr()->like('u.email', ':searchString')
                )
            );
            $queryBuilder->setParameter('searchString', $searchString.'%');
            $users = $queryBuilder->getQuery()->getResult();

        }else{
            $users = $userRepository->findBy([], [], $perPage, $offset);
        }

        //$users = $userRepository->findBy([], [], $perPage, $offset);



        // Calcul du nombre total d'utilisateurs
        $totalUsers = $userRepository->count([]);

        // Normalisation des données
        $normalizedUsers = $normalizer->normalize($users, 'json', ['groups' => 'post:read']);

        // Ajout des informations de pagination à la réponse
        $pagination = [
            'page' => $page,
            'per_page' => $perPage,
            'total_pages' => ceil($totalUsers / $perPage),
            'total_users' => $totalUsers,
            'offset' => $offset
        ];
        $json['pagination'] = $pagination;
        $json['docs'] = $normalizedUsers;

        return new JsonResponse($json, 200, []);
    }





    /*#[Route('/users/create', name: 'app_add_user_json', methods:"POST" )]
    public function createUser (Request $request , ManagerRegistry $doctrine)
    {
        $user = new User();
        $data = json_decode($request->getContent(), true);
        
        $user->setNom($data['nom']);
        $user->setPrenom( $data['prenom']);
        $user->setEmail($data['email']);
        $user->setPassword($data['password']);
        $user->setRole($data['role']);
        $user->setVerified($data['verified']);

        $entityManager =$doctrine->getManager();
        $entityManager->persist($user);
        $entityManager->flush();

        return new JsonResponse(['message' => 'User created successfully']);
    }*/



    #[Route('/api/users/update/{id}', name: 'api_users_update', methods:"PUT")]
    public function updateApi(int $id,Request $request,UserRepository $userRepository,ManagerRegistry $doctrine, UserPasswordHasherInterface $passwordHasher): JsonResponse
    {

        if($id == null){
            return new JsonResponse([
                'status'=>'error',
                'message' => 'id not specified',
            ], 200);
        }

        $decoded = json_decode($request->getContent());
        //$data = json_decode($request->getContent(), true);
        $user = $userRepository->find($id);
        $email = $decoded->email;
        $firstname= $decoded->firstname;
        $lastname= $decoded->lastname;
        $phoneNumber= $decoded->phoneNumber;
        $roles= $decoded->roles;
        $isActive= $decoded->isActive;
        $company = $decoded->company ?? null;


        $user->setFirstname($firstname);
        $user->setLastname( $lastname);
        $user->setPhoneNumber($phoneNumber);
        $user->setEmail($email);
        $user->setRoles($roles);
        $user->setIsActive($isActive);
        
        if($company!=null){
            $user->setCompany($company);
        }

        $entityManager =$doctrine->getManager();
        $entityManager->flush();


        return new JsonResponse([
            'status'=>'success',
            'message' => 'user updated successfully',
        ], 200);


    }

    #[Route('/api/users/delete/{id}', name: 'api_users_delete', methods:"DELETE")]
    public function deleteApi(int $id,UserRepository $userRepository,ManagerRegistry $doctrine): JsonResponse
    {

        $user = $userRepository->find($id);

        if($user){
            $em =$doctrine->getManager();
            $em->remove($user);
            $em->flush();
            return new JsonResponse([
                'message' => 'user deleted successfully',
            ], 200);
        }

        return new JsonResponse([
            'message' => 'user not found',
        ], 404);
    }

    #[Route('/api/{id}/disable', name: 'user_disable', methods:"PATCH")]

    public function disableUser(User $user,ManagerRegistry $doctrine): JsonResponse
    {
        $user->setIsActive(false);
        $em =$doctrine->getManager();
        $em->persist($user);
        $em->flush();
        return new JsonResponse([
            'message' => 'user disabled',
        ], 404);


    }

    #[Route('/api/{id}/enable', name: 'user_enable', methods:"PATCH")]
    public function enableUser(User $user,ManagerRegistry $doctrine): JsonResponse
    {
        $user->setIsActive(true);
        $em =$doctrine->getManager();
        $em->persist($user);
        $em->flush();

        return new JsonResponse([
            'message' => 'user enabled',
        ], 404);    }





    #[Route('/api/user/{id}', name: 'api_user_byId', methods:"GET")]
    public function getUserById(int $id,UserRepository $userRepository,NormalizerInterface $normalizer): JsonResponse
    {
        if($id == null){
            return new JsonResponse("id not specified", 201, [], true);
        }
        $user = $userRepository->find($id);
        if(!$user){
            return new JsonResponse("user not found", 201, [], true);
        }

        $json=$normalizer->normalize($user, 'json' ,['groups'=>'post:read']);
        return new JsonResponse($json, 200, []);
    }

    #[Route('/api/modifyPassword/{id}', name: 'modify_Password', methods:"PUT")]
    public function modifyPassword(int $id,ManagerRegistry $doctrine,UserRepository $userRepository ,Request $request,  UserPasswordHasherInterface $passwordHasher)
    {
        $data = json_decode($request->getContent(), true);
        $user = $userRepository->find($id);

        if(!$user){
            return new JsonResponse(['status'=>'error','message' => 'user not found'], 200);
        }

        if (empty($data['oldPassword']) || empty($data['newPassword']) || empty($data['confirmPassword'])) {
            return new JsonResponse(['status'=>'error','message' => 'Please provide all required fields.'], 200);
        }

        if (!$passwordHasher->isPasswordValid($user, $data['oldPassword'])) {
            return new JsonResponse(['status'=>'error','message' => 'The old password is incorrect.'], 200);
        }

        if ($data['newPassword'] !== $data['confirmPassword']) {
            return new JsonResponse(['status'=>'error','message' => 'The new password fields must match.'], 200);
        }

        $newPassword = $data['newPassword'];
        $user->setPassword($passwordHasher->hashPassword($user, $newPassword));

        $em = $doctrine->getManager();
        $em->persist($user);
        $em->flush();

        return $this->json(['status' => 'success', 'message' => 'Your password has been changed ']);
    }



    #[Route('/api/AllPaginatedClients', name: 'app-paginated_clients', methods:"GET")]

    public function AllPaginatedClients(Request $request, UserRepository $userRepository, NormalizerInterface $normalizer): JsonResponse
    {
        // Récupération des paramètres de pagination
        $page = $request->query->getInt('page', 1);
        $perPage = $request->query->getInt('perPage', 10);

        // Calcul de l'offset
        $offset = ($page - 1) * $perPage;

        // Récupération des utilisateurs paginés avec le rôle "client"
        $users = $userRepository->getUsersWithClientRole();

        // Calcul du nombre total d'utilisateurs
        $totalUsers = count($users);

        // Pagination des résultats
        $users = array_slice($users, $offset, $perPage);

        // Normalisation des données
        $normalizedUsers = $normalizer->normalize($users, 'json', ['groups' => 'post:read']);

        // Ajout des informations de pagination à la réponse
        $pagination = [
            'page' => $page,
            'per_page' => $perPage,
            'total_pages' => ceil($totalUsers / $perPage),
            'total_users' => $totalUsers,
            'offset' => $offset
        ];
        $json['pagination'] = $pagination;
        $json['docs'] = $normalizedUsers;

        return new JsonResponse($json, 200, []);
    }


    #[Route('/api/AllPaginatedMembersGestionnaires', name: 'app-paginated_MembersGestionnaires', methods:"GET")]

    public function AllPaginatedMembersGestionnaires(Request $request, UserRepository $userRepository, NormalizerInterface $normalizer): JsonResponse
    {
        // Récupération des paramètres de pagination
        $page = $request->query->getInt('page', 1);
        $perPage = $request->query->getInt('perPage', 10);

        // Calcul de l'offset
        $offset = ($page - 1) * $perPage;

        // Récupération des utilisateurs paginés
        $users = $userRepository->getUsersWithMmebreGestionnaireRole();
        $totalUsers = count($users);

        // Pagination
        $users = array_slice($users, $offset, $perPage);

        // Normalisation des données
        $normalizedUsers = $normalizer->normalize($users, 'json', ['groups' => 'post:read']);

        // Ajout des informations de pagination à la réponse
        $pagination = [
            'page' => $page,
            'per_page' => $perPage,
            'total_pages' => ceil($totalUsers / $perPage),
            'total_users' => $totalUsers,
            'offset' => $offset
        ];
        $json['pagination'] = $pagination;
        $json['docs'] = $normalizedUsers;

        return new JsonResponse($json, 200, []);
    }

}

