export interface ProductResponse {
    product_id: number
    name: string
    description: string
    price: number
    unit: string
    image: string
    discount: number
    availability: boolean
    brand: string
    category: string
    rating: number
    reviews: ReviewResponse[]
}

export interface ReviewResponse {
    user_id: number
    rating: number
    comment: string
}

export interface OrderResponse {
    order_id: number
    user_id: number
    items: ItemResponse[]
    total_price: number
    status: string
}

export interface ItemResponse {
    product_id: number
    quantity: number
}
