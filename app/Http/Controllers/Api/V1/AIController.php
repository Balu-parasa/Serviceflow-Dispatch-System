<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AIController extends Controller
{
    /**
     * Handle Gemini conversational chat requests.
     */
    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
        ]);

        $apiKey = env('GEMINI_API_KEY') ?: 'mock-gemini-key';
        $message = $request->input('message');

        try {
            // Hit Google Gemini 1.5 Flash API
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={$apiKey}", [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => "You are an intelligent CRM chat assistant for the Schneider Industry Platform. Reply concisely and professionally to the following customer message: " . $message]
                        ]
                    ]
                ]
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $reply = $data['candidates'][0]['content']['parts'][0]['text'] ?? "I am here to assist you with your Schneider service needs.";
                return response()->json([
                    'status' => 'success',
                    'reply' => trim($reply),
                ]);
            }

            Log::error('Gemini API call failed: ' . $response->body());
            
            // Fallback response for offline or unconfigured API keys
            return response()->json([
                'status' => 'success',
                'reply' => "Thank you for contacting Schneider support. How can I help you manage your bookings, properties, or technical requests today?",
            ]);

        } catch (\Exception $e) {
            Log::error('Gemini integration exception: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Could not reach AI assistant.',
                'reply' => "I am currently performing system diagnostic checks. Please try messaging me again in a moment.",
            ], 500);
        }
    }
}
