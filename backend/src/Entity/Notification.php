<?php

namespace App\Entity;

use App\Repository\NotificationRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: NotificationRepository::class)]
class Notification
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["getNotifications"])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(["getNotifications"])]
    private ?string $type = null;

    #[ORM\Column(length: 255)]
    #[Groups(["getNotifications"])]
    private ?string $contenu = null;

    #[ORM\Column(length: 255)]
    #[Groups(["getNotifications"])]
    private ?int $link = null;

    #[ORM\Column]
    #[Groups(["getNotifications"])]
    private ?int $vu = null;

    #[ORM\Column]
    #[Groups(["getNotifications"])]
    private ?\DateTimeImmutable $createdAt = null;


    #[ORM\ManyToMany(targetEntity: User::class,mappedBy:"notifications")]
    private Collection $destinations;


    public function __construct()
    {
        $this->destinations = new ArrayCollection();
    }


    public function getDestinations(): Collection
    {
        return $this->destinations;
    }


    public function addDestination(User $destination): self
    {
        if (!$this->destinations->contains($destination)) {
            $this->destinations->add($destination);
            $destination->addNotification($this);
        }
        return $this;
    }

    public function removeDestination(User $destination): self
    {
        if ($this->destinations->removeElement($destination)) {
            // set the owning side to null (unless already changed)
            if ($destination->getNotifications()->contains($this)) {
                $destination->removeNotification($this);
            }
        }

        return $this;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getContenu(): ?string
    {
        return $this->contenu;
    }

    public function setContenu(string $contenu): self
    {
        $this->contenu = $contenu;

        return $this;
    }

    public function getVu(): ?int
    {
        return $this->vu;
    }

    public function setVu(int $vu): self
    {
        $this->vu = $vu;

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

    /**
     * @return int|null
     */
    public function getLink(): ?int
    {
        return $this->link;
    }

    /**
     * @param int|null $link
     */
    public function setLink(?int $link): void
    {
        $this->link = $link;
    }





}
