<?php

namespace App\Controller;

use App\Service\DeleteCommentManagerService;
use App\Service\StoreCommentManagerService;
use App\Service\UpdateCommentManagerService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;

class CommentController extends AbstractController
{
    #[Route('/comment', name: 'app_comment')]
    public function index(): Response
    {
        return $this->render('comment/index.html.twig', [
            'controller_name' => 'CommentController',
        ]);
    }

    /**
     * Store function
     *
     * @param \Doctrine\Persistence\ManagerRegistry $doctrine
     * @param \Symfony\Component\HttpFoundation\Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    #[Route('/comments', name: 'add_comment', methods: 'POST')]
    public function store(StoreCommentManagerService $storeManagerService, Request $request): Response
    {
        $commentData = $request->request->all();
        $comment = $storeManagerService->storeComment($commentData);

        if (!$comment) {
            return $this->json('An error occurred while creating the comment', 400);
        }

        return $this->json('New comment has been added successfully');
    }

    /**
     * Update function
     *
     * @param \Doctrine\Persistence\ManagerRegistry $doctrine
     * @param \Symfony\Component\HttpFoundation\Request $request
     * @param int $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    #[Route('/comments/{id}', name: 'comment_update', methods: 'PUT')]
    public function update(UpdateCommentManagerService $updateManagerService, Request $request, int $id): Response
    {
        $commentData = (array)json_decode($request->getContent());
        $comment = $updateManagerService->updateComment($id, $commentData);

        if (!$comment) {
            return $this->json('No comment found', 404);
        }

        return $this->json('Comment has been updated successfully');
    }

    /**
     * Destroy function
     *
     * @param \Doctrine\Persistence\ManagerRegistry $doctrine
     * @param int $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    #[Route('/comments/{id}', name: 'comment_delete', methods: 'DELETE')]
    public function destroy(DeleteCommentManagerService $deleteManagerService, string $id): Response
    {
        $isDeleted = $deleteManagerService->destroy($id);

        if (!$isDeleted) {
            return $this->json('No comment found', 404);
        }

        return $this->json('Deleted a comment successfully');
    }
}
