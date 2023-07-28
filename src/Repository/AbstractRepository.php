<?php

namespace App\Repository;

use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

abstract class AbstractRepository extends ServiceEntityRepository
{
    protected function findByLike(object $queryBuilder, string $fieldName, string $data)
    {
        return $queryBuilder
            ->andWhere(
                $queryBuilder
                    ->expr()
                    ->like('a.' . $fieldName, ':' . $fieldName)
            )
            ->setParameter($fieldName, '%' . $data . '%')
            ->getQuery()
            ->getResult();
    }

    protected function findPaginatedResults($currentPage, $perPage)
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

    protected function getCount(object $queryBuilder)
    {
        return $queryBuilder
            ->select('COUNT(a.id)')
            ->getQuery()
            ->getSingleScalarResult();
    }
}
