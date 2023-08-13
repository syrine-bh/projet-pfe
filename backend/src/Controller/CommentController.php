<?php

namespace App\Controller;

use App\Entity\Comment;
use App\Entity\Notification;
use App\Entity\Ticket;
use App\Repository\TicketRepository;
use App\Repository\UserRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Doctrine\ORM\EntityManagerInterface;

class CommentController extends AbstractController
{


    #[Route('/ticket/{ticketId}/comment/add', name: 'add_comment', methods: ['POST'])]
    public function addComment(ManagerRegistry $doctrine ,Request $request,NormalizerInterface $normalizer, EntityManagerInterface $entityManager, UserRepository $userRepository ,TicketRepository $ticketRepository, int $ticketId): JsonResponse
    {
        $ticket = $ticketRepository->find($ticketId);
        if (!$ticket) {
            return $this->json(['status'=> 'error','message' => 'ticket not found']);
        }

        $data = json_decode($request->getContent(), true);
        $addedBy = $userRepository->find($data['addedById']);
        $comment = new Comment();
        $comment->setAddedBy($addedBy);
        $comment->setTicket($ticket);
        $comment->setType($data['type']);
        $comment->setContent($data['content']);
        $comment->setCreatedAt(new \DateTimeImmutable("now"));

        $entityManager->persist($comment);
        $entityManager->flush();





        //notification
        $em = $doctrine->getManager();

        $notification = new Notification();
        $members = $userRepository->getProjectMembers($ticket->getProject()->getId());

        foreach ($members as $member) { $notification->addDestination($member); }
        // Set the notification content
        $notification->setContenu($addedBy->getEmail()." added a comment on the ticket ");

        $notification->setCreatedAt(new \DateTimeImmutable());
        $notification->setVu(0);
        $notification->setType('ticket');
        $notification->setLink($ticketId);

        $em->persist($notification);
        $em->flush();



        $json=$normalizer->normalize($comment, 'json' ,['groups'=>'comments']);
        return $this->json($json);
    }

    #[Route('/tickets/{ticketId}/comments', name: 'ticket_comments')]
    public function comments(Ticket $ticket,NormalizerInterface $normalizer ,TicketRepository $ticketRepository, int $ticketId): JsonResponse
    {
        $ticket = $ticketRepository->find($ticketId);
        if (!$ticket) {
            return $this->json(['status'=> 'error','message' => 'ticket not found']);
        }
        $comments = $ticket->getComments();


        $json=$normalizer->normalize($comments, 'json' ,['groups'=>'comments']);
        return new JsonResponse($json, 200, []);
    }
}