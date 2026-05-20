<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Models\User;
use App\Enums\UserRole;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

// 1. Home
Route::get('/', function () {
    return view('home');
})->name('home');

// 2. Booking Wizard
Route::get('/booking', function () {
    return view('booking');
})->name('booking.create');

// 3. Stateful Monolithic Auth Routes
Route::middleware('guest')->group(function () {
    Route::get('/login', function () {
        return view('login');
    })->name('login');

    Route::post('/login', function (Request $request) {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            $user = Auth::user();
            return redirect()->intended($user->role->dashboardPath());
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    });
});

Route::middleware('auth')->group(function () {
    // Logout
    Route::post('/logout', function (Request $request) {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('home');
    })->name('logout');

    // Role-based Secured Dashboards
    Route::get('/customer', function () {
        if (!Auth::user()->isCustomer()) {
            return redirect(Auth::user()->role->dashboardPath());
        }
        return view('customer');
    })->name('customer.dashboard');

    Route::get('/technician', function () {
        if (!Auth::user()->isTechnician()) {
            return redirect(Auth::user()->role->dashboardPath());
        }
        return view('technician');
    })->name('technician.dashboard');

    Route::get('/admin', function () {
        if (!Auth::user()->isAdmin()) {
            return redirect(Auth::user()->role->dashboardPath());
        }
        return view('admin');
    })->name('admin.dashboard');
});
