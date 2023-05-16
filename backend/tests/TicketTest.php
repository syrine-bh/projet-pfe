<?php
namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use App\Entity\Project;
use App\Entity\Ticket;
use App\Entity\User;
use App\Repository\ProjectRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Doctrine\Persistence\ManagerRegistry;


class TicketTest extends \PHPUnit\Framework\TestCase{

    private $container;

    /**
     * @return mixed
     */
    public function getContainer()
    {
        return $this->container;
    }

    /**
     * @param mixed $container
     */
    public function setContainer($container): void
    {
        $this->container = $container;
    }

    private function createClient(string $firstname): User
    {
        $client = new User();
        $client->setFirstname($firstname);
        $client->setRoles(['ROLE_CLIENT']);

        return $client;
    }

    protected function setUp(): void
    {
        parent::setUp();

        $client = static::createClient();
        $client = static::createClient();
        $this->container = $client->getContainer();
    }

    public function testAddTicket(): void
    {
        $client = static::createClient();

        // Get a reference to a User entity for the "createdBy" field
        $user = $this->container->get('doctrine')->getRepository(User::class)->findOneBy([]);

        // Get a reference to a Project entity for the "project" field
        $project = $this->container->get(ProjectRepository::class)->findOneBy([]);

        // Generate some test data for the ticket
        $title = 'Test ticket';
        $description = 'This is a test ticket';
        $priority = 'High';
        $createdById = $user->getId();

        // Create a new ticket request
        $ticketRequest = new Request([], [], [], [], [], [], json_encode([
            'title' => $title,
            'description' => $description,
            'priority' => $priority,
            'createdById' => $createdById,
        ]));

        // Call the addTicket function with the ticket request
        $ticketController = $this->container->get('App\Controller\TicketController');
        $response = $ticketController->addTicket($ticketRequest, $this->container->get('doctrine'), $this->container->get(ProjectRepository::class), $project->getId());

        // Check that the response is a success
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEquals('success', json_decode($response->getContent(), true)['status']);

        // Check that the ticket was added to the database
        $ticket = $this->container->get('doctrine')->getRepository(Ticket::class)->findOneBy(['title' => $title]);
        $this->assertNotNull($ticket);
        $this->assertEquals($title, $ticket->getTitle());
        $this->assertEquals($description, $ticket->getDescription());
        $this->assertEquals('Requested', $ticket->getStatus());
        $this->assertEquals($priority, $ticket->getPriority());
        $this->assertEquals($project->getId(), $ticket->getProject()->getId());
        $this->assertEquals($createdById, $ticket->getCreatedBy()->getId());
    }

}
