function getToken() {
    const cookieString = document.cookie;
    const cookies = cookieString.split(';').map(cookie => cookie.trim());

    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName === "token") {
            return decodeURIComponent(cookieValue);
        }
    }
    return null;
}

export default getToken;