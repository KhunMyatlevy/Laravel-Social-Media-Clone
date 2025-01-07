<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Comment;  // Import the Comment model
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request, $postId)
    {
        $request->validate([
            'body' => 'required',
        ]);

        $comment = Comment::create([
            'body' => $request->body,
            'user_id' => auth()->id(),
            'post_id' => $postId, // Associate the comment with the given post
        ]);

        return response()->json($comment, 201);
    }

    public function showComments($postId)
    {
        try {
            // Find the post by its ID
            $post = Post::find($postId);

            // If the post is not found, return an error message
            if (!$post) {
                return response()->json(['message' => 'Post not found'], 404);
            }

            // Get all comments associated with the post
            $comments = $post->comments()->get(); // Use ->comments() to load the related comments

            // Return the comments as a JSON response
            return response()->json($comments);

        } catch (\Exception $e) {
            // Catch any error and return the exception message as a JSON response
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function updateComment(Request $request, $commentId)
    {
        try {
            // Find the comment by its ID
            $comment = Comment::find($commentId);

            // If the comment is not found, return an error message
            if (!$comment) {
                return response()->json(['message' => 'Comment not found'], 404);
            }

            // Check if the authenticated user is the owner of the comment
            if ($comment->user_id !== auth()->id()) {
                return response()->json(['message' => 'You are not authorized to update this comment'], 403);
            }

            // Validate the incoming request data
            $request->validate([
                'body' => 'required', // The body of the comment is required to update
            ]);

            // Update the comment's body with the new data
            $comment->update([
                'body' => $request->body,
            ]);

            // Return the updated comment as a JSON response
            return response()->json($comment);
            
        } catch (\Exception $e) {
            // Catch any errors and return the exception message as a JSON response
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function deleteComment($commentId)
    {
        try {
            // Find the comment by its ID
            $comment = Comment::find($commentId);

            // If the comment is not found, return an error message
            if (!$comment) {
                return response()->json(['message' => 'Comment not found'], 404);
            }

            // Check if the authenticated user is the owner of the comment
            if ($comment->user_id !== auth()->id()) {
                return response()->json(['message' => 'You are not authorized to delete this comment'], 403);
            }

            // Delete the comment
            $comment->delete();

            // Return a success message after deletion
            return response()->json(['message' => 'Comment deleted successfully']);
            
        } catch (\Exception $e) {
            // Catch any errors and return the exception message as a JSON response
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}

