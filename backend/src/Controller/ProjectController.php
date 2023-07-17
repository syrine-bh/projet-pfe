<?php

namespace App\Controller;

use App\Entity\Notification;
use App\Entity\Project;
use App\Entity\Ticket;
use App\Entity\User;
use App\Repository\ProjectRepository;
use App\Repository\UserRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;


class ProjectController extends AbstractController
{
    #[Route('/projects/{userId}', name: 'app_project', methods:"GET")]
    public function index(int $userId,UserRepository $userRepository,ProjectRepository $projectRepository,NormalizerInterface $normalizer): JsonResponse
    {
        $user = $userRepository->find($userId);
        $projects=[];
        if(in_array("ROLE_MEMBRE",$user->getRoles())){
            $projects = $user->getMemberProjects();
        }
        if(in_array("ROLE_CLIENT",$user->getRoles())){
            $projects = $user->getClientProjects();
        }
        if(in_array("ROLE_GESTIONNAIRE",$user->getRoles())){
            $projects = $user->getgestionnaireProjects();
        }
        if(in_array("ROLE_ADMIN",$user->getRoles())){
            $projects=$projectRepository->findAll();
        }

        foreach ($projects as $project){
            $nbrTotalComments = 0;
            $doneTickets = array_filter($project->getTickets()->toArray(),function (Ticket $ticket) {
                    return $ticket->getStatus() == 'Done';
            });
            $project->setNbrTicketDone(count($doneTickets));
            $project->setNbrTicketsTotal($project->getTickets()->count());
            foreach ($project->getTickets() as $ticket){
                $nbrTotalComments += $ticket->getComments()->count();
            }
            $project->setNbrComments($nbrTotalComments);
        }

        $json=$normalizer->normalize($projects, 'json' ,['groups'=>'projects']);
        return new JsonResponse($json, 200, []);
    }

    #[Route('/addProject', name: 'addProject', methods: ['POST'])]
    public function addProject(ManagerRegistry $doctrine, UserRepository $userRepository,ProjectRepository $projectRepository,Request $request): Response
    {
        $em = $doctrine->getManager();
        $decoded = json_decode($request->getContent(), true);

        $title = $decoded['title'] ?? null;
        $description = $decoded['description'] ?? null;
        $gitRepo = $decoded['gitRepo'] ?? null;
        $startdate = $decoded['startdate'] ?? null;
        $deadline = $decoded['deadline'] ?? null;
        $gestionnaireId = $decoded['gestionnaireId'] ?? null;
        $clients = $decoded['clients'] ?? [];
        $members = $decoded['members'] ?? [];

        if (!$title) {
            return $this->json(['status'=> 'error','message' => 'Please provide a title']);
        }

        if (!$description) {
            return $this->json(['status'=> 'error','message' => 'Please provide a description']);
        }
        if (!$gitRepo) {
            return $this->json(['status'=> 'error','message' => 'Please provide a git']);
        }

        if (!$startdate) {
            return $this->json(['status'=> 'error','message' => 'Please provide a start date']);
        }

        if (!$deadline) {
            return $this->json(['status'=> 'error','message' => 'Please provide a deadline']);
        }

        if (!$gestionnaireId) {
            return $this->json(['status'=> 'error','message' => 'Please provide a gestionnaire']);
        }

        if (empty($clients)) {
            return $this->json(['status'=> 'error','message' => 'Please provide at least one client']);
        }

        if (empty($members)) {
            return $this->json(['status'=> 'error','message' => 'Please provide at least one member']);
        }

        $project = new Project();
        $project->setTitle($title);
        $project->setDescription($description);
        $project->setGitRepo($gitRepo);
        $project->setStartDate(new \DateTimeImmutable($startdate));
        $project->setDeadline(new \DateTimeImmutable($deadline));

        $gestionnaire = $userRepository->find($gestionnaireId);

        if (!$gestionnaire) {
            return $this->json(['status'=> 'error','message' => 'Gestionnaire not found']);
        }
        $project->setGestionnaire($gestionnaire);

        foreach ($clients as $client) {
            $user = $userRepository->find($client['id']);
            if (!$user) {
                return $this->json(['status'=> 'error','message' => 'Client not found']);
            }
            $project->addClient($user);
        }

        foreach ($members as $member) {
            $user = $userRepository->find($member['id']);
            if (!$user) {
                return $this->json(['status'=> 'error','message' => 'Member not found']);
            }

            $project->addMember($user);
        }

        $em->persist($project);
        $em->flush();

        //notification
        $em = $doctrine->getManager();

        $notification = new Notification();
        // Send notification to members
        foreach ($members as $member) {
            $user = $userRepository->find($member['id']);
            if (!$user) {return $this->json(['status'=> 'error','message' => 'Member not found']); }
            $notification->addDestination($user);
        }


        foreach ($clients as $client) {
            $user = $userRepository->find($client['id']);
            if (!$user) {return $this->json(['status'=> 'error','message' => 'Client not found']);}
            $notification->addDestination($user);
        }

        $notification->setContenu("You have been added to the project: " . $project->getTitle());
        $notification->setCreatedAt(new \DateTimeImmutable());
        $notification->setVu(0);
        $notification->setType('project');
        $notification->setLink($project->getId());

        $em->persist($notification);
        $em->flush();



        return $this->json(['status'=> 'success','message' => 'Project added successfully']);
    }

    #[Route('/project/delete/{id}', name: 'project_delete', methods:"DELETE")]
    public function deleteApi(int $id,ProjectRepository $projectRepository,ManagerRegistry $doctrine): JsonResponse
    {

        $project = $projectRepository->find($id);

        if($project){
            $em =$doctrine->getManager();
            $em->remove($project);
            $em->flush();
            return new JsonResponse([
                'message' => 'project deleted successfully',
            ], 200);
        }

        return new JsonResponse([
            'message' => 'project not found',
        ], 404);
    }
    #[Route('/updateProject/{id}', name: 'updateProject', methods: ['PUT'])]
    public function updateProject(ManagerRegistry $doctrine,NormalizerInterface $normalizer, UserRepository $userRepository, ProjectRepository $projectRepository, Request $request, $id): Response
    {
        $em = $doctrine->getManager();
        $decoded = json_decode($request->getContent(), true);

        $title = $decoded['title'] ?? null;
        $description = $decoded['description'] ?? null;
        $startdate = $decoded['startdate'] ?? null;
        $deadline = $decoded['deadline'] ?? null;
        $gestionnaireId = $decoded['gestionnaireId'] ?? null;
        $clients = $decoded['clients'];
        $members = $decoded['members'];


        if (!$title) {
            return $this->json(['status'=> 'error','message' => 'Please provide a title']);
        }

        if (!$description) {
            return $this->json(['status'=> 'error','message' => 'Please provide a description']);
        }

        if (!$startdate) {
            return $this->json(['status'=> 'error','message' => 'Please provide a start date']);
        }

        if (!$deadline) {
            return $this->json(['status'=> 'error','message' => 'Please provide a deadline']);
        }

        if (!$gestionnaireId) {
            return $this->json(['status'=> 'error','message' => 'Please provide a gestionnaire']);
        }

        if (empty($clients)) {
            return $this->json(['status'=> 'error','message' => 'Please provide at least one client']);
        }

        if (empty($members)) {
            return $this->json(['status'=> 'error','message' => 'Please provide at least one member']);
        }

        $project = $projectRepository->find($id);

        if (!$project) {
            return $this->json(['status'=> 'error','message' => 'Project not found']);
        }

        $project->setTitle($title);
        $project->setDescription($description);
        $project->setStartDate(new \DateTimeImmutable($startdate));
        $project->setDeadline(new \DateTimeImmutable($deadline));

        $gestionnaire = $userRepository->find($gestionnaireId);

        if (!$gestionnaire) {
            return $this->json(['status'=> 'error','message' => 'Gestionnaire not found']);
        }

        $project->setGestionnaire($gestionnaire);

        /*$project->removeClients();
        $project->removeMembers();

        foreach ($clients as $client) {
            $user = $userRepository->find($client['id']);
            if (!$user) {
                return $this->json(['status'=> 'error','message' => 'Client not found']);
            }
            $project->addClient($user);
        }

        foreach ($members as $member) {
            $user = $userRepository->find($member['id']);
            if (!$user) {
                return $this->json(['status'=> 'error','message' => 'Member not found']);
            }
            $project->addMember($user);
        }*/
        $project->removeClients();
        $project->removeMembers();

        foreach ($clients as $client) {
            $user = $userRepository->find($client['id']);
            if (!$user) {
                return $this->json(['status'=> 'error','message' => 'Client not found']);
            }
            $project->addClient($user);
        }

        foreach ($members as $member) {
            $user = $userRepository->find($member['id']);
            if (!$user) {
                return $this->json(['status'=> 'error','message' => 'Member not found']);
            }
            $project->addMember($user);
        }

        $em->flush();

        $projectRepository->save($project,true);
        return $this->json(['status'=> 'success','message' => 'Project updated successfully']);
    }


    #[Route('/project/{id}', name: 'getProject', methods: ['GET'])]
    public function getProject(int $id,ProjectRepository $projectRepository,NormalizerInterface $normalizer ): Response
    {
        $project = $projectRepository->find($id);
        if (!$project) {
            return new JsonResponse(['status' => 'error', 'message' => 'Project not found'],201, []);
        }
        $json=$normalizer->normalize($project, 'json' ,['groups'=>'projects']);
        return new JsonResponse($json, 200, []);
    }





    #[Route('/projects/{id}/members', name: 'project_members', methods: ['GET'])]
    public function getProjectMembers(int $id, UserRepository $userRepository, NormalizerInterface $normalizer, Request $request): JsonResponse
    {
        $page = $request->query->getInt('page', 1);
        $perPage = $request->query->getInt('perPage', 10);
        $offset = ($page - 1) * $perPage;



        $members = $userRepository->getPaginatedProjectMembers($id,$offset,$perPage);

        $totalUsers = count($members);

        $normalizedUsers = $normalizer->normalize($members, 'json', ['groups' => 'post:read']);

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





    /*#[Route('/projects/{id}/members', name: 'project_members', methods: ['GET'])]
    public function getProjectMembers(Project $project, UserRepository $userRepository, NormalizerInterface $normalizer, Request $request): JsonResponse
    {
        $page = $request->query->getInt('page', 1);
        $perPage = $request->query->getInt('perPage', 10);
        $offset = ($page - 1) * $perPage;

        $members = [];
        foreach ($project->getMembers() as $member) {
            $members[] = [
                'id' => $member->getId(),
                'name' => $member->getFirstname(),
                'email' => $member->getEmail(),
            ];
        }

        $totalUsers = count($members);
        $paginatedUsers = array_slice($members, $offset, $perPage);
        $normalizedUsers = $normalizer->normalize($paginatedUsers, 'json', ['groups' => 'post:read']);

        $pagination = [
            'page' => $page,
            'per_page' => $perPage,
            'total_pages' => ceil($totalUsers / $perPage),
            'total_users' => $totalUsers,
            'offset' => $offset
        ];
        $json['pagination'] = $pagination;
        $json['members'] = $members;
        $json['users'] = $normalizedUsers;

        return new JsonResponse($json, 200, []);
    }
*/
}