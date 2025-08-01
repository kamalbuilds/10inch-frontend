import { NextRequest, NextResponse } from 'next/server';

// 1inch API configuration
const ONE_INCH_API_KEY = process.env.NEXT_PUBLIC_ONE_INCH_API_KEY || '';
const ONE_INCH_BASE_URL = 'https://api.1inch.dev';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const chainId = searchParams.get('chainId');
        const query = searchParams.get('query');

        if (!chainId || !query) {
            return NextResponse.json(
                { error: 'Missing required parameters: chainId and query' },
                { status: 400 }
            );
        }

        // Call 1inch API directly
        const response = await fetch(`${ONE_INCH_BASE_URL}/token/v1.2/${chainId}/search?query=${encodeURIComponent(query)}`, {
            headers: {
                'Authorization': `Bearer ${ONE_INCH_API_KEY}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`1inch API error: ${response.status} ${response.statusText}`);
        }

        const tokens = await response.json();

        return NextResponse.json(tokens);

    } catch (error) {
        console.error('Error searching tokens:', error);

        return NextResponse.json(
            {
                error: 'Failed to search tokens',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
} 