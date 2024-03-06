const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const categoryUrls = [
        { url: 'https://www.algumon.com/category/2', category: '전자/IT' },
        { url: 'https://www.algumon.com/category/3', category: '식품/영양' },
        { url: 'https://www.algumon.com/category/4', category: '뷰티/패션' },
        { url: 'https://www.algumon.com/category/5', category: '이벤트/상품권' },
        { url: 'https://www.algumon.com/category/1', category: '기타' }
    ];

    for (const category of categoryUrls) {
        await page.goto(category.url);

        const productItems = await page.evaluate((category) => {
            const items = [];
            document.querySelectorAll('.post-group').forEach(item => {
                const productNameElement = item.querySelector('.deal-title .item-name a');
                const productName = productNameElement ? productNameElement.innerText : undefined;
                
                const productPriceElement = item.querySelector('.deal-price-info .product-price');
                const productPrice = productPriceElement ? productPriceElement.innerText : undefined;
                
                const productPerPriceElement = item.querySelector('.deal-price-info .product-per-price');
                const productPerPrice = productPerPriceElement ? productPerPriceElement.innerText : undefined;
                
                const productLinkElement = item.querySelector('.deal-title .item-name a');
                const productLink = productLinkElement ? productLinkElement.getAttribute('href') : undefined;
                
                const productImageElement = item.querySelector('.product-img img');
                const productImage = productImageElement ? productImageElement.getAttribute('src') : undefined;
                
                const productOriginSiteElement = item.querySelector('.deal-header-p .label.shop a');
                const productOriginSite = productOriginSiteElement ? productOriginSiteElement.innerText : undefined;
                
                const productDeliveryInfoElement = item.querySelector('.deal-price-meta-info .fa-truck');
                let productDeliveryInfo = productDeliveryInfoElement ? productDeliveryInfoElement.parentElement.textContent.replace(/\n\s*/g, ' ').trim().split(' ')[0] : undefined;
                
                items.push({ 
                    productName, 
                    productPrice, 
                    productPerPrice, 
                    productLink, 
                    productImage, 
                    productOriginSite, 
                    productDeliveryInfo,
                    category: category.category 
                });
            });
            return items;
        }, category);

        console.log(`Category: ${category.category}`);
        console.log(productItems);
    }

    await browser.close();
})();
