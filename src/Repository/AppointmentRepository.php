<?php

namespace App\Repository;

use App\Entity\Appointment;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Appointment>
 *
 * @method Appointment|null find($id, $lockMode = null, $lockVersion = null)
 * @method Appointment|null findOneBy(array $criteria, array $orderBy = null)
 * @method Appointment[]    findAll()
 * @method Appointment[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AppointmentRepository extends ServiceEntityRepository
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
        return $this->queryBuilder
            ->andWhere(
                $this->queryBuilder
                    ->expr()
                    ->like('a.personal_number', ':personal_number')
            )
            ->setParameter('personal_number', $personalNumber  . '%')
            ->getQuery()
            ->getResult();
    }

    public function findByName(string $name)
    {
        return $this->queryBuilder
            ->andWhere(
                $this->queryBuilder
                    ->expr()
                    ->like('a.name', ':name')
            )
            ->setParameter('name', '%' . $name . '%')
            ->getQuery()
            ->getResult();
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

    public function findPaginatedResults($currentPage, $perPage)
    {
        $perPage = max(1, min(100, $perPage));
        $currentPage = max(1, $currentPage);

        $queryBuilder = $this->createQueryBuilder('a');

        $offset = ($currentPage - 1) * $perPage;

        $queryBuilder
            ->setMaxResults($perPage)
            ->setFirstResult($offset);

        return $queryBuilder->getQuery()->getResult();
    }

    public function getCount()
    {
        return $this->queryBuilder
            ->select('COUNT(a.id)')
            ->getQuery()
            ->getSingleScalarResult();
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
