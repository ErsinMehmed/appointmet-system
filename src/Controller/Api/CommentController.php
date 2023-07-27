<?php

namespace App\Controller;

use App\Service\CommentService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;

class CommentController extends AbstractController
{
    /**
     * Store function
     *
     * @param \App\Services\CommentService $createManagerService
     * @param \Symfony\Component\HttpFoundation\Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    #[Route('/comments', name: 'add_comment', methods: 'POST')]
    public function store(CommentService $createManagerService, Request $request): Response
    {
        $commentData = $request->request->all();
        $comment = $createManagerService->create($commentData);

        if (is_array($comment)) {
            $comment = (object)$comment;
        }

        if (count($comment->errors)) {
            return $this->json(['errors' => $comment->errors], 400);
        }

        if (!$comment) {
            return $this->json(404);
        }

        return $this->json('Comment has been added successfully!');
    }

    /**
     * Update function
     *
     * @param \App\Services\CommentService $updateManagerService
     * @param \Symfony\Component\HttpFoundation\Request $request
     * @param int $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    #[Route('/comments/{id}', name: 'comment_update', methods: 'PUT')]
    public function update(CommentService $updateManagerService, Request $request, int $id): Response
    {
        $commentData = (array)json_decode($request->getContent());
        $comment = $updateManagerService->update($id, $commentData);

        if (!$comment) {
            return $this->json(404);
        }

        return $this->json('Comment has been updated successfully!');
    }

    /**
     * Destroy function
     *
     * @param \App\Services\CommentService $deleteManagerService
     * @param int $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    #[Route('/comments/{id}', name: 'comment_delete', methods: 'DELETE')]
    public function destroy(CommentService $deleteManagerService, string $id): Response
    {
        $isDeleted = $deleteManagerService->delete($id);

        if (!$isDeleted) {
            return $this->json(404);
        }

        return $this->json('Comment has been deleted successfully!');
    }
}
