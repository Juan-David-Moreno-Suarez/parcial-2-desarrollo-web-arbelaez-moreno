import path from 'path';
import { pathToFileURL } from 'url';
const file = path.resolve('backend/middlewares/errorHandler.cjs');
const mod = await import(pathToFileURL(file).href);
console.log('keys', Object.keys(mod));
console.log('default', typeof mod.default, mod.default?.name);
console.log('errorHandler', typeof mod.errorHandler, mod.errorHandler?.name);
