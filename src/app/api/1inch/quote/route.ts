import { NextRequest, NextResponse } from 'next/server';

// 1inch API configuration
const ONE_INCH_API_KEY = process.env.NEXT_PUBLIC_ONE_INCH_API_KEY || '';
const ONE_INCH_BASE_URL = 'https://api.1inch.dev';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const srcChain = searchParams.get('srcChain');
        const dstChain = searchParams.get('dstChain');
        const srcTokenAddress = searchParams.get('srcTokenAddress');
        const dstTokenAddress = searchParams.get('dstTokenAddress');
        const amount = searchParams.get('amount');
        const walletAddress = searchParams.get('walletAddress');

        if (!srcChain || !dstChain || !srcTokenAddress || !dstTokenAddress || !amount || !walletAddress) {
            return NextResponse.json(
                { error: 'Missing required parameters: srcChain, dstChain, srcTokenAddress, dstTokenAddress, amount, and walletAddress' },
                { status: 400 }
            );
        }

        // Build URL with all parameters
        const params = new URLSearchParams();
        params.append('srcChain', srcChain);
        params.append('dstChain', dstChain);
        params.append('srcTokenAddress', srcTokenAddress);
        params.append('dstTokenAddress', dstTokenAddress);
        params.append('amount', amount);
        params.append('walletAddress', walletAddress);

        // Use Fusion Plus API endpoint for cross-chain quotes
        const url = `${ONE_INCH_BASE_URL}/fusion-plus/quoter/v1.0/quote/receive?${params.toString()}`;

        // Call 1inch Fusion Plus API directly
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${ONE_INCH_API_KEY}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`1inch Fusion Plus API error: ${response.status} ${response.statusText}`);
        }

        const quote = await response.json();

        return NextResponse.json(quote);

    } catch (error) {
        console.error('Error fetching Fusion Plus quote:', error);

        return NextResponse.json(
            {
                error: 'Failed to fetch Fusion Plus quote',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
} 