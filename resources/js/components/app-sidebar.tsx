import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, ShieldCheck, Folder, LayoutGrid, Users, Earth, Dumbbell, GalleryHorizontalEnd, Swords, GraduationCap, Component, BookImage } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Panel de Control',
        href: route('dashboard'),
        icon: LayoutGrid,
    },
    {
        title: 'Usuarios',
        href: route('users.index'),
        icon: Users,
    },
    {
        title: 'Docentes',
        href: route('teachers.index'),
        icon: GraduationCap,
    }
];

const gameplayNavItems: NavItem[] = [
    {
        title: 'Galaxias',
        href: route('galaxies.index'),
        icon: Component,
    },
    {
        title: 'Planetas',
        href: route('planets.index'),
        icon: Earth,
    },
    {
        title: 'Ejercicios',
        href: route('exercises.index'),
        icon: Dumbbell,
    },
    {
        title: 'Cartas',
        href: route('cards.index'),
        icon: GalleryHorizontalEnd,
    },
    {
        title: 'Enemigos',
        href: route('enemies.index'),
        icon: Swords,
    },
    {
        title: 'Heroes',
        href: route('heroes.index'),
        icon: ShieldCheck,
    }
];

const footerNavItems: NavItem[] = [
    {
        title: 'Activos - Cloudinary',
        href: 'https://console.cloudinary.com/app/c-3e219221fefc2b1b4348bbfc802a8d/assets/media_library/folders/ccb2be57b08937c49136246704c50f77a3',
        icon: BookImage,
    },
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={route('dashboard')} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} gameplayItems={gameplayNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
