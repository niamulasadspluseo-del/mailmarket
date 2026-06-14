<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\ProductFilterService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function __construct(
        private ProductFilterService $filterService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $products = $this->filterService->filter($request->all());

        return response()->json([
            'products' => ProductResource::collection($products),
            'meta' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
            ],
        ]);
    }

    public function show(Product $product): JsonResponse
    {
        $product->load('seller', 'category');

        return response()->json([
            'product' => new ProductResource($product),
        ]);
    }

    public function store(StoreProductRequest $request): JsonResponse
    {
        $product = Product::create([
            ...$request->validated(),
            'seller_id' => auth()->id(),
            'image' => $request->image ?? 'https://picsum.photos/seed/new-product/800/600',
        ]);

        return response()->json([
            'product' => new ProductResource($product),
        ], 201);
    }

    public function update(Request $request, Product $product): JsonResponse
    {
        if ($product->seller_id !== auth()->id() && !auth()->user()->isAdmin()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $product->update($request->only([
            'title', 'description', 'category_id', 'price',
            'stock', 'image', 'delivery_type',
        ]));

        return response()->json([
            'product' => new ProductResource($product->fresh()),
        ]);
    }

    public function destroy(Product $product): JsonResponse
    {
        if ($product->seller_id !== auth()->id() && !auth()->user()->isAdmin()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $product->delete();

        return response()->json(['message' => 'Product deleted']);
    }

    public function featured(): JsonResponse
    {
        $products = Product::with('seller', 'category')
            ->featured()
            ->orderBy('sales', 'desc')
            ->take(4)
            ->get();

        return response()->json([
            'products' => ProductResource::collection($products),
        ]);
    }

    public function trending(): JsonResponse
    {
        $products = Product::with('seller', 'category')
            ->trending()
            ->orderBy('sales', 'desc')
            ->take(8)
            ->get();

        return response()->json([
            'products' => ProductResource::collection($products),
        ]);
    }

    public function related(Product $product): JsonResponse
    {
        $related = Product::with('seller', 'category')
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->inRandomOrder()
            ->take(4)
            ->get();

        return response()->json([
            'products' => ProductResource::collection($related),
        ]);
    }
}
