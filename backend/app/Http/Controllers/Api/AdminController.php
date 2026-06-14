<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Http\Resources\ProductResource;
use App\Http\Resources\ReviewResource;
use App\Http\Resources\UserResource;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function dashboard(): JsonResponse
    {
        $totalRevenue = Order::where('status', 'completed')->sum('total_amount');
        $totalUsers = User::count();
        $totalProducts = Product::count();
        $totalReviews = Review::count();

        $sellers = User::where('role', 'seller')->get();
        $pendingSellers = $sellers->where('approved', false);

        $monthly = collect(range(0, 5))->map(fn($i) => [
            'month' => now()->subMonths(5 - $i)->format('M'),
            'revenue' => rand(8000, 14000) + $i * 1500,
        ]);

        $catData = \App\Models\Category::withCount('products')
            ->get()
            ->filter(fn($c) => $c->products_count > 0)
            ->map(fn($c) => [
                'name' => $c->name,
                'value' => $c->products_count,
            ]);

        return response()->json([
            'stats' => [
                'revenue' => round($totalRevenue, 2),
                'users' => $totalUsers,
                'products' => $totalProducts,
                'reviews' => $totalReviews,
            ],
            'sellers' => UserResource::collection($sellers),
            'pending_sellers_count' => $pendingSellers->count(),
            'monthly_revenue' => $monthly,
            'category_distribution' => $catData,
        ]);
    }

    public function users(): JsonResponse
    {
        $users = User::orderBy('created_at', 'desc')->get();

        return response()->json([
            'users' => UserResource::collection($users),
        ]);
    }

    public function approveSeller(User $user): JsonResponse
    {
        if ($user->role !== 'seller') {
            return response()->json(['message' => 'User is not a seller'], 422);
        }

        $user->update(['approved' => !$user->approved]);

        return response()->json([
            'user' => new UserResource($user),
            'message' => $user->approved ? 'Seller approved' : 'Approval revoked',
        ]);
    }

    public function deleteUser(User $user): JsonResponse
    {
        if ($user->isAdmin()) {
            return response()->json(['message' => 'Cannot delete admin'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted']);
    }

    public function reviews(): JsonResponse
    {
        $reviews = Review::with('user', 'product')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'reviews' => ReviewResource::collection($reviews),
        ]);
    }

    public function deleteReview(Review $review): JsonResponse
    {
        $product = $review->product;
        $review->delete();

        $product->reviews_count = $product->reviews()->count();
        $product->rating = $product->reviews_count > 0
            ? round($product->reviews()->avg('rating'), 1)
            : 0;
        $product->save();

        return response()->json(['message' => 'Review deleted']);
    }
}
