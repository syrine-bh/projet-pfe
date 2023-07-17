<?php

namespace App\Controller;

use App\Entity\Ticket;
use App\Repository\ProjectRepository;
use App\Repository\TicketRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DashboardController extends AbstractController
{


    #[Route('/dashboard', name: 'app_dashboard')]

    public function DashboardAction(
        EntityManagerInterface $entityManager,
        UserRepository $userRepository,
        ProjectRepository $projectRepository,
        TicketRepository $ticketRepository
    ): JsonResponse
    {



        $barChartQuery = $entityManager->createQuery('
          SELECT u.company, COUNT(DISTINCT cp) AS projectCount
            FROM App\Entity\User u
            JOIN u.clientProjects cp
            GROUP BY u.company
        ');
        $barChartResults = $barChartQuery->getResult();

        //users
        $totalNumberUsers =  $userRepository->getUserCount();
        $totalNumberActiveUsers = $userRepository->getActiveUserCount();
        $roleDistribution = $userRepository->getUsersDistributionByRole($userRepository->findAll());

        //project
        $totalNumberProjects = $projectRepository->getProjectCount();
        $totalNumberCompletedProjects = 0;
        $projects = $projectRepository->findAll();
        foreach ($projects as $project) {

            $doneTickets = array_filter($project->getTickets()->toArray(), function (Ticket $ticket) {
                return $ticket->getStatus() == 'Done';
            });

            $nbrDoneTickets = count($doneTickets);
            $nbrTicketsTotal = $project->getTickets()->count();

            if($nbrDoneTickets == $nbrTicketsTotal && $nbrTicketsTotal!=0){
                $totalNumberCompletedProjects = $totalNumberCompletedProjects+1;
            }
        }
        $averageTicketsPerProject = $projectRepository->getAverageTicketsPerProject();

        //tickets
        $totalNumberTickets = $ticketRepository->getTicketCount();
        $totalNumberOpenTicket = $ticketRepository->getNumberOfOpenTickets();
        $totalNumberClosedTicket = $ticketRepository->getNumberOfClosedTickets();
        $ticketDistribution = $ticketRepository->getTicketDistributionByPriority();



        $dashboard = [
            'barchart' => $barChartResults,
            'totalNumberUsers'=>$totalNumberUsers,
            'totalNumberActiveUsers'=>$totalNumberActiveUsers,
            'roleDistribution'=>$roleDistribution,
            'totalNumberProjects'=>$totalNumberProjects,
            'totalNumberCompletedProjects'=>$totalNumberCompletedProjects,
            'averageTicketsPerProject'=>$averageTicketsPerProject,
            'totalNumberTickets'=>$totalNumberTickets,
            'totalNumberOpenTicket'=>$totalNumberOpenTicket,
            'totalNumberClosedTicket'=>$totalNumberClosedTicket,
            'ticketDistribution'=>$ticketDistribution,
        ];

        return new JsonResponse($dashboard);
    }





}
