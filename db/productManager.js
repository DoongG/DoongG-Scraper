const connection = require('./mysqlConnector');

const getProductByUniqueId = async (uniqueId) => {
    try {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT * FROM hotdeal WHERE uniqueId = ?
            `;
            connection.query(query, [uniqueId], (error, results, fields) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results[0]);
            });
        });
    } catch (error) {
        console.error('Error in getProductByUniqueId:', error);
        throw error;
    }
};

const insertProduct = async (product) => {
    try {
        const existingProduct = await getProductByUniqueId(product.uniqueId);
        if (existingProduct) {
            console.log('Product already exists in the database:', existingProduct);
            return;
        }

        const query = `
            INSERT INTO hotdeal (productName, productPrice, productPerPrice, productLink, productImage, productOriginSite, productDeliveryInfo, category, uniqueId)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            product.productName,
            product.productPrice,
            product.productPerPrice,
            product.productLink,
            product.productImage,
            product.productOriginSite,
            product.productDeliveryInfo,
            product.category,
            product.uniqueId
        ];

        connection.query(query, values, (error, results, fields) => {
            if (error) {
                console.error('Error inserting product into database:', error);
                return;
            }
            console.log('Product inserted into database:', results);
        });
    } catch (error) {
        console.error('Error in insertProduct:', error);
        throw error;
    }
};


const updateProduct = (productId, newProductData) => {
    try {
        const query = `
            UPDATE hotdeal
            SET productName = ?, productPrice = ?, productPerPrice = ?, productLink = ?, productImage = ?, productOriginSite = ?, productDeliveryInfo = ?, category = ?
            WHERE id = ?
        `;

        const values = [
            newProductData.productName,
            newProductData.productPrice,
            newProductData.productPerPrice,
            newProductData.productLink,
            newProductData.productImage,
            newProductData.productOriginSite,
            newProductData.productDeliveryInfo,
            newProductData.category,
            productId
        ];

        connection.query(query, values, (error, results, fields) => {
            if (error) {
                console.error('Error updating product:', error);
                return;
            }
            console.log('Product updated:', results);
        });
    } catch (error) {
        console.error('Error in updateProduct:', error);
        throw error;
    }
};

module.exports = { getProductByUniqueId, insertProduct, updateProduct };
