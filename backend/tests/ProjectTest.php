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


class ProjectTest extends \PHPUnit\Framework\TestCase{

    private function createClient(string $firstname,Request $request): User
    {
        $client = new User();
        $client->setFirstname($firstname);
        $client->setRoles(['ROLE_CLIENT']);

        return $client;
    }
    public function testAddProject(Request $request)
    {
        $client = static::createClient();

        // Create a new user to act as the client
        $user = $this->createClient('John', new Request());

        // Log in the client user
        $client->login($user);

        $data = [
            'title' => 'My Project',
            'description' => 'This is a test project',
            'gitRepo' => 'https://github.com/myaccount/myproject',
            'startdate' => '2023-05-10',
            'deadline' => '2023-06-10',
            'gestionnaireId' => 1,
            'clients' => [
                ['id' => 2],
                ['id' => 3],
            ],
            'members' => [
                ['id' => 4],
                ['id' => 5],
            ],
        ];

        $client->Request('POST', '/addProject', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode($data));

        $this->assertEquals(200, $client->getResponse()->getStatusCode());

        $responseData = json_decode($client->getResponse()->getContent(), true);
        $this->assertEquals('success', $responseData['status']);
        $this->assertEquals('Project added successfully', $responseData['message']);
    }


}
