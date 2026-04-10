export interface MenuLink {
	title: string;
	path: string;
	icon?: string;
}

export const LIST_MENU_NAVIGATION_MOBILE = [
		{ id: 'dashboard', label: 'Resumen', icon: 'home' },
		{ id: 'search', label: 'Búsqueda', icon: 'search' },
		{ id: 'user', label: 'Usuario', icon: 'user' }
	];
