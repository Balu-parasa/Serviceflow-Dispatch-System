<?php

use App\Http\Controllers\Api\V1\AddressController;
use App\Http\Controllers\Api\V1\AdminController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\BookingController;
use App\Http\Controllers\Api\V1\CustomerController;
use App\Http\Controllers\Api\V1\FavoriteController;
use App\Http\Controllers\Api\V1\MessageController;
use App\Http\Controllers\Api\V1\NotificationController;
use App\Http\Controllers\Api\V1\PaymentController;
use App\Http\Controllers\Api\V1\ReviewController;
use App\Http\Controllers\Api\V1\ServiceController;
use App\Http\Controllers\Api\V1\TechnicianController;
use App\Http\Controllers\Api\V1\AIController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('register', [AuthController::class, 'register']);
        Route::post('login', [AuthController::class, 'login']);
        Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
        Route::post('reset-password', [AuthController::class, 'resetPassword']);

        Route::middleware('auth:sanctum')->group(function () {
            Route::post('logout', [AuthController::class, 'logout']);
            Route::get('me', [AuthController::class, 'me']);
        });
    });

    Route::get('services', [ServiceController::class, 'index']);
    Route::get('technicians', [TechnicianController::class, 'index']);
    Route::get('reviews', [ReviewController::class, 'index']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::apiResource('bookings', BookingController::class)->only(['index', 'store', 'show']);
        Route::get('bookings/{booking}/tracking', [BookingController::class, 'tracking']);
        Route::get('customer/dashboard', [CustomerController::class, 'dashboard'])->middleware('role:customer');
        Route::post('bookings/{booking}/status', [BookingController::class, 'updateStatus']);
        Route::post('bookings/{booking}/accept', [BookingController::class, 'accept']);
        Route::post('bookings/{booking}/reject', [BookingController::class, 'reject']);
        Route::post('bookings/{booking}/cancel', [BookingController::class, 'cancel']);

        Route::get('technician/assignments', [TechnicianController::class, 'assignments'])->middleware('role:technician');
        Route::patch('technician/status', [TechnicianController::class, 'updateStatus'])->middleware('role:technician');
        Route::post('technician/location', [TechnicianController::class, 'updateLocation'])->middleware('role:technician');
        Route::get('technician/earnings', [TechnicianController::class, 'earnings'])->middleware('role:technician');
        Route::get('technician/performance', [TechnicianController::class, 'performance'])->middleware('role:technician');

        Route::prefix('admin')->middleware('role:admin')->group(function () {
            Route::get('analytics', [AdminController::class, 'analytics']);
            Route::get('dispatch-feed', [AdminController::class, 'dispatchFeed']);
            Route::get('emergency-queue', [AdminController::class, 'emergencyQueue']);
            Route::get('fleet', [AdminController::class, 'fleet']);
            Route::post('bookings/{booking}/assign', [AdminController::class, 'assign']);
            Route::get('users', [AdminController::class, 'users']);
            Route::get('system-health', [AdminController::class, 'systemHealth']);
        });

        Route::get('bookings/{booking}/messages', [MessageController::class, 'index']);
        Route::post('bookings/{booking}/messages', [MessageController::class, 'store']);
        Route::post('bookings/{booking}/messages/read', [MessageController::class, 'markRead']);

        Route::get('notifications', [NotificationController::class, 'index']);
        Route::get('notifications/unread-count', [NotificationController::class, 'unreadCount']);
        Route::post('notifications/read-all', [NotificationController::class, 'markAllRead']);
        Route::patch('notifications/{notification}/read', [NotificationController::class, 'markRead']);

        Route::post('bookings/{booking}/pay', [PaymentController::class, 'process']);
        Route::get('payments/history', [PaymentController::class, 'history']);
        Route::get('bookings/{booking}/invoice', [PaymentController::class, 'invoice']);

        Route::post('bookings/{booking}/reviews', [ReviewController::class, 'store']);

        Route::apiResource('addresses', AddressController::class)->only(['index', 'store', 'destroy']);

        Route::get('favorites', [FavoriteController::class, 'index']);
        Route::post('favorites', [FavoriteController::class, 'store']);
        Route::delete('favorites/{technician}', [FavoriteController::class, 'destroy']);
        Route::post('ai/chat', [AIController::class, 'chat']);
    });
});
