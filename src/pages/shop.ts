import '../styles/main.scss';
import { renderCartBadge } from '../ui/cart/cartBadge';
import { PRODUCTS } from '../constants/catalog/products';
import { filterProducts } from '../core/catalog/filterProducts';
import { renderCatalog } from '../ui/catalog/catalog';
import { initCatalogCart } from '../ui/cart/catalogCart';
import { renderFilters } from '../ui/catalog/filters';
import { renderFooter } from '../ui/shared/footer';
import { renderMenu } from '../ui/shared/menu';

renderMenu();
renderCartBadge();
renderFooter();
initCatalogCart(PRODUCTS);
renderFilters((filters) => renderCatalog(filterProducts(PRODUCTS, filters)));
