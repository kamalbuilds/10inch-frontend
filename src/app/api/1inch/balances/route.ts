import { NextRequest, NextResponse } from 'next/server';

// 1inch API configuration
const ONE_INCH_API_KEY = process.env.NEXT_PUBLIC_ONE_INCH_API_KEY || '';
const ONE_INCH_BASE_URL = 'https://api.1inch.dev';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const chainId = searchParams.get('chainId');
        const walletAddress = searchParams.get('walletAddress');
        const contractAddresses = searchParams.get('contractAddresses');

        if (!chainId || !walletAddress) {
            return NextResponse.json(
                { error: 'Missing required parameters: chainId and walletAddress' },
                { status: 400 }
            );
        }

        // Build URL with optional contract addresses
        let url = `${ONE_INCH_BASE_URL}/balance/v1.2/${chainId}/balances/${walletAddress}`;
        if (contractAddresses) {
            url += `?contractAddresses=${contractAddresses}`;
        }

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

        const balances = await response.json();

        return NextResponse.json(balances);

    } catch (error) {
        console.error('Error fetching balances:', error);

        return NextResponse.json(
            {
                error: 'Failed to fetch balances',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
} 