<?php

namespace App\Service;

class PaginationService
{
    public function paginate(array $data, int $currentPage, int $perPage): array
    {
        $totalItems = count($data);
        $totalPages = max(ceil($totalItems / $perPage), 1);
        $currentPage = max(min($currentPage, $totalPages), 1);
        $offset = ($currentPage - 1) * $perPage;

        $paginatedData = array_slice($data, $offset, $perPage);

        return [
            'entity' => $paginatedData,
            'pagination' => [
                'current_page' => $currentPage,
                'total_pages' => $totalPages,
                'total_items' => $totalItems,
                'per_page' => $perPage,

            ],
        ];
    }
}
