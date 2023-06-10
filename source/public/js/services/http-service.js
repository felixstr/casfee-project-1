class HttpService {
    ajax(method, url, data, headers) {
        const fetchHeaders = new Headers({
            'content-type': 'application/json',
            ...(headers || {}),
        });

        data = JSON.stringify(data);
        // console.log('data', data);

        return fetch(url, {
            method: method,
            headers: fetchHeaders,
            body: data,
        }).then((x) => {
            return x.json();
        });
    }
}

export const httpService = new HttpService();
