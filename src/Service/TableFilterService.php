<?php

namespace App\Service;

class TableFilterService
{
    public function filterData(array $data, string $personalNumber, string $name, string $dateFrom, string $dateTo): array
    {
        $filteredData = [];

        foreach ($data as $item) {
            if (isset($item['personalNumber']) || isset($item['name'])) {
                $personalNumberMatch = stripos($item['personalNumber'], $personalNumber) !== false;
                $nameMatch = stripos($item['name'], $name) !== false;

                $itemDate = $item['time']->format("Y-m-d");
                $fromDateFilter = empty($dateFrom) || $itemDate >= $dateFrom;
                $toDateFilter = empty($dateTo) || $itemDate <= $dateTo;

                if ($personalNumberMatch && $nameMatch && $fromDateFilter && $toDateFilter) {
                    $filteredData[] = $item;
                }
            }
        }

        return $personalNumber || $name || $dateFrom || $dateTo ? $filteredData : $data;
    }
}
