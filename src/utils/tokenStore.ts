import { writable } from "svelte/store";

const cachedToken = localStorage.getItem('tokenStore');

export const tokenStore = writable(cachedToken || null);

tokenStore.subscribe((token) => { 
    if (token == null || token.length === 0) {
        localStorage.removeItem('tokenStore');
        return;
    }
    localStorage.setItem('tokenStore', token);
});