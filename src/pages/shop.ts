import '../styles/main.scss';
import { PRODUCTS } from '../constants/products';
import { filterProducts } from '../core/filterProducts';
import { renderCatalog } from '../ui/catalog';
import { renderFilters } from '../ui/filters';
import { renderFooter } from '../ui/footer';
import { renderMenu } from '../ui/menu';

renderMenu();
renderFooter();
renderFilters((filters) => renderCatalog(filterProducts(PRODUCTS, filters)));
