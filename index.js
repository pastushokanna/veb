import { Command } from 'commander';
import fs from 'fs'; //fs - вбудований у Node.js модуль
const program = new Command();

program
    .name('restaurant-cli')
    .description('CLI для управління та перегляду меню ресторану')
    .version('1.0.0');

// Загальна опція для шляху до файлу даних
program.option('-f, --file <path>', 'шлях до JSON файлу з даними', 'data.json');

// Допоміжна функція для читання JSON
function loadData(filePath) {
    try {
        const rawData = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(rawData);
    } catch (error) {
        console.error(`Помилка читання файлу ${filePath}:`, error.message);
        process.exit(1);
    }
}

program.parse(process.argv);