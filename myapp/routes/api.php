<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\PostController; // Import the PostController
use App\Http\Controllers\CommentController; // Import the CommentController

// Existing route for fetching authenticated user
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Authentication routes
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

// Post routes with authentication middleware
Route::middleware('auth:api')->group(function () {
    // Post Routes
    Route::get('posts', [PostController::class, 'index']); // Fetch all posts
    Route::get('posts/{id}', [PostController::class, 'show']); // Fetch a specific post
    Route::post('posts', [PostController::class, 'store']); // Create a new post
    Route::put('posts/{id}', [PostController::class, 'update']); // Update a specific post
    Route::delete('posts/{id}', [PostController::class, 'destroy']); // Delete a post

    // Comment Routes
    Route::post('posts/{postId}/comments', [CommentController::class, 'store']);
    Route::get('posts/{postId}/comments', [CommentController::class, 'showComments']);
    Route::put('comments/{commentId}', [CommentController::class, 'updateComment']);
    Route::delete('comments/{commentId}', [CommentController::class, 'deleteComment']);

    // Logout Route
    Route::post('logout', [AuthController::class, 'logout']); // Logout user
});

