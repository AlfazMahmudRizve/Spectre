import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

// Types
export interface User {
    id: string;
    email: string;
    password?: string;
    name?: string;
    role: 'admin' | 'customer';
    createdAt: string;
    provider?: 'google' | 'credentials';
}

export interface Order {
    id: string;
    userId: string; // Links to User (even if guest shadow account)
    email: string; // Redundant but useful for quick access
    items: any[];
    total: number;
    status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED';
    createdAt: string;
    shippingDetails: any;
}

export interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    status: string;
}

interface DB {
    users: User[];
    products: Product[];
    orders: Order[];
}

// Helpers
async function readDb(): Promise<DB> {
    try {
        const data = await fs.readFile(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist, return default empty structure
        return { users: [], products: [], orders: [] };
    }
}

async function writeDb(data: DB): Promise<void> {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// --- Data Access Layer ---

export async function getUserByEmail(email: string): Promise<User | undefined> {
    const db = await readDb();
    return db.users.find(u => u.email === email);
}

export async function createUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const db = await readDb();
    const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email: user.email,
        name: user.name,
        // Only set password if provided (for credentials)
        ...(user.password ? { password: user.password } : {}),
        role: user.role,
        provider: user.provider || 'credentials',
        createdAt: new Date().toISOString()
    };
    db.users.push(newUser);
    await writeDb(db);
    return newUser;
}

export async function createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> {
    const db = await readDb();
    const newOrder: Order = {
        ...orderData,
        id: `SPC-2077-${Math.random().toString().substr(2, 4)}`, // Generate Cool ID
        status: 'PROCESSING',
        createdAt: new Date().toISOString()
    };
    db.orders.unshift(newOrder); // Add to top
    await writeDb(db);
    return newOrder;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const db = await readDb();
    const index = db.products.findIndex(p => p.id === id);
    if (index === -1) return null;

    db.products[index] = { ...db.products[index], ...updates };
    await writeDb(db);
    db.products[index] = { ...db.products[index], ...updates };
    await writeDb(db);
    return db.products[index];
}

export async function addProduct(product: Omit<Product, 'id' | 'status'>): Promise<Product> {
    const db = await readDb();
    const newProduct: Product = {
        ...product,
        id: `spectre-${Math.random().toString(36).substr(2, 6)}`,
        status: 'In Stock'
    };
    db.products.push(newProduct);
    await writeDb(db);
    return newProduct;
}

export async function getProducts(): Promise<Product[]> {
    const db = await readDb();
    return db.products;
}

export async function getDashboardData() {
    const db = await readDb();
    return {
        orders: db.orders,
        users: db.users,
        products: db.products
    };
}
