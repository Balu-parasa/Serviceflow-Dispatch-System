<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\FavoriteTechnician;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $ids = FavoriteTechnician::where('customer_id', $request->user()->id)->pluck('technician_id');
        $technicians = User::whereIn('id', $ids)->with('technicianProfile')->get();

        return response()->json([
            'favorites' => UserResource::collection($technicians),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate(['technician_id' => ['required', 'exists:users,id']]);

        FavoriteTechnician::firstOrCreate([
            'customer_id' => $request->user()->id,
            'technician_id' => $request->technician_id,
        ]);

        return response()->json(['message' => 'Technician added to favorites.'], 201);
    }

    public function destroy(Request $request, User $technician): JsonResponse
    {
        FavoriteTechnician::where('customer_id', $request->user()->id)
            ->where('technician_id', $technician->id)
            ->delete();

        return response()->json(['message' => 'Removed from favorites.']);
    }
}
