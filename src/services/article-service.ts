// This file acts as a simple service to interact with our JSON "database".
// In a real-world application, this would be replaced with actual database calls.
'use server';

import { promises as fs } from 'fs';
import path from 'path';

export interface Article {
    id: string;
    title: string;
    description: string;
    category: string;
    content: string;
    createdAt?: string;
}

// Path to the JSON file
const articlesFilePath = path.join(process.cwd(), 'src/lib/articles.json');

/**
 * Reads all articles from the JSON file.
 * @returns {Promise<Article[]>} A promise that resolves to an array of articles.
 */
export async function getArticles(): Promise<Article[]> {
    try {
        const fileContent = await fs.readFile(articlesFilePath, 'utf8');
        const articles: Article[] = JSON.parse(fileContent);
        // Sort articles by creation date, newest first
        return articles.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
        });
    } catch (error) {
        // If the file doesn't exist or is empty, return an empty array
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return [];
        }
        console.error("Error reading articles:", error);
        throw new Error("Could not read articles from the database.");
    }
}

/**
 * Adds a new article to the JSON file.
 * @param {Omit<Article, 'id' | 'createdAt'>} newArticleData - The new article data without id and createdAt.
 * @returns {Promise<Article>} A promise that resolves to the newly created article.
 */
export async function addArticle(newArticleData: Omit<Article, 'id' | 'createdAt'>): Promise<Article> {
    try {
        const articles = await getArticles();
        
        const newArticle: Article = {
            ...newArticleData,
            id: `article-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            createdAt: new Date().toISOString(),
        };

        const updatedArticles = [newArticle, ...articles];
        
        await fs.writeFile(articlesFilePath, JSON.stringify(updatedArticles, null, 2), 'utf8');
        
        return newArticle;
    } catch (error) {
        console.error("Error adding article:", error);
        throw new Error("Could not add the new article to the database.");
    }
}
