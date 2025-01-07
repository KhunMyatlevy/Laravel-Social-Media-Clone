<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $registeredData = $request->validate([
            'name' => 'required|max:55',
            'email' => 'email|required|unique:users',
            'password' => 'required|confirmed'
        ]);

        // Hash the password before saving to the database
        $registeredData['password'] = bcrypt($registeredData['password']);

        $user = User::create($registeredData);

        $accessToken = $user->createToken('authToken')->accessToken;

        return response()->json([
            'user_id' => $user->id,         // Include user ID in the response
            'user_name' => $user->name,     // Include user name in the response
            'access_token' => $accessToken // Include access token
        ], 201);
    }

 

    public function login(Request $request)
    {
        $loginData = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (!auth()->attempt($loginData)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = auth()->user(); // Retrieve the authenticated user
        $accessToken = $user->createToken('authToken')->accessToken; // Generate access token

        return response()->json([
            'user_id' => $user->id,        // Include the user's ID
            'user_name' => $user->name,    // Include the user's name (assuming the User model has a `name` field)
            'access_token' => $accessToken, // Return the access token
        ]);
    }


    public function logout(Request $request)
    {
        try {
            // Revoke the token that was used to authenticate the current request
            $request->user()->token()->revoke();

            return response()->json([
                'message' => 'Successfully logged out',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to log out',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
