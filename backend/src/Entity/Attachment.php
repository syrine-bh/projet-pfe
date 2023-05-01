<?php

namespace App\Entity;

use App\Repository\AttachmentRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: AttachmentRepository::class)]
class Attachment
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["ticket"])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(["ticket"])]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    #[Groups(["ticket"])]
    private ?string $displayName = null;

    #[ORM\Column(length: 255)]
    #[Groups(["ticket"])]
    private ?string $mimeType = null;

    #[ORM\ManyToOne(inversedBy: 'attachments')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Ticket $ticket = null;

    #[ORM\ManyToOne(inversedBy: 'attachments')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(["ticket"])]
    private ?User $uploadedBy = null;

    #[ORM\Column]
    #[Groups(["ticket"])]
    private ?\DateTimeImmutable $createdAt = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getDisplayName(): ?string
    {
        return $this->displayName;
    }

    public function setDisplayName(string $displayName): self
    {
        $this->displayName = $displayName;

        return $this;
    }

    public function getTicket(): ?Ticket
    {
        return $this->ticket;
    }

    public function setTicket(?Ticket $ticket): self
    {
        $this->ticket = $ticket;

        return $this;
    }

    public function getUploadedBy(): ?User
    {
        return $this->uploadedBy;
    }

    public function setUploadedBy(?User $uploadedBy): self
    {
        $this->uploadedBy = $uploadedBy;

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

    /**
     * @return string|null
     */
    public function getMimeType(): ?string
    {
        return $this->mimeType;
    }

    /**
     * @param string|null $mimeType
     */
    public function setMimeType(?string $mimeType): void
    {
        $this->mimeType = $mimeType;
    }



}
