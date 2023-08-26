import * as faker from 'faker';

const generateProduct = () => {
    return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        status: true,
        code: faker.string.alphanumeric(5),
        stock: faker.random.number({ min: 10, max: 100 }),
        category: faker.commerce.department()
    };
};

export default generateProduct;