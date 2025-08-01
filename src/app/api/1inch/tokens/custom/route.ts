import { NextRequest, NextResponse } from 'next/server';

// 1inch API configuration
const ONE_INCH_API_KEY = process.env.NEXT_PUBLIC_ONE_INCH_API_KEY || '';
const ONE_INCH_BASE_URL = 'https://api.1inch.dev';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { chainId, addresses } = body;

        if (!chainId || !addresses || !Array.isArray(addresses)) {
            return NextResponse.json(
                { error: 'Missing required parameters: chainId and addresses array' },
                { status: 400 }
            );
        }

        // Call 1inch API directly
        const response = await fetch(`${ONE_INCH_BASE_URL}/token/v1.2/${chainId}/custom`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${ONE_INCH_API_KEY}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ addresses }),
        });

        if (!response.ok) {
            throw new Error(`1inch API error: ${response.status} ${response.statusText}`);
        }

        const tokens = await response.json();

        return NextResponse.json(tokens);

    } catch (error) {
        console.error('Error fetching custom tokens:', error);

        return NextResponse.json(
            {
                error: 'Failed to fetch custom tokens',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
} 