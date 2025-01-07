<?php

namespace App\Http\Controllers;

use App\Models\Post; // Import the Post model
use Illuminate\Http\Request; // Import the Request class to handle input data

class PostController extends Controller
{
    // Fetch all posts
    public function index()
    {
        // Get all posts from the database
        $posts = Post::all();
        // Return the posts as a JSON response
        return response()->json($posts);
    }

    // Fetch a specific post
    public function show($id)
    {
        // Find the post by its ID and include the owner (user) using the 'user' relationship
        $post = Post::with('user')->find($id);

        // If no post is found, return an error message
        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        // Return the post along with the user details
        return response()->json([
            'post' => $post,
            //'user' => $post->user // Includes the owner details
        ]);
    }

    // Create a new post
    public function store(Request $request)
    {
        try {
            // Validate the incoming request data to ensure it contains a valid title and body
            $request->validate([
                'title' => 'required|max:255', // Title is required and cannot be longer than 255 characters
                'body' => 'required', // Body is required
            ]);

            // Create a new post in the database with the data from the request
            $post = Post::create([
                'title' => $request->title,
                'body' => $request->body,
                'user_id' => auth()->id(), // Set the user_id to the ID of the authenticated user
            ]);

            // Return the created post as a JSON response with a 201 status code (created)
            return response()->json($post, 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            // If validation fails, return a custom error message with validation errors
            return response()->json([
                'error' => 'Validation error',
                'message' => $e->getMessage(),
                'details' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            // Catch any other exception and return the error message
            return response()->json([
                'error' => 'Internal Server Error',
                'message' => $e->getMessage()
            ], 500);
        }
    }


    public function update(Request $request, $id)
    {
        // Find the post by its ID
        $post = Post::find($id);

        // If no post is found, return an error message
        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        // Check if the authenticated user is the owner of the post
        if ($post->user_id !== auth()->id()) {
            return response()->json(['message' => 'You are not authorized to update this post'], 403);
        }

        // Validate the incoming request data
        $request->validate([
            'title' => 'required|max:255', // Title is required and cannot be longer than 255 characters
            'body' => 'required', // Body is required
        ]);

        // Update the post's title and body with the new data
        $post->update([
            'title' => $request->title,
            'body' => $request->body,
        ]);

        // Return the updated post as a JSON response
        return response()->json($post);
    }

    // Delete a specific post
    public function destroy($id)
    {
        // Find the post by its ID
        $post = Post::find($id);

        // If no post is found, return an error message
        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        if ($post->user_id !== auth()->id()) {
            return response()->json(['message' => 'You are not authorized to update this post'], 403);
        }

        // Delete the post from the database
        $post->delete();

        // Return a success message indicating the post was deleted
        return response()->json(['message' => 'Post deleted successfully']);
    }
}
