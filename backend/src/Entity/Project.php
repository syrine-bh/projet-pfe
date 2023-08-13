<?php

namespace App\Entity;

use App\Repository\ProjectRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ProjectRepository::class)]
class Project
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["projects","tickets","ticket"])]

    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(["projects","tickets","ticket"])]
    private ?string $title = null;

    #[ORM\Column(length: 255)]
    #[Groups(["projects"])]
    private ?string $description = null;
    #[ORM\Column(length: 255)]
    #[Groups(["projects","ticket"])]
    private ?string $gitRepo = null;

    /**
     * @return string|null
     */
    public function getGitRepo(): ?string
    {
        return $this->gitRepo;
    }

    /**
     * @param string|null $gitRepo
     */
    public function setGitRepo(?string $gitRepo): void
    {
        $this->gitRepo = $gitRepo;
    }

    #[ORM\Column(type: Types::DATE_IMMUTABLE)]
    #[Groups(["projects"])]
    private ?\DateTimeImmutable $startdate = null;

    #[ORM\Column(type: Types::DATE_IMMUTABLE)]
    #[Groups(["projects"])]
    private ?\DateTimeImmutable $deadline = null;


    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'gestionnaireProjects')]
    #[Groups(["projects","ticket"])]
    private $gestionnaire;


    #[ORM\JoinTable(name: 'member_project')]
    #[ORM\ManyToMany(targetEntity: User::class,inversedBy:"memberProjects")]
    #[Groups(["projects"])]
    private Collection $members;

    #[ORM\JoinTable(name: 'client_project')]
    #[ORM\ManyToMany(targetEntity: User::class,inversedBy:"clientProjects")]
    #[Groups(["projects"])]
    private Collection $clients;

    #[ORM\OneToMany(mappedBy: 'project', targetEntity: Ticket::class, orphanRemoval: true)]
    private Collection $tickets;

    #[Groups(["projects"])]
    private int $nbrTicketsTotal;
    #[Groups(["projects"])]
    private int $nbrTicketDone;

    #[Groups(["projects"])]
    private int $nbrComments;
    public function __construct()
    {
        $this->members = new ArrayCollection();
        $this->clients = new ArrayCollection();
        $this->tickets = new ArrayCollection();
        $this->nbrTicketsTotal = 0;
        $this->nbrTicketDone = 0;
        $this->nbrComments = 0;
    }

    /**
     * @return int
     */
    public function getNbrTicketsTotal(): int
    {
        return $this->nbrTicketsTotal;
    }

    /**
     * @param int $nbrTicketsTotal
     */
    public function setNbrTicketsTotal(int $nbrTicketsTotal): void
    {
        $this->nbrTicketsTotal = $nbrTicketsTotal;
    }

    /**
     * @return int
     */
    public function getNbrTicketDone(): int
    {
        return $this->nbrTicketDone;
    }

    /**
     * @param int $nbrTicketDone
     */
    public function setNbrTicketDone(int $nbrTicketDone): void
    {
        $this->nbrTicketDone = $nbrTicketDone;
    }

    /**
     * @return int
     */
    public function getNbrComments(): int
    {
        return $this->nbrComments;
    }

    /**
     * @param int $nbrComments
     */
    public function setNbrComments(int $nbrComments): void
    {
        $this->nbrComments = $nbrComments;
    }



    public function getTickets(): Collection
    {
        return $this->tickets;
    }

    public function addTicket(Ticket $ticket): self
    {
        if (!$this->tickets->contains($ticket)) {
            $this->tickets->add($ticket);
            $ticket->setProject($this);
        }

        return $this;
    }

    public function removeTicket(Ticket $ticket): self
    {
        if ($this->tickets->removeElement($ticket)) {
            if ($ticket->getProject() === $this) {
                $ticket->setProject(null);
            }
        }

        return $this;
    }

    public function getClients(): Collection
    {
        return $this->clients;
    }

    public function addClient(User $client): self
    {
        if (!$this->clients->contains($client)) {
            $this->clients->add($client);
            $client->addClientProject($this);
        }

        return $this;
    }

    public function removeClient(User $client): self
    {
        if ($this->clients->removeElement($client)) {
            // set the owning side to null (unless already changed)
            if ($client->getClientProjects()->contains($this)) {
                $client->removeClientProject($this);
            }
        }

        return $this;
    }


    public function getMembers(): Collection
    {
        return $this->members;
    }

    public function addMember(User $member): self
    {
        if (!$this->members->contains($member)) {
            $this->members->add($member);
            $member->addMemberProject($this);
        }

        return $this;
    }

    public function removeMember(User $member): self
    {
        if ($this->members->removeElement($member)) {
            // set the owning side to null (unless already changed)
            if ($member->getMemberProjects()->contains($this)) {
                $member->removeMemberProject($this);
            }
        }

        return $this;
    }


    public function getGestionnaire(): ?User
    {
        return $this->gestionnaire;
    }

    public function setGestionnaire(?User $gestionnaire): self
    {
        $this->gestionnaire = $gestionnaire;

        return $this;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getStartdate(): ?\DateTimeImmutable
    {
        return $this->startdate;
    }

    public function setStartdate(\DateTimeImmutable $startdate): self
    {
        $this->startdate = $startdate;

        return $this;
    }

    public function getDeadline(): ?\DateTimeImmutable
    {
        return $this->deadline;
    }

    public function setDeadline(\DateTimeImmutable $deadline): self
    {
        $this->deadline = $deadline;

        return $this;
    }

    /**
     * @param Collection $members
     */
    public function removeMembers(): void
    {
        $this->members->clear();
        $this->members = new ArrayCollection();
    }

    /**
     * @param Collection $clients
     */
    public function removeClients(): void
    {
        $this->clients->clear();
        $this->clients = new ArrayCollection();
    }


}