import type { RequestEvent } from "@sveltejs/kit";

type Token = {
    name: string,
    email: string,
    userType: string,
    supplierIds: string[],
    iat: number,
    exp: number
  }


export function validateToken(token: string): string | null {

    if (token != null && token.length > 0) {
        const tokenInfo = parseJwt(token);
        if (tokenInfo.exp*1000 < Date.now()) {
            return null;
        }
        return token;
    }

    return null;
}

export function parseJwt(token: string): Token {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

export function getTokenFromCookie(): string | undefined {
    const token = document.cookie.split('; ').find(row => row.startsWith('token'))?.split('=')[1];
    return token;
}

export function removeTokenCookie() {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}