<?php

namespace App\Repository;

use App\Entity\Appointment;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends AbstractRepository<Appointment>
 *
 * @method Appointment|null find($id, $lockMode = null, $lockVersion = null)
 * @method Appointment|null findOneBy(array $criteria, array $orderBy = null)
 * @method Appointment[]    findAll()
 * @method Appointment[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AppointmentRepository extends AbstractRepository
{
    private $queryBuilder;

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Appointment::class);
        $this->queryBuilder = $this->createQueryBuilder('a');
    }

    public function save(Appointment $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Appointment $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function getClientAppointments(string $personalNumber, \DateTimeInterface $currentDateTime): array
    {
        return $this->queryBuilder
            ->where('a.personal_number = :personalNumber')
            ->andWhere('a.time > :currentDateTime')
            ->setParameter('personalNumber', $personalNumber)
            ->setParameter('currentDateTime', $currentDateTime)
            ->getQuery()
            ->getResult();
    }

    public function findByPersonalNumber(int $personalNumber)
    {
        return parent::findByLike($this->queryBuilder, 'personal_number', $personalNumber);
    }

    public function findByName(string $name)
    {
        return parent::findByLike($this->queryBuilder, 'name', $name);
    }

    public function findByDateRange(?string $dateFrom, ?string $dateTo)
    {
        if ($dateFrom && $dateTo) {
            $this->queryBuilder->andWhere('a.time BETWEEN :date_from AND :date_to')
                ->setParameter('date_from', new \DateTime($dateFrom))
                ->setParameter('date_to', new \DateTime($dateTo));
        } else if ($dateFrom) {
            $this->queryBuilder->andWhere('a.time >= :date_from')
                ->setParameter('date_from', new \DateTime($dateFrom));
        } else if ($dateTo) {
            $this->queryBuilder->andWhere('a.time <= :date_to')
                ->setParameter('date_to', new \DateTime($dateTo));
        }

        return $this->queryBuilder->getQuery()->getResult();
    }

    public function pagination($currentPage, $perPage)
    {
        return parent::findPaginatedResults($currentPage, $perPage);
    }

    public function countData()
    {
        return parent::getCount($this->queryBuilder);
    }

    //    /**
    //     * @return Appointment[] Returns an array of Appointment objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('a')
    //            ->andWhere('a.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('a.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Appointment
    //    {
    //        return $this->createQueryBuilder('a')
    //            ->andWhere('a.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
