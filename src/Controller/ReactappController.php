<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ReactappController extends AbstractController
{
    #[Route('/{reactRouting}', name: 'reactapp', methods: 'GET', requirements: ['reactRouting' => '^(?!api).+'], defaults: ['reactRouting' => null])]

    public function index(): Response
    {
        return $this->render('reactapp/index.html.twig');
    }
}
