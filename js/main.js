(async ($) => {
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
    products = [products[10], products[11], products[12], products[15]]
    //products = [products[0]]

    console.log("products", products);

    const oneProduct = products[0]; //Array of {}
    console.log(
        "oneProduct: ",
        oneProduct[0].product.name,
        oneProduct.length,
        oneProduct
    );
    //oneProduct.map((p) => console.log(p.properties.length));

    // const properties = oneProduct[0].properties.map((p) => Object.values(p));

    // Get all properties of all products
    products.map((product, p) => {
        const offers = product;
        const offerFirst = offers[0]
        const parameters = offerFirst.product.properties_agg
        const name = offerFirst.product.name
        console.log(`name = ${name} - #${p}`)



        let colors = []
        let sizes = []
        let models = []

        for (const [key, value] of Object.entries(parameters)) {
            console.log(`${key}: ${value}`);
            switch (key) {
                case 'Розмір':
                    sizes.push(...value)
                    break;
                case 'Колір':
                case 'Koлір':
                    colors.push(...value)
                    break;
                case 'Тип':
                case 'Модель':
                    models.push(...value)
                    break;
            }
        }

        const widthLeftSide = !!models.length ? 2 : 1

        const getСoordinatesY = (props) => {
            let y = null
            let obj = {}
            let color = ""
            let model = ""
            let size = ""

            props.forEach((item , i) => {
                obj[item.name] = item.value
            })

            for (const [key, value] of Object.entries(obj)) {
                switch (key) {
                    case 'Розмір': size = value
                        break;
                    case 'Колір':
                    case 'Koлір': color = value
                        break;
                    case 'Тип':
                    case 'Модель': model = value
                        break;
                }
            }

            let testArr = [model, color, size]
            // console.log(`testArr: ${testArr}`)
            //Logger.log(`model: ${model}`)
            //debugger

            !models.length && colors.map((item, i) => {
                props.map(prop => {
                    if (item == prop.value) y = i
                })
            })

            // !!models.length && leftList.map((item, i) => {
            //
            //     let allFounded = item.every( ai => testArr.includes(ai) );
            //     //allFounded && Logger.log(`allFounded true`)
            //     //if (item[0] == model && item[1] == color)
            //     if (allFounded)
            //     {
            //         y = i
            //
            //     }
            // })
            //console.log(`return y: ${y + 1}`)
            return y + 1
        }

        const getСoordinatesX = (prop) => {
            let x = null
            sizes.map((size, k) => {
                prop.map((item, i) => {
                    if (size == item.value) x = k
                })
            })
            return x + widthLeftSide + 1
        }

        $("#accordion").append(`<h3>${name}</h3><div>
            <table dataname = "${name}" class="table table-bordered"><tr><th><h4>${name}</h4></th></tr></table>
        </div>`) ;
        // console.log("sizes", sizes);
        colors.map(c => {
            $("#accordion > div:last-child > table").append(`<tr><td>${c}</td></tr>`)
        })
        sizes.map(s => {
            $("#accordion > div:last-child > table  tr:first-child").append(`<th>${s}</th>`)
            $("#accordion > div:last-child > table  tr:not(:first-child)").append(`<td></td>`)
        })

        offersCRM.map((offer, o) => {
            const quantity = offer.quantity
            const properties = offer.properties
            const nameOffer = offer.product.name
            // name === nameOffer && console.log("paramY", paramY)
            if (name === nameOffer) {
                const paramY = getСoordinatesY(properties)
                const paramX = getСoordinatesX(properties)
                $(`[dataname="${name}"]`).find(`tr:nth-child(${paramY + 1})`).find(`td:nth-child(${paramX})`).text(quantity)
            }
        })

        //debugger


    })

    // properties.forEach((element) => {
    //     console.log(element[0]);
    // });
    $( "#accordion" ).accordion({
        collapsible: true,
        heightStyle: "content"
    });
})(jQuery);





