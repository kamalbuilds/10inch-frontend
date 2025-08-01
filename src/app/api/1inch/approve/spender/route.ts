import { NextRequest, NextResponse } from 'next/server';

// 1inch API configuration
const ONE_INCH_API_KEY = process.env.NEXT_PUBLIC_ONE_INCH_API_KEY || '';
const ONE_INCH_BASE_URL = 'https://api.1inch.dev';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const chainId = searchParams.get('chainId');

        if (!chainId) {
            return NextResponse.json(
                { error: 'Missing required parameter: chainId' },
                { status: 400 }
            );
        }

        // Call 1inch API directly
        const response = await fetch(`${ONE_INCH_BASE_URL}/approve/v1.1/${chainId}/approve/spender`, {
            headers: {
                'Authorization': `Bearer ${ONE_INCH_API_KEY}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`1inch API error: ${response.status} ${response.statusText}`);
        }

        const spender = await response.json();

        return NextResponse.json(spender);

    } catch (error) {
        console.error('Error fetching approve spender:', error);

        return NextResponse.json(
            {
                error: 'Failed to fetch approve spender',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
} 