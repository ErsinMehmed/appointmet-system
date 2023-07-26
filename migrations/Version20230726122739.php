<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230726122739 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE countries (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, code VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE languages (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, code VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE languages_countries (languages_id INT NOT NULL, countries_id INT NOT NULL, INDEX IDX_DC653CBD5D237A9A (languages_id), INDEX IDX_DC653CBDAEBAE514 (countries_id), PRIMARY KEY(languages_id, countries_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE sources (id INT AUTO_INCREMENT NOT NULL, language_id INT NOT NULL, text VARCHAR(255) NOT NULL, INDEX IDX_D25D65F21C9A06 (language_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE sources_translations (sources_id INT NOT NULL, translations_id INT NOT NULL, INDEX IDX_BE1180B9DD51D0F7 (sources_id), INDEX IDX_BE1180B9ACE9C349 (translations_id), PRIMARY KEY(sources_id, translations_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE translations (id INT AUTO_INCREMENT NOT NULL, language_id INT NOT NULL, text VARCHAR(255) NOT NULL, INDEX IDX_C6B7DA871C9A06 (language_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE languages_countries ADD CONSTRAINT FK_DC653CBD5D237A9A FOREIGN KEY (languages_id) REFERENCES languages (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE languages_countries ADD CONSTRAINT FK_DC653CBDAEBAE514 FOREIGN KEY (countries_id) REFERENCES countries (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE sources ADD CONSTRAINT FK_D25D65F21C9A06 FOREIGN KEY (language_id) REFERENCES languages (id)');
        $this->addSql('ALTER TABLE sources_translations ADD CONSTRAINT FK_BE1180B9DD51D0F7 FOREIGN KEY (sources_id) REFERENCES sources (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE sources_translations ADD CONSTRAINT FK_BE1180B9ACE9C349 FOREIGN KEY (translations_id) REFERENCES translations (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE translations ADD CONSTRAINT FK_C6B7DA871C9A06 FOREIGN KEY (language_id) REFERENCES languages (id)');
        $this->addSql('ALTER TABLE appointment DROP FOREIGN KEY FK_D34A04ADA23B42D');
        $this->addSql('DROP INDEX idx_d34a04ada23b42d ON appointment');
        $this->addSql('CREATE INDEX IDX_FE38F84454177093 ON appointment (room_id)');
        $this->addSql('ALTER TABLE appointment ADD CONSTRAINT FK_D34A04ADA23B42D FOREIGN KEY (room_id) REFERENCES room (id)');
        $this->addSql('ALTER TABLE comment DROP FOREIGN KEY FK_D34A04ADA23B42W');
        $this->addSql('ALTER TABLE comment CHANGE text text LONGTEXT NOT NULL');
        $this->addSql('DROP INDEX idx_d34a04ada23b42w ON comment');
        $this->addSql('CREATE INDEX IDX_9474526CE5B533F9 ON comment (appointment_id)');
        $this->addSql('ALTER TABLE comment ADD CONSTRAINT FK_D34A04ADA23B42W FOREIGN KEY (appointment_id) REFERENCES appointment (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE languages_countries DROP FOREIGN KEY FK_DC653CBD5D237A9A');
        $this->addSql('ALTER TABLE languages_countries DROP FOREIGN KEY FK_DC653CBDAEBAE514');
        $this->addSql('ALTER TABLE sources DROP FOREIGN KEY FK_D25D65F21C9A06');
        $this->addSql('ALTER TABLE sources_translations DROP FOREIGN KEY FK_BE1180B9DD51D0F7');
        $this->addSql('ALTER TABLE sources_translations DROP FOREIGN KEY FK_BE1180B9ACE9C349');
        $this->addSql('ALTER TABLE translations DROP FOREIGN KEY FK_C6B7DA871C9A06');
        $this->addSql('DROP TABLE countries');
        $this->addSql('DROP TABLE languages');
        $this->addSql('DROP TABLE languages_countries');
        $this->addSql('DROP TABLE sources');
        $this->addSql('DROP TABLE sources_translations');
        $this->addSql('DROP TABLE translations');
        $this->addSql('ALTER TABLE appointment DROP FOREIGN KEY FK_FE38F84454177093');
        $this->addSql('DROP INDEX idx_fe38f84454177093 ON appointment');
        $this->addSql('CREATE INDEX IDX_D34A04ADA23B42D ON appointment (room_id)');
        $this->addSql('ALTER TABLE appointment ADD CONSTRAINT FK_FE38F84454177093 FOREIGN KEY (room_id) REFERENCES room (id)');
        $this->addSql('ALTER TABLE comment DROP FOREIGN KEY FK_9474526CE5B533F9');
        $this->addSql('ALTER TABLE comment CHANGE text text TEXT NOT NULL');
        $this->addSql('DROP INDEX idx_9474526ce5b533f9 ON comment');
        $this->addSql('CREATE INDEX IDX_D34A04ADA23B42W ON comment (appointment_id)');
        $this->addSql('ALTER TABLE comment ADD CONSTRAINT FK_9474526CE5B533F9 FOREIGN KEY (appointment_id) REFERENCES appointment (id)');
    }
}
