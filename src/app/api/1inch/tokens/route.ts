import { NextRequest, NextResponse } from 'next/server';

// 1inch API configuration
const ONE_INCH_API_KEY = process.env.NEXT_PUBLIC_ONE_INCH_API_KEY || '';
const ONE_INCH_BASE_URL = 'https://api.1inch.dev';

const ONE_INCH_CHAINS = {
    ETHEREUM: 1,
    BSC: 56,
    POLYGON: 137,
    OPTIMISM: 10,
    ARBITRUM: 42161,
    AVALANCHE: 43114,
} as const;

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const chainId = searchParams.get('chainId') || '1';
        const provider = searchParams.get('provider') || '1inch';
        const country = searchParams.get('country') || 'US';

        // Validate chain ID
        const chainIdNum = parseInt(chainId);
        const validChainIds = Object.values(ONE_INCH_CHAINS);
        if (!validChainIds.includes(chainIdNum as typeof validChainIds[number])) {
            return NextResponse.json(
                { error: 'Invalid chain ID' },
                { status: 400 }
            );
        }

        // Call 1inch API directly
        const response = await fetch(`${ONE_INCH_BASE_URL}/token/v1.2/${chainIdNum}`, {
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

        // Add additional query parameters to the response for reference
        const responseData = {
            tokens,
            metadata: {
                chainId: chainIdNum,
                provider,
                country,
                totalTokens: Object.keys(tokens).length,
                timestamp: new Date().toISOString()
            }
        };

        return NextResponse.json(responseData);

    } catch (error) {
        console.error('Error fetching tokens:', error);

        return NextResponse.json(
            {
                error: 'Failed to fetch tokens',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
