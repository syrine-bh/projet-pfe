<?php

namespace App\Entity;

use App\Repository\CommentRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: CommentRepository::class)]
class Comment
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["comments"])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(["comments"])]
    private ?string $content = null;

    #[ORM\Column(length: 255)]
    #[Groups(["comments"])]
    private ?string $type = null;

    #[ORM\Column]
    #[Groups(["comments"])]
    private ?\DateTimeImmutable $createdAt = null;



    #[ORM\ManyToOne(targetEntity: Ticket::class, inversedBy: 'comments')]
    private ?Ticket $ticket = null;
    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'comment')]
    #[Groups(["comments"])]
    private ?User $addedBy = null;



    /**
     * @return null
     */
    public function getTicket()
    {
        return $this->ticket;
    }

    /**
     * @param null $ticket
     */
    public function setTicket($ticket): void
    {
        $this->ticket = $ticket;
    }



    public function getId(): ?int
    {
        return $this->id;
    }

    public function getContent(): ?string
    {
        return $this->content;

    }

    public function setContent(string $content): self
    {
        $this->content = $content;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getAddedBy(): ?User
    {
        return $this->addedBy;
    }

    public function setAddedBy(?User $addedBy): self
    {
        $this->addedBy = $addedBy;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getType(): ?string
    {
        return $this->type;
    }

    /**
     * @param string|null $type
     */
    public function setType(?string $type): void
    {
        $this->type = $type;
    }


}