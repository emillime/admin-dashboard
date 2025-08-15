import { get } from 'svelte/store';
import { currentSupplier } from '../stores/stores';
import { getTokenFromCookie, parseJwt } from './jwtUtils';

export function getCurrentSupplierId(): string | undefined {
    // First, try to get the supplier from the store
    const storeSupplier = get(currentSupplier);
    if (storeSupplier?._id) {
        return storeSupplier._id;
    }

    // If not available in the store, try to get it from the token
    const token = getTokenFromCookie();
    if (token) {
        const tokenData = parseJwt(token);
        return tokenData._id || tokenData.supplierIds?.[0];
    }

    // If no supplier is found, return undefined
    return undefined;
}
