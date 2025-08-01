import { NextRequest, NextResponse } from 'next/server';

// 1inch API configuration
const ONE_INCH_API_KEY = process.env.NEXT_PUBLIC_ONE_INCH_API_KEY || '';
const ONE_INCH_BASE_URL = 'https://api.1inch.dev';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const chainId = searchParams.get('chainId');
        const tokenAddress = searchParams.get('tokenAddress');
        const amount = searchParams.get('amount');

        if (!chainId || !tokenAddress) {
            return NextResponse.json(
                { error: 'Missing required parameters: chainId and tokenAddress' },
                { status: 400 }
            );
        }

        // Build URL with parameters
        const params = new URLSearchParams();
        params.append('tokenAddress', tokenAddress);
        if (amount) {
            params.append('amount', amount);
        }

        const url = `${ONE_INCH_BASE_URL}/approve/v1.1/${chainId}/approve/transaction?${params.toString()}`;

        // Call 1inch API directly
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${ONE_INCH_API_KEY}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`1inch API error: ${response.status} ${response.statusText}`);
        }

        const approveData = await response.json();

        return NextResponse.json(approveData);

    } catch (error) {
        console.error('Error fetching approve calldata:', error);

        return NextResponse.json(
            {
                error: 'Failed to fetch approve calldata',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
} 