<?php

namespace App\Controller;

use App\Entity\Attachment;
use App\Entity\Notification;
use App\Entity\Project;
use App\Entity\Ticket;
use App\Entity\User;
use App\Repository\NotificationRepository;
use App\Repository\ProjectRepository;
use App\Repository\TicketRepository;
use App\Repository\UserRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class TicketController extends AbstractController
{



    #[Route('/projects/{projectId}/tickets/add', name: 'add_ticket', methods: ['POST'])]
    public function addTicket(Request $request, ManagerRegistry $doctrine, ProjectRepository $projectRepository, int $projectId): JsonResponse
    {

        // Get the project entity from the database
        $project = $projectRepository->find($projectId);

        // If the project doesn't exist, return a 404 response
        if (!$project) {
            return $this->json(['status'=> 'error','message' => 'Project not found']);
        }

        $data = json_decode($request->getContent(), true);

        // Récupérer les entités User
        $createdBy = $doctrine->getRepository(User::class)->find($data['createdById']);


        // Créer une nouvelle instance de l'entité Ticket
        $ticket = new Ticket();
        $ticket->setTitle($data['title']);
        $ticket->setDescription($data['description']);
        $ticket->setStatus("Requested");
        $ticket->setPriority($data['priority']);
        $ticket->setProject($project);
        $ticket->setCreatedBy($createdBy);

       /* // Gérer les fichiers
    $uploadedFiles = $request->files->all();
    $fileEntities = [];

    foreach ($uploadedFiles as $uploadedFile) {
        // Créer une nouvelle instance de l'entité File
        $file = new File();

        // Générer un nom de fichier unique
        $fileName = md5(uniqid()) . '.' . $uploadedFile->getClientOriginalExtension();

        // Déplacer le fichier téléchargé vers le répertoire de stockage
        $uploadedFile->move($this->getParameter('files_directory'), $fileName);

        // Configurer les propriétés de l'entité File
        $file->setFilename($fileName);
        $file->setTicket($ticket);

        // Ajouter l'entité File à la liste des entités à enregistrer
        $fileEntities[] = $file;
    }*/




        // Sauvegarder le ticket en base de données
        $entityManager = $doctrine->getManager();
        $entityManager->persist($ticket);
        $entityManager->flush();

        return $this->json(['status'=> 'success','message' => $ticket->getId()]);
    }

    #[Route('/api/projects/tickets/{ticketId}/uploadAttachments', name: 'ticket_uploadAttachments', methods: ['POST'])]
    public function uploadAttachments(Request $request, ManagerRegistry $doctrine, TicketRepository $ticketRepository,UserRepository $userRepository, int $ticketId,UserInterface $user): JsonResponse
    {
        $em = $doctrine->getManager();

        // Get the ticket entity from the database
        $ticket = $ticketRepository->find($ticketId);
        $email = $user->getUserIdentifier();
        $uploadedBy = $userRepository->findOneBy(['email' => $email]);

        // If the ticket doesn't exist, return a 404 response
        if (!$ticket) {
            return $this->json(['status'=> 'error','message' => 'ticket not found']);
        }



        $files = $request->files->get('files');

        // Define the directory to save the files in
        $directory = $this->getParameter('kernel.project_dir') . '/public/attachments/';

        // Create the directory if it doesn't exist
        if (!is_dir($directory)) {
            mkdir($directory, 0777, true);
        }

        // Save each file to the specified directory
        foreach ($files as $index => $file) {
            $fileDisplayName = $file->getClientOriginalName();
            $fileName = md5(uniqid()) . '.' . $file->getClientOriginalExtension();

            $attachment = new Attachment();
            $attachment->setCreatedAt(new \DateTimeImmutable());
            $attachment->setTicket($ticket);
            $attachment->setName($fileName);
            $attachment->setDisplayName($fileDisplayName);
            $attachment->setUploadedBy($uploadedBy);
            $attachment->setMimeType($file->getMimeType());
            $em->persist($attachment);
            $file->move($directory, $fileName);
        }
        $em->flush();

        return $this->json(['status'=> 'success','message' => 'attachments uploaded successfully']);
    }


    #[Route('/attachments/{attachment}', name: 'api_attachment_download', methods: ['GET'])]
    public function download(string $attachment)
    {
        $attachmentPath = $this->getParameter('kernel.project_dir') . '/public/attachments/' . $attachment;

        if (!file_exists($attachmentPath)) {
            return $this->json(['status'=> 'error','message' => 'Attachment not found']);
        }

        $response = new BinaryFileResponse($attachmentPath);
        $response->setContentDisposition(ResponseHeaderBag::DISPOSITION_ATTACHMENT, 'attachmentFileName.ext');
        return $response;
    }
    #[Route('/projects/{id}/tickets', name: 'display_ticket', methods: ['GET'])]
    public function getProjectTickets(int $id,NormalizerInterface $normalizer,ProjectRepository $projectRepository): JsonResponse
    {
        // Get the project entity from the database
        $project = $projectRepository->find($id);

        // If the project doesn't exist, return a 404 response
        if (!$project) {
            return $this->json(['status' => 'error', 'message' => 'Project not found']);
        }

        // Get the tickets associated with the project
        $tickets = $project->getTickets();

        foreach ($tickets as $ticket) {
            $ticket->setNbrComments($ticket->getComments()->count());
            $ticket->setNbrAttachements($ticket->getAttachments()->count());
        }

        // Return a JSON response with the tickets
        $json=$normalizer->normalize($tickets, 'json' ,['groups'=>'tickets']);

        return new JsonResponse($json, 200, []);
    }

    #[Route('/projects/{projectId}/tickets/updateStatus', name: 'editStatus_ticket', methods: ['POST'])]
    public function updateStatusTicket(Request $request, ManagerRegistry $doctrine, ProjectRepository $projectRepository, TicketRepository $ticketRepository, int $projectId): JsonResponse
    {

        $project = $projectRepository->find($projectId);


        if (!$project) {
            return $this->json(['status'=> 'error','message' => 'Project not found']);
        }

        $em = $doctrine->getManager();
        $tickets = json_decode($request->getContent(), true);

        foreach ($tickets as $ticketData) {
            $ticket = $ticketRepository->find($ticketData['id']);
            $ticket->setTitle($ticketData['title']);
            $ticket->setDescription($ticketData['description']);
            $ticket->setPriority($ticketData['priority']);
            $ticket->setStatus($ticketData['status']);
            $em->persist($ticket);
        }

        $em->flush();


        return $this->json(['status'=> 'success','message' => 'status updated ']);
    }


    #[Route('/ticket/{id}', name: 'getTicket', methods: ['GET'])]
    public function getTicket(int $id,TicketRepository $ticketRepository,NormalizerInterface $normalizer ): Response
    {
        $ticket = $ticketRepository->find($id);
        if (!$ticket) {
            return new JsonResponse(['status' => 'error', 'message' => 'ticket not found'],201, []);
        }
        $json=$normalizer->normalize($ticket, 'json' ,['groups'=>'ticket']);
        return new JsonResponse($json, 200, []);
    }



    #[Route('/projects/tickets/assign', name: 'assign_ticket', methods: ['PUT'])]
    public function assignTicket(Request $request,ManagerRegistry $doctrine,UserRepository $userRepository, TicketRepository $ticketRepository, NormalizerInterface $normalizer): Response
    {
        $body = json_decode($request->getContent(), true);
        $ticket = $ticketRepository->find($body['ticketId']);

        if (!$ticket) {
            return new JsonResponse(['status' => 'error', 'message' => 'ticket not found'],201, []);
        }
        $member = $userRepository->find($body['memberId']);
        if (!$member) {
            return new JsonResponse(['status' => 'error', 'message' => 'member not found'],201, []);
        }
        $ticket->setAssignedTo($member);
        $doctrine->getManager()->flush();



        //notification
        $em = $doctrine->getManager();
        $notification = new Notification();
        $notification->addDestination($member);
        $notification->setContenu("You have been assigned to ticket #" . $ticket->getId());
        $notification->setCreatedAt(new \DateTimeImmutable());
        $notification->setVu(0);
        $notification->setType('ticket');
        $notification->setLink($ticket->getId());

        $em->persist($notification);
        $em->flush();



        return $this->json(['status'=> 'success','message' => 'ticket updated successfully']);
    }






}




