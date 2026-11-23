import '../styles/main.scss';
import { renderCartBadge } from '../ui/cart/cartBadge';
import { renderBestSellers } from '../ui/catalog/bestSellers';
import { renderCategories } from '../ui/catalog/categories';
import { renderProductDrawer } from '../ui/catalog/productDrawer';
import { renderFooter } from '../ui/shared/footer';
import { renderMenu } from '../ui/shared/menu';

renderMenu();
renderCartBadge();
renderFooter();
renderCategories();
renderBestSellers();
renderProductDrawer('.best-sellers__list');
