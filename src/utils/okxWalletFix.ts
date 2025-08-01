// OKX Wallet Aptos Transaction Fix
// This module provides workarounds for OKX wallet's BigInt conversion issues with decimal amounts

/**
 * Validates and prepares transaction payload for OKX wallet
 * Ensures all numeric values are properly formatted to avoid BigInt conversion errors
 */
export function prepareOKXAptosTransaction(payload: any): any {
  console.log("\n=== OKX Wallet Transaction Preparation ===");
  console.log("Original payload:", JSON.stringify(payload, null, 2));
  
  // Deep clone the payload to avoid modifying the original
  const preparedPayload = JSON.parse(JSON.stringify(payload));
  
  // Process function arguments
  if (preparedPayload.functionArguments && Array.isArray(preparedPayload.functionArguments)) {
    preparedPayload.functionArguments = preparedPayload.functionArguments.map((arg: any, index: number) => {
      console.log(`\nProcessing argument ${index}:`, arg);
      
      // If it's a string that looks like a number, ensure it's an integer
      if (typeof arg === 'string' && /^\d+$/.test(arg)) {
        // Validate it's a valid integer for BigInt
        try {
          const testBigInt = BigInt(arg);
          console.log(`  Validated as BigInt: ${testBigInt}`);
          return arg;
        } catch (e) {
          console.error(`  Failed BigInt validation:`, e);
          throw new Error(`Invalid numeric argument at index ${index}: ${arg}`);
        }
      }
      
      // If it's an array (like bytes), validate each element
      if (Array.isArray(arg)) {
        return arg.map((byte: any) => {
          if (typeof byte === 'number') {
            return Math.floor(byte); // Ensure integers
          }
          return byte;
        });
      }
      
      return arg;
    });
  }
  
  // Add gas_unit_price and max_gas_amount if not present
  // These are optional but might help with estimation
  if (!preparedPayload.gas_unit_price) {
    preparedPayload.gas_unit_price = "100"; // 100 is typical for mainnet
  }
  
  if (!preparedPayload.max_gas_amount) {
    preparedPayload.max_gas_amount = "10000"; // Conservative gas limit
  }
  
  console.log("\nPrepared payload:", JSON.stringify(preparedPayload, null, 2));
  console.log("=== End Preparation ===\n");
  
  return preparedPayload;
}

/**
 * Checks if an amount can be safely converted for OKX wallet
 */
export function validateAptosAmount(amount: string): { valid: boolean; error?: string } {
  try {
    // Check if it's a valid number
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return { valid: false, error: "Invalid amount" };
    }
    
    // Check if amount is too small (less than 0.001 APT)
    if (numAmount < 0.001) {
      return { 
        valid: false, 
        error: "Amount too small. Minimum is 0.001 APT due to OKX wallet limitations" 
      };
    }
    
    // Check if amount has too many decimal places
    const decimalPlaces = (amount.split('.')[1] || '').length;
    if (decimalPlaces > 8) {
      return { 
        valid: false, 
        error: "Too many decimal places. APT supports up to 8 decimal places" 
      };
    }
    
    return { valid: true };
  } catch (error) {
    return { valid: false, error: "Failed to validate amount" };
  }
}

/**
 * Formats an amount for display while ensuring it's OKX wallet compatible
 */
export function formatAptosAmountForOKX(amount: string): string {
  const validation = validateAptosAmount(amount);
  if (!validation.valid) {
    throw new Error(validation.error);
  }
  
  // Parse and format to ensure consistent decimal representation
  const numAmount = parseFloat(amount);
  
  // If it's a very small amount, suggest rounding up
  if (numAmount < 0.01) {
    console.warn(`Amount ${amount} is very small and may cause issues with OKX wallet. Consider using at least 0.01 APT.`);
  }
  
  // Format to 8 decimal places max
  return numAmount.toFixed(8).replace(/\.?0+$/, '');
}