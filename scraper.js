require('dotenv').config();
const puppeteer = require('puppeteer');
const { scrapeProductsInCategory } = require('./utils/puppeteerUtils');
const { insertProduct } = require('./db/productManager');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        const categoryUrls = [
            { url: 'https://www.algumon.com/category/2', category: '전자/IT' },
            { url: 'https://www.algumon.com/category/3', category: '식품/영양' },
            { url: 'https://www.algumon.com/category/4', category: '뷰티/패션' },
            { url: 'https://www.algumon.com/category/5', category: '이벤트/상품권' },
            { url: 'https://www.algumon.com/category/1', category: '기타' }
        ];

        for (const category of categoryUrls) {
            const productItems = await scrapeProductsInCategory(page, category);

            for (const product of productItems) {
                const uniqueId = generateUniqueId(product.productName, product.productPrice);
                product.uniqueId = uniqueId;
                await insertProduct(product);
            }

            console.log(`Category: ${category.category}`);
            console.log(productItems);
        }
    } catch (error) {
        console.error('Error occurred:', error);
    } finally {
        await browser.close();
    }
})();

const generateUniqueId = (productName, productPrice) => {
    return `${productName}-${productPrice}`;
};