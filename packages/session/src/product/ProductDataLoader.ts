import { IProductData } from '@nitrots/api';
import { GetConfiguration } from '@nitrots/configuration';
import { ProductData } from './ProductData';

export class ProductDataLoader
{
    private _products: Map<string, IProductData>;

    constructor(products: Map<string, IProductData>)
    {
        this._products = products;
    }

    public async init(): Promise<void>
    {
        const url = GetConfiguration().getValue<string>('productdata.url');

        if(!url || !url.length) throw new Error('Missing "productdata.url" in config — add the product data URL to your renderer-config.json');

        let response: Response;

        try
        {
            response = await fetch(url);
        }
        catch(fetchErr)
        {
            throw new Error(`Could not fetch product data from "${ url }" — check "productdata.url" in renderer-config.json (${ fetchErr.message })`);
        }

        if(response.status !== 200) throw new Error(`Failed to load product data from "${ url }" — server returned HTTP ${ response.status }. Check "productdata.url" in renderer-config.json`);

        let responseData: any;

        try
        {
            responseData = await response.json();
        }
        catch(parseErr)
        {
            throw new Error(`Invalid JSON in product data "${ url }" — the URL may be wrong. Check "productdata.url" in renderer-config.json (${ parseErr.message })`);
        }

        this.parseProducts(responseData.productdata);
    }

    private parseProducts(data: { [index: string]: any }): void
    {
        if(!data) return;

        for(const product of data.product) (product && this._products.set(product.code, new ProductData(product.code, product.name, product.description)));
    }
}
