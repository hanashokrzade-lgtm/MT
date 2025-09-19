// This file acts as a simple service to interact with our JSON "database".
// In a real-world application, this would be replaced with actual database calls.
'use server';

import articlesData from '@/lib/articles.json';

export interface Article {
    id: string;
    title: string;
    description: string;
    category: string;
    content: string;
    createdAt?: string;
}

/**
 * Reads all articles from the imported JSON data.
 * @returns {Promise<Article[]>} A promise that resolves to an array of articles.
 */
export async function getArticles(): Promise<Article[]> {
    try {
        const articles: Article[] = articlesData as Article[];
        // Sort articles by creation date, newest first
        return articles.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
        });
    } catch (error) {
        console.error("Error reading articles:", error);
        throw new Error("Could not read articles from the database.");
    }
}

/**
 * Adds a new article. 
 * NOTE: In this demo version, this function simulates adding an article 
 * but does not persist it as we are reading from a static JSON file.
 * @param {Omit<Article, 'id' | 'createdAt'>} newArticleData - The new article data without id and createdAt.
 * @returns {Promise<Article>} A promise that resolves to the newly created article.
 */
export async function addArticle(newArticleData: Omit<Article, 'id' | 'createdAt'>): Promise<Article> {
    console.warn("addArticle is a demo function and does not persist new articles.");

    // To simulate a real-world scenario, we can create the article object
    // and return it, but it won't be saved in the JSON file.
    const newArticle: Article = {
        ...newArticleData,
        id: `article-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        createdAt: new Date().toISOString(),
    };
    
    // In a real database, you would now write this to the database.
    // For this demo, we just return the object.
    
    // To demonstrate a failure in a deployed environment where writing is not possible:
    if (process.env.NODE_ENV === 'production') {
        throw new Error("Adding articles is not supported in this demo environment. This is a static site.");
    }
    
    console.log("Simulating adding a new article (will not be saved):", newArticle);
    return newArticle;
}
