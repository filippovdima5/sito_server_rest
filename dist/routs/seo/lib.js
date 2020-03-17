"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPathname = (path) => {
    if (path.includes('products'))
        return 'products';
    if (path.includes('brands'))
        return 'brands';
    if (path.includes('likes'))
        return 'likes';
    if (path.includes('blog'))
        return 'blog';
    if (path.includes('about'))
        return 'about';
    return '/';
};
exports.findCategory = (search) => {
    if (!search.includes('categories'))
        return [];
    const arrParams = search
        .split('&')
        .map(item => item.split('='));
    const categoriesStr = arrParams.find((item) => (item[0] === 'categories'));
    if (categoriesStr === undefined)
        return [];
    return categoriesStr[1].split('|').map(value => +value);
};
