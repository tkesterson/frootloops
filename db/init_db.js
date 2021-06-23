const {
    client
} = require("./index");


async function buildTables() {
    try {
        console.log("Connecting to client...");
        client.connect();
        console.log("Client connected!");

        console.log("Starting to drop tables...");
        await client.query(`
            DROP TABLE IF EXITS line_items;
            DROP TABLE IF EXISTS cart;
            DROP TABLE IF EXISTS products;
            DROP TABLE IF EXISTS users;
        `);
        console.log("Finished dropping tables!");

        console.log("Starting to create tables...");
        await client.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                admin BOOLEAN DEFAULT false
            );

            CREATE TABLE products(
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                category VARCHAR(255) NOT NULL,
                subCateogry VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                price DECIMAL NOT NULL,
                quantity INTEGER NOT NULL,
                "imgSrc" TEXT NOT NULL
            );

            CREATE TABLE cart(
                id SERIAL PRIMARY KEY,
                "userId" INTEGER REFERENCES users(id),
                "isActive" BOOLEAN DEFAULT true,
                "purchaseDate" TIMESTAMP

            );

            CREATE TABLE line_items(
                id SERIAL PRIMARY KEY,
                "cartId" INTEGER REFERENCES cart(id),
                "productId" INTEGER REFERENCES products(id),
                quantity INTEGER NOT NULL,
                price DECIMAL NOT NULL,
            )
        `);
        console.log("Finished creating tables!");
    } catch (error) {
        console.log("Error in creating tables!");
        throw error;
    }
}

buildTables()