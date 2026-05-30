<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\TechnicianProfile;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $roleValue = $request->role === 'business' ? 'customer' : $request->role;
        $role = UserRole::from($roleValue);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'phone' => $request->phone,
            'role' => $role,
        ]);

        if ($role === UserRole::Technician) {
            TechnicianProfile::create([
                'user_id' => $user->id,
                'specialty' => $request->specialty ?? 'General Maintenance',
                'status' => 'offline',
            ]);
        }

        $token = $user->createToken('api')->plainTextToken;

        return response()->json([
            'user' => new UserResource($user->load('technicianProfile')),
            'token' => $token,
            'redirect' => $role->dashboardPath(),
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('api')->plainTextToken;

        return response()->json([
            'user' => new UserResource($user->load('technicianProfile')),
            'token' => $token,
            'redirect' => $user->role->dashboardPath(),
        ]);
    }

    public function google(Request $request): JsonResponse
    {
        $request->validate([
            'token' => 'required|string',
            'role' => 'nullable|string'
        ]);

        // Using verify => false to prevent local Windows cURL SSL certificate errors (cURL error 60)
        $response = \Illuminate\Support\Facades\Http::withOptions(['verify' => false])->get('https://oauth2.googleapis.com/tokeninfo', [
            'id_token' => $request->token
        ]);

        if ($response->failed() || $response->json('aud') !== env('GOOGLE_CLIENT_ID')) {
            return response()->json(['message' => 'Invalid Google token'], 401);
        }

        $payload = $response->json();

        $googleId = $payload['sub'];
        $email = $payload['email'];
        $name = $payload['name'];
        $picture = $payload['picture'] ?? null;

        $user = User::where('google_id', $googleId)->orWhere('email', $email)->first();

        if (!$user) {
            return response()->json(['message' => 'First you have to create an account.'], 403);
        } else {
            $user->update([
                'google_id' => $googleId,
                'avatar' => $user->avatar ?? $picture,
            ]);
        }

        $token = $user->createToken('api')->plainTextToken;

        return response()->json([
            'user' => new UserResource($user->load('technicianProfile')),
            'token' => $token,
            'redirect' => $user->role->dashboardPath(),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json(['message' => 'Logged out successfully.']);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => new UserResource($request->user()->load('technicianProfile')),
        ]);
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email', 'exists:users,email']
        ]);

        $otp = (string) rand(100000, 999999);

        \Illuminate\Support\Facades\DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            [
                'token' => \Illuminate\Support\Facades\Hash::make($otp),
                'created_at' => now(),
            ]
        );

        // Send premium OTP email via Gmail SMTP
        try {
            \Illuminate\Support\Facades\Mail::html("
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset='utf-8'>
                    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                </head>
                <body style='margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif;'>
                    <table role='presentation' width='100%' cellpadding='0' cellspacing='0' style='background-color: #0f172a; padding: 40px 0;'>
                        <tr>
                            <td align='center'>
                                <table role='presentation' width='560' cellpadding='0' cellspacing='0' style='background: linear-gradient(145deg, #1e293b, #0f172a); border: 1px solid rgba(99,102,241,0.2); border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px rgba(0,0,0,0.5);'>
                                    <!-- Glowing Top Bar -->
                                    <tr>
                                        <td style='height: 4px; background: linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa, #6366f1);'></td>
                                    </tr>
                                    <!-- Logo Section -->
                                    <tr>
                                        <td style='padding: 40px 40px 20px; text-align: center;'>
                                            <div style='display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 14px 18px; border-radius: 16px; margin-bottom: 16px;'>
                                                <span style='font-size: 28px; font-weight: 800; color: #ffffff; letter-spacing: -1px;'>⚡ SF</span>
                                            </div>
                                            <h1 style='margin: 12px 0 0; font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;'>ServiceFlow</h1>
                                            <p style='margin: 6px 0 0; font-size: 13px; color: #64748b; letter-spacing: 2px; text-transform: uppercase; font-weight: 600;'>Dispatch &amp; Service Platform</p>
                                        </td>
                                    </tr>
                                    <!-- Divider -->
                                    <tr>
                                        <td style='padding: 0 40px;'>
                                            <div style='height: 1px; background: linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent);'></div>
                                        </td>
                                    </tr>
                                    <!-- Main Content -->
                                    <tr>
                                        <td style='padding: 32px 40px;'>
                                            <h2 style='margin: 0 0 8px; font-size: 22px; font-weight: 700; color: #f1f5f9;'>Password Reset Request</h2>
                                            <p style='margin: 0 0 28px; font-size: 15px; color: #94a3b8; line-height: 1.7;'>We received a request to reset your password. Use the verification code below to proceed. This code expires in <strong style='color: #e2e8f0;'>60 minutes</strong>.</p>
                                            <!-- OTP Box -->
                                            <div style='text-align: center; margin: 32px 0;'>
                                                <div style='display: inline-block; background: linear-gradient(145deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1)); border: 1px solid rgba(99,102,241,0.3); border-radius: 16px; padding: 24px 40px;'>
                                                    <p style='margin: 0 0 8px; font-size: 11px; color: #6366f1; text-transform: uppercase; letter-spacing: 3px; font-weight: 700;'>Verification Code</p>
                                                    <p style='margin: 0; font-family: Courier New, monospace; font-size: 42px; font-weight: 800; letter-spacing: 8px; color: #ffffff;'>{$otp}</p>
                                                </div>
                                            </div>
                                            <!-- Security Notice -->
                                            <div style='background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.15); border-radius: 12px; padding: 16px 20px; margin-top: 24px;'>
                                                <p style='margin: 0; font-size: 13px; color: #fca5a5; line-height: 1.6;'>&#128274; <strong>Security Notice:</strong> Never share this code with anyone. ServiceFlow will never ask for your OTP via phone or chat.</p>
                                            </div>
                                        </td>
                                    </tr>
                                    <!-- Footer -->
                                    <tr>
                                        <td style='padding: 0 40px;'>
                                            <div style='height: 1px; background: linear-gradient(90deg, transparent, rgba(99,102,241,0.2), transparent);'></div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style='padding: 24px 40px 32px; text-align: center;'>
                                            <p style='margin: 0 0 4px; font-size: 12px; color: #475569;'>&copy; " . date('Y') . " ServiceFlow. All rights reserved.</p>
                                            <p style='margin: 0; font-size: 11px; color: #334155;'>Real-Time Dispatch &amp; Service Management Platform</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
            ", function ($message) use ($request) {
                $message->to($request->email)
                        ->subject('🔐 ServiceFlow — Your Password Reset Code');
            });
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('SMTP Mail send failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to send OTP email. Please check mail configuration. Error: ' . $e->getMessage(),
            ], 500);
        }

        return response()->json([
            'message' => 'Verification code sent to your email address.',
        ]);
    }

    /**
     * Verify the OTP before allowing password reset.
     * This is a mandatory gate — Step 3 (new password) is only accessible
     * after this endpoint returns verified: true.
     */
    public function verifyOtp(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email', 'exists:users,email'],
            'otp' => ['required', 'string', 'size:6'],
        ]);

        $record = \Illuminate\Support\Facades\DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (! $record) {
            return response()->json([
                'message' => 'No active password reset request found for this email.',
            ], 422);
        }

        // Check expiration (60 minutes)
        $createdAt = \Carbon\Carbon::parse($record->created_at);
        if ($createdAt->copy()->addMinutes(60)->isPast()) {
            \Illuminate\Support\Facades\DB::table('password_reset_tokens')
                ->where('email', $request->email)
                ->delete();

            return response()->json([
                'message' => 'Verification code has expired. Please request a new one.',
            ], 422);
        }

        // Verify the OTP hash
        if (! \Illuminate\Support\Facades\Hash::check($request->otp, $record->token)) {
            return response()->json([
                'message' => 'Invalid verification code. Please try again.',
            ], 422);
        }

        return response()->json([
            'message' => 'OTP verified successfully. You can now reset your password.',
            'verified' => true,
        ]);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email', 'exists:users,email'],
            'otp' => ['required', 'string', 'size:6'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $record = \Illuminate\Support\Facades\DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (! $record) {
            return response()->json([
                'message' => 'No active password reset request found for this email.',
            ], 422);
        }

        // Verify token expiration (60 minutes)
        $createdAt = \Carbon\Carbon::parse($record->created_at);
        if ($createdAt->addMinutes(60)->isPast()) {
            \Illuminate\Support\Facades\DB::table('password_reset_tokens')
                ->where('email', $request->email)
                ->delete();

            return response()->json([
                'message' => 'Verification code has expired. Please request a new one.',
            ], 422);
        }

        // Verify OTP code
        if (! \Illuminate\Support\Facades\Hash::check($request->otp, $record->token)) {
            return response()->json([
                'message' => 'Invalid verification code. Please try again.',
            ], 422);
        }

        // OTP correct — reset the password
        $user = User::where('email', $request->email)->first();
        $user->update([
            'password' => \Illuminate\Support\Facades\Hash::make($request->password),
        ]);

        // Clean up the token
        \Illuminate\Support\Facades\DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->delete();

        return response()->json([
            'message' => 'Your password has been successfully reset. You can now log in.',
        ]);
    }
}
