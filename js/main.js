(async () => {
    const getData = async (url) => {
        const lastPage = await getLastPage(url);
        console.log("lastPage", lastPage);

        let promises = [];
        for (let i = 1; i <= lastPage; i++) {
            promises.push(fetchData(url + "&page=" + i));
        }

        const responses = await Promise.all(promises);
        const jsonData = await Promise.all(responses.map((r) => r.json()));
        const data = jsonData.flatMap((obj) => obj.data);
        return data;
    };

    const fetchData = (url) => {
        return fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                contentType: "application/json",
                Authorization:
                    "Bearer Y2Y4ZGM4ZjFlM2E3Yjg1OTFmY2RjMjQ5NDg1ZTQzNGIzNzVmYmRiYw",
            },
        });
    };

    const getLastPage = async (url) => {
        const response = await fetchData(url);
        return response.json().then((data) => {
            return data.last_page;
        });
    };

    const productsCRM = await getData(
        "https://openapi.keycrm.app/v1/offers?limit=50&include=product&sort=id"
    );
    const offersCRM = await getData(
        "https://openapi.keycrm.app/v1/offers/stocks?limit=50&include=product&sort=id"
    );

    offersCRM.map((o) => {
        const product = productsCRM.find((p) => p.id == o.id);
        if (product) {
            o.properties = product.properties;
            o.product = product.product;
            o.product_id = product.product_id;
        } else console.log("--- not found", o.id);
    });

    //   const arrUndefined = offersCRM.filter((el) => el.product == undefined);
    //   console.log("undefined", arrUndefined);
    //   const offersCRM11 = offersCRM.filter((el) => el.product !== undefined);

    console.log("productsCRM", productsCRM);
    console.log("offersCRM", offersCRM);
    //console.log("offersCRM11", offersCRM11);

    // start нахождение разницы между массивами
    const productIDs = productsCRM.map((p) => p.id);
    const offersIDs = offersCRM.map((p) => p.id);

    Array.prototype.diff = function (a) {
        return this.filter(function (i) {
            return a.indexOf(i) < 0;
        });
    };
    const difference = productIDs.diff(offersIDs);
    console.log("difference", difference);
    // end нахождение разницы между массивами

    // получение массива наименований товаров
    let products = offersCRM.reduce((a, c) => {
        let idx = a.findIndex((e) => e[0].product_id === c.product_id);
        if (idx !== -1) a[idx].push(c);
        else a.push([c]);
        return a;
    }, []);

    console.log("products", products);

    const oneProduct = products[2]; //Array of {}
    console.log(
        "oneProduct: ",
        oneProduct[0].product.name,
        oneProduct.length,
        oneProduct
    );
    //oneProduct.map((p) => console.log(p.properties.length));

    const properties = oneProduct[0].properties.map((p) => Object.values(p));

    console.log("properties");
    properties.forEach((element) => {
        console.log(element[0]);
    });
})();


