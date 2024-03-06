require('dotenv').config();
const puppeteer = require('puppeteer');

const scrapeProductsInCategory = async (page, category) => {
    console.log("Navigating to category page:", category.url);
    await page.goto(category.url);
    console.log("Scraping products in category:", category.category);

    const productItems = await page.evaluate((category) => {
        const items = [];
        document.querySelectorAll('.post-group').forEach((item) => {
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
                category: category.category,
            });
        });
        return items;
    }, category);

    console.log("Products scraped in category:", productItems);
    return productItems;
};

module.exports = { scrapeProductsInCategory };
