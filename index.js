import { Command } from 'commander';
import fs from 'fs'; //fs - вбудований у Node.js модуль
const program = new Command();

program
    .name('restaurant-cli')
    .description('CLI для управління та перегляду меню ресторану')
    .version('1.0.0');

program.option('-f, --file <path>', 'шлях до JSON файлу з даними', 'data.json');

//функція для читання JSON
function loadData(filePath) {
    try {
        const rawData = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(rawData);
    } catch (error) {
        console.error(`Помилка читання файлу ${filePath}:`, error.message);
        process.exit(1);
    }
}
function getAllDishes(data) {
    const dishes = [];
    if (data.categories && Array.isArray(data.categories)) {
        data.categories.forEach(cat => {
            if (cat.dishes && Array.isArray(cat.dishes)) {
                cat.dishes.forEach(d => {
                    dishes.push({ ...d, categoryName: cat.name });
                });
            }
        });
    }
    return dishes;
}

program
    .command('list')
    .description('вивести список усіх страв у меню')
    .option('-l, --limit <number>', 'обмежити кількість елементів', parseInt)
    .action((options) => {
        const data = loadData(program.opts().file);
        let dishes = getAllDishes(data);
        if (options.limit && !isNaN(options.limit)) {
            dishes = dishes.slice(0, options.limit);
        }
        console.log(`--- Список страв (всього: ${dishes.length}) ---`);
        dishes.forEach(d => {
            console.log(`ID: ${d.id} | Назва: ${d.name} | Ціна: ${d.price} грн | Категорія: ${d.categoryName}`);
        });
    });

program
    .command('field <id> <fieldPath>')
    .description('вивести значення конкретного поля страви за ID')
    .action((id, fieldPath) => {
        const data = loadData(program.opts().file);
        const dishes = getAllDishes(data);
        const dish = dishes.find(d => d.id === id);

        if (!dish) {
            console.error(`Страва за ID "${id}" не знайдена.`);
            process.exit(1);
        }

        const keys = fieldPath.split('.');
        let result = dish;
        for (const key of keys) {
            if (result && Object.ptototype.hasOwnProperty.call(result, key)) {
                result = result[key];
            } else {
                console.error(`Поле "${FieldPath}" не знайдено у страві.`);
                process.exit(1);
            }
        }

        console.log(typeof result === 'object' ? JSON.strindify(result, null, 2) : result);
    });


program.parse(process.argv);