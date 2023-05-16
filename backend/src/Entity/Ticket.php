<?php

namespace App\Entity;

use App\Repository\TicketRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: TicketRepository::class)]
class Ticket
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["tickets","ticket"])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(["tickets","ticket"])]
    private ?string $title = null;


    #[ORM\Column(length: 255)]
    #[Groups(["tickets","ticket"])]
    private ?string $description = null;
    #[ORM\Column(length: 255)]
    #[Groups(["tickets","ticket"])]
    private ?string $status= null;
    #[ORM\Column(length: 255)]
    #[Groups(["tickets","ticket"])]
    private ?string $priority= null;


    #[ORM\OneToMany( mappedBy: 'ticket',targetEntity: Comment::class, orphanRemoval: true)]
    private Collection $comments;

    #[Groups(["tickets","ticket"])]
    private int $nbrComments;
    #[Groups(["tickets","ticket"])]
    private int $nbrAttachements;

    public function __construct()
    {
        $this->comments = new ArrayCollection();
        $this->nbrComments = 0;
        $this->nbrAttachements = 0;
        $this->attachments = new ArrayCollection();
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

    /**
     * @return int
     */
    public function getNbrAttachements(): int
    {
        return $this->nbrAttachements;
    }

    /**
     * @param int $nbrAttachements
     */
    public function setNbrAttachements(int $nbrAttachements): void
    {
        $this->nbrAttachements = $nbrAttachements;
    }





    public function getComments(): Collection
    {
        return $this->comments;
    }

    public function addComment(Comment $comment): self
    {
        if (!$this->comments->contains($comment)) {
            $this->comments->add($comment);
            $comment->setTicket($this);
        }

        return $this;
    }

    public function removeComment(Comment $comment): self
    {
        if ($this->comments->removeElement($comment)) {
            // set the owning side to null (unless already changed)
            if ($comment->getTicket() === $this) {
                $comment->setTicket(null);
            }
        }

        return $this;
    }


    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'assignedTickets')]
    #[Groups(["tickets","ticket"])]
    private ?User $assignedTo = null;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'createdTickets')]
    #[Groups(["tickets","ticket"])]
    private ?User $createdBy = null;


    #[ORM\ManyToOne(targetEntity: Project::class, inversedBy: 'tickets')]
    #[Groups(["tickets","ticket"])]
    private ?Project $project = null;

    #[ORM\OneToMany(mappedBy: 'ticket', targetEntity: Attachment::class, orphanRemoval: true)]
    #[Groups(["ticket"])]
    private Collection $attachments;


    public function getId(): ?int
    {
        return $this->id;
    }


    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description = ''): self
    {
        $this->description = $description;

        return $this;
    }


    public function getAssignedTo(): ?User
    {
        return $this->assignedTo;
    }

    public function setAssignedTo(?User $assignedTo): self
    {
        $this->assignedTo = $assignedTo;

        return $this;
    }

    public function getCreatedBy(): ?User
    {
        return $this->createdBy;
    }

    public function setCreatedBy(?User $createdBy): self
    {
        $this->createdBy = $createdBy;

        return $this;
    }

    public function getProject(): ?Project
    {
        return $this->project;
    }

    public function setProject(?Project $project): self
    {
        $this->project = $project;

        return $this;
    }
    /**
     * @return string|null
     */
    public function getTitle(): ?string
    {
        return $this->title;
    }

    /**
     * @param string|null $title
     */
    public function setTitle(?string $title): void
    {
        $this->title = $title;
    }
    /**
     * @return string|null
     */
    public function getStatus(): ?string
    {
        return $this->status;
    }

    /**
     * @param string|null $status
     */
    public function setStatus(?string $status): void
    {
        $this->status = $status;
    }
    /**
     * @return string|null
     */
    public function getPriority(): ?string
    {
        return $this->priority;
    }

    /**
     * @param string|null $priority
     */
    public function setPriority(?string $priority): void
    {
        $this->priority = $priority;
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
            $attachment->setTicket($this);
        }

        return $this;
    }

    public function removeAttachment(Attachment $attachment): self
    {
        if ($this->attachments->removeElement($attachment)) {
            // set the owning side to null (unless already changed)
            if ($attachment->getTicket() === $this) {
                $attachment->setTicket(null);
            }
        }

        return $this;
    }
}
