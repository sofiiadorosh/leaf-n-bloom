import '../styles/main.scss';
import { renderCartBadge } from '../ui/cartBadge';
import { PRODUCTS } from '../constants/products';
import { filterProducts } from '../core/filterProducts';
import { renderCatalog } from '../ui/catalog';
import { initCatalogCart } from '../ui/catalogCart';
import { renderFilters } from '../ui/filters';
import { renderFooter } from '../ui/footer';
import { renderMenu } from '../ui/menu';

renderMenu();
renderCartBadge();
renderFooter();
initCatalogCart(PRODUCTS);
renderFilters((filters) => renderCatalog(filterProducts(PRODUCTS, filters)));
