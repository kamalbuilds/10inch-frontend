// Aptos transaction helpers for OKX wallet integration

// Convert APT amount to Octas with proper validation
export function convertAptToOctas(amount: string | number): string {
  try {
    // Convert to string if number
    const amountStr = typeof amount === 'number' ? amount.toString() : amount;
    
    // Validate input
    if (!amountStr || amountStr === '') {
      throw new Error('Amount cannot be empty');
    }
    
    // Remove any whitespace
    const cleanAmount = amountStr.trim();
    
    // Check for valid number format
    if (!/^\d*\.?\d*$/.test(cleanAmount)) {
      throw new Error(`Invalid amount format: ${cleanAmount}`);
    }
    
    // Handle edge cases
    if (cleanAmount === '.') {
      throw new Error('Invalid amount: lone decimal point');
    }
    
    // Parse the amount
    const parsedAmount = parseFloat(cleanAmount);
    if (isNaN(parsedAmount) || parsedAmount < 0) {
      throw new Error(`Invalid amount: ${cleanAmount}`);
    }
    
    // If amount is 0, return "0"
    if (parsedAmount === 0) {
      return "0";
    }
    
    // Convert to Octas (1 APT = 10^8 Octas)
    // Use string manipulation to avoid floating point issues
    const parts = cleanAmount.split('.');
    const wholePart = parts[0] || '0';
    const decimalPart = parts[1] || '';
    
    // Pad or trim decimal part to 8 digits
    const paddedDecimal = decimalPart.padEnd(8, '0').substring(0, 8);
    
    // Combine whole and decimal parts
    const octasStr = wholePart + paddedDecimal;
    
    // Remove leading zeros but keep at least one digit
    const result = octasStr.replace(/^0+/, '') || '0';
    
    console.log('APT to Octas conversion:', {
      input: amountStr,
      parsedAmount,
      wholePart,
      decimalPart,
      paddedDecimal,
      result
    });
    
    return result;
  } catch (error) {
    console.error('Error converting APT to Octas:', error);
    throw error;
  }
}

// Validate Aptos address
export function isValidAptosAddress(address: string): boolean {
  // Remove 0x prefix if present
  const cleanAddress = address.startsWith('0x') ? address.slice(2) : address;
  
  // Check if it's 64 hex characters (32 bytes)
  return /^[a-fA-F0-9]{64}$/.test(cleanAddress);
}

// Format Aptos address (add 0x prefix if missing)
export function formatAptosAddress(address: string): string {
  if (!address) return '';
  
  // If already has 0x prefix, return as is
  if (address.startsWith('0x')) {
    return address.toLowerCase();
  }
  
  // Add 0x prefix
  return '0x' + address.toLowerCase();
}

// Prepare transaction payload for OKX wallet
export function prepareAptosPayload(payload: any): any {
  // Ensure all arguments are properly formatted
  const processedPayload = {
    ...payload,
    functionArguments: payload.functionArguments?.map((arg: any) => {
      // If it's a numeric string, ensure it's properly formatted
      if (typeof arg === 'string' && /^\d+$/.test(arg)) {
        // For large numbers, OKX wallet expects them as strings
        return arg;
      }
      // If it's an array (like bytes), ensure it's properly formatted
      if (Array.isArray(arg)) {
        return arg.map((byte: any) => {
          if (typeof byte === 'number') {
            return byte;
          }
          return parseInt(byte, 10);
        });
      }
      return arg;
    }) || []
  };
  
  return processedPayload;
}