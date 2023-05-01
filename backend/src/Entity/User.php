<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: UserRepository::class)]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["post:read","getNotifications","projects","tickets","comments","ticket"])]
    private ?int $id = null;
    #[ORM\Column(length: 180, unique: true)]
    #[Groups(["post:read","projects","tickets","ticket"])]
    private ?string $email = null;

    #[ORM\Column(length: 180)]
    #[Groups(["post:read","projects","tickets","ticket"])]
    private ?string $company = null;

    #[ORM\Column]
    #[Groups(["post:read","tickets","ticket"])]
    private array $roles = [];

    #[ORM\Column]
    #[Groups("post:read")]
    private ?string $password = null;



    #[ORM\Column(type: 'string', length: 100)]
    #[Groups(["post:read","getNotifications","projects","tickets","comments","ticket"])]
    private ?string $firstname  = null;
    #[ORM\Column(type: 'string', length: 100)]
    #[Groups(["post:read","getNotifications","projects","tickets","comments","ticket"])]
    private ?string $lastname  = null;
    #[ORM\Column(type: 'string', length: 100)]
    #[Groups("post:read")]
    private ?string $phoneNumber  = null;
    #[ORM\Column]
    #[Groups("post:read")]
    private ?int $isActive;



    #[ORM\Column]
    #[Groups("post:read")]
    private ?int $isVerified;
    #[ORM\Column(type: 'string', length: 100)]
    #[Groups("post:read")]
    private ?string $VerificationCode;

    #[ORM\Column(type: 'string', length: 100)]
    private ?string $activationToken;


    #[ORM\OneToMany(mappedBy: 'user', targetEntity: Notification::class, orphanRemoval: true)]
    private Collection $notifications;

    #[ORM\JoinTable(name: 'member_project')]
    #[ORM\ManyToMany(targetEntity: Project::class,inversedBy:"members" )]
    private Collection $memberProjects;

    #[ORM\JoinTable(name: 'client_project')]
    #[ORM\ManyToMany(targetEntity: Project::class,inversedBy:"clients" )]
    private Collection $clientProjects;

    #[ORM\OneToMany(targetEntity: Project::class, mappedBy: 'gestionnaire')]
    private Collection $gestionnaireProjects;

    #[ORM\OneToMany(mappedBy: 'createdBy', targetEntity: User::class, orphanRemoval: true)]
    private Collection $createdTickets;

    #[ORM\OneToMany(mappedBy: 'assignedTo', targetEntity: User::class, orphanRemoval: true)]
    private Collection $assignedTickets;


    #[ORM\OneToMany( mappedBy: 'addBy',targetEntity: Comment::class, orphanRemoval: true)]
    private $comment;

    #[ORM\OneToMany(mappedBy: 'uploadedBy', targetEntity: Attachment::class)]
    private Collection $attachments;


    /**
     * @return mixed
     */
    public function getComment()
    {
        return $this->comment;
    }

    /**
     * @param mixed $comment
     */
    public function setComment($comment): void
    {
        $this->comment = $comment;
    }

    public function __construct()
    {
        $this->notifications = new ArrayCollection();
        $this->gestionnaireProjects = new ArrayCollection();
        $this->memberProjects = new ArrayCollection();
        $this->clientProjects = new ArrayCollection();
        $this->createdTickets = new ArrayCollection();
        $this->assignedTickets = new ArrayCollection();
        $this->attachments = new ArrayCollection();
    }

    public function getAssignedTickets(): Collection
    {
        return $this->assignedTickets;
    }

    public function addAssignedTicket(Ticket $ticket): self
    {
        if (!$this->assignedTickets->contains($ticket)) {
            $this->assignedTickets->add($ticket);
        }

        return $this;
    }

    public function removeAssignedTicket(Ticket $ticket): self
    {
        $this->assignedTickets->removeElement($ticket);
        return $this;
    }

    public function getCreatedTickets(): Collection
    {
        return $this->createdTickets;
    }

    public function addCreatedTicket(Ticket $ticket): self
    {
        if (!$this->createdTickets->contains($ticket)) {
            $this->createdTickets->add($ticket);
        }

        return $this;
    }

    public function removeCreatedTicket(Ticket $ticket): self
    {
        $this->createdTickets->removeElement($ticket);
        return $this;
    }

    public function getClientProjects(): Collection
    {
        return $this->clientProjects;
    }

    public function addClientProject(Project $project): self
    {
        if (!$this->clientProjects->contains($project)) {
            $this->clientProjects->add($project);
        }

        return $this;
    }

    public function removeClientProject(Project $project): self
    {
        $this->clientProjects->removeElement($project);
        return $this;
    }


    public function getMemberProjects(): Collection
    {
        return $this->memberProjects;
    }

    public function addMemberProject(Project $project): self
    {
        if (!$this->memberProjects->contains($project)) {
            $this->memberProjects->add($project);
        }

        return $this;
    }

    public function removeMemberProject(Project $project): self
    {
        $this->memberProjects->removeElement($project);
        return $this;
    }

    /**
     * @return Collection|Project[]
     */
    public function getgestionnaireProjects(): Collection
    {
        return $this->gestionnaireProjects;
    }

    public function addGestionnaireProject(Project $project): self
    {
        if (!$this->gestionnaireProjects->contains($project)) {
            $this->gestionnaireProjects->add($project);
        }

        return $this;
    }

    public function removeGestionnaireProject(Project $project): self
    {
        $this->gestionnaireProjects->removeElement($project);

        return $this;
    }

    /**
     * @return string|null
     */
    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    /**
     * @param string|null $firstname
     */
    public function setFirstname(?string $firstname): void
    {
        $this->firstname = $firstname;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }


    /**
     * @return string|null
     */
    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    /**
     * @param string|null $lastname
     */
    public function setLastname(?string $lastname): void
    {
        $this->lastname = $lastname;
    }

    /**
     * @return string|null
     */
    public function getPhoneNumber(): ?string
    {
        return $this->phoneNumber;
    }

    /**
     * @param string|null $phoneNumber
     */
    public function setPhoneNumber(?string $phoneNumber): void
    {
        $this->phoneNumber = $phoneNumber;
    }

    /**
     * @return string|null
     */
    public function getIsVerified(): ?int
    {
        return $this->isVerified;
    }


    public function setIsVerified(?int $isVerified): void
    {
        $this->isVerified = $isVerified;
    }


    /**
     * @return null
     */
    public function getVerificationCode()
    {
        return $this->VerificationCode;
    }

    /**
     * @param null $VerificationCode
     */
    public function setVerificationCode($VerificationCode): void
    {
        $this->VerificationCode = $VerificationCode;
    }






    public function getIsActive(): int
    {
        return $this->isActive;
    }


    public function setIsActive(int $isActive): void
    {
        $this->isActive = $isActive;
    }

    /**
     * @return string|null
     */
    public function getCompany(): ?string
    {
        return $this->company;
    }

    /**
     * @param string|null $company
     */
    public function setCompany(?string $company): void
    {
        $this->company = $company;
    }

    /**
     * @return Collection<int, Notification>
     */
    public function getNotifications(): Collection
    {
        return $this->notifications;
    }

    public function addNotification(Notification $notification): self
    {
        if (!$this->notifications->contains($notification)) {
            $this->notifications->add($notification);
            $notification->setUser($this);
        }

        return $this;
    }

    public function removeNotification(Notification $notification): self
    {
        if ($this->notifications->removeElement($notification)) {
            // set the owning side to null (unless already changed)
            if ($notification->getUser() === $this) {
                $notification->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return string|null
     */
    public function getActivationToken(): ?string
    {
        return $this->activationToken;
    }

    /**
     * @param string|null $activationToken
     */
    public function setActivationToken(?string $activationToken): void
    {
        $this->activationToken = $activationToken;
    }

    /**
     * @return Collection<int, Attachment>
     */
    public function getAttachments(): Collection
    {
        return $this->attachments;
    }

    public function addAttachment(Attachment $attachment): self
    {
        if (!$this->attachments->contains($attachment)) {
            $this->attachments->add($attachment);
            $attachment->setUploadedBy($this);
        }

        return $this;
    }

    public function removeAttachment(Attachment $attachment): self
    {
        if ($this->attachments->removeElement($attachment)) {
            // set the owning side to null (unless already changed)
            if ($attachment->getUploadedBy() === $this) {
                $attachment->setUploadedBy(null);
            }
        }

        return $this;
    }



}