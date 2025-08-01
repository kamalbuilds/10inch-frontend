import { NextRequest, NextResponse } from 'next/server';

// 1inch API configuration
const ONE_INCH_API_KEY = process.env.NEXT_PUBLIC_ONE_INCH_API_KEY || '';
const ONE_INCH_BASE_URL = 'https://api.1inch.dev';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const chainId = searchParams.get('chainId');
        const src = searchParams.get('src');
        const dst = searchParams.get('dst');
        const amount = searchParams.get('amount');
        const from = searchParams.get('from');
        const slippage = searchParams.get('slippage');

        if (!chainId || !src || !dst || !amount || !from || !slippage) {
            return NextResponse.json(
                { error: 'Missing required parameters: chainId, src, dst, amount, from, and slippage' },
                { status: 400 }
            );
        }

        // Build URL with all parameters
        const params = new URLSearchParams();
        params.append('src', src);
        params.append('dst', dst);
        params.append('amount', amount);
        params.append('from', from);
        params.append('slippage', slippage);

        // Add optional parameters
        const optionalParams = ['includeTokensInfo', 'includeProtocols', 'includeGas', 'connectorTokens', 'complexityLevel', 'gasLimit', 'mainRouteParts', 'parts', 'gasPrice', 'disableEstimate', 'allowPartialFill', 'receiver', 'referrer', 'fee'];
        optionalParams.forEach(param => {
            const value = searchParams.get(param);
            if (value) {
                params.append(param, value);
            }
        });

        const url = `${ONE_INCH_BASE_URL}/swap/v6.0/${chainId}/swap?${params.toString()}`;

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

        const swapData = await response.json();

        return NextResponse.json(swapData);

    } catch (error) {
        console.error('Error building swap transaction:', error);

        return NextResponse.json(
            {
                error: 'Failed to build swap transaction',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
} 