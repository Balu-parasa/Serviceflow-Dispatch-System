<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\App;

class SetLocale
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $locale = $request->header('Accept-Language');

        if (!$locale) {
            $locale = $request->input('locale', 'en');
        }

        // Support only en, hi, te
        if (in_array($locale, ['en', 'hi', 'te'])) {
            App::setLocale($locale);
        }

        return $next($request);
    }
}
