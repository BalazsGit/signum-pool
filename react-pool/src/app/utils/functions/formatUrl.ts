export const formatUrl = (url: string) => {
    if (url.endsWith("/")) url = url.slice(0, -1);

    return url;
};
