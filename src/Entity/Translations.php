<?php

namespace App\Entity;

use App\Repository\TranslationsRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TranslationsRepository::class)]
class Translations
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'translations')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Languages $language_id = null;

    #[ORM\Column(length: 255)]
    private ?string $text = null;

    #[ORM\ManyToMany(targetEntity: Sources::class, mappedBy: 'ManyToMany')]
    private Collection $translations;

    public function __construct()
    {
        $this->translations = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getLanguageId(): ?Languages
    {
        return $this->language_id;
    }

    public function setLanguageId(?Languages $language_id): static
    {
        $this->language_id = $language_id;

        return $this;
    }

    public function getText(): ?string
    {
        return $this->text;
    }

    public function setText(string $text): static
    {
        $this->text = $text;

        return $this;
    }

    /**
     * @return Collection<int, Sources>
     */
    public function getTranslations(): Collection
    {
        return $this->translations;
    }

    public function addTranslation(Sources $translation): static
    {
        if (!$this->translations->contains($translation)) {
            $this->translations->add($translation);
            $translation->addManyToMany($this);
        }

        return $this;
    }

    public function removeTranslation(Sources $translation): static
    {
        if ($this->translations->removeElement($translation)) {
            $translation->removeManyToMany($this);
        }

        return $this;
    }
}
