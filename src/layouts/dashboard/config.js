import HomeIcon from '@heroicons/react/24/solid/HomeIcon';
import CogIcon from '@heroicons/react/24/solid/CogIcon';
import CalendarIcon from '@heroicons/react/24/solid/CalendarIcon'
import ArchiveBoxIcon from '@heroicons/react/24/solid/ArchiveBoxIcon';
import ShoppingBagIcon from '@heroicons/react/24/solid/ShoppingBagIcon';
import UserIcon from '@heroicons/react/24/solid/UserIcon';
import UserGroupIcon from '@heroicons/react/24/solid/UserGroupIcon';
import ClipboardIcon from '@heroicons/react/24/solid/ClipboardIcon';

import { SvgIcon } from '@mui/material';


export const items = [
  {
    title: 'Menu del Dia',
    path: '/',
    icon: (
      <SvgIcon fontSize="small">
        <HomeIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Inventario',
    path: '/stock',
    icon: (
      <SvgIcon fontSize="small">
        <ArchiveBoxIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Lista de compras',
    path: '/shoppingList',
    icon: (
      <SvgIcon fontSize="small">
        <ShoppingBagIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Planificador de menu',
    path: '/menuPlanner',
    icon: (
      <SvgIcon fontSize="small">
        <CalendarIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Gestionar familia',
    path: '/family',
    icon: (
      <SvgIcon fontSize="small">
        <UserGroupIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Perfil',
    path: '/account',
    icon: (
      <SvgIcon fontSize="small">
        <UserIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Ajustes',
    path: '/settings',
    icon: (
      <SvgIcon fontSize="small">
        <CogIcon />
      </SvgIcon>
    )
  },
  {
    title: (
      <>
        <span>Creador de recetas</span>
        <br />
        <span>(Próximamente)</span>
      </>
    ),
    path: '/404',
    icon: (
      <SvgIcon fontSize="small">
        <ClipboardIcon />
      </SvgIcon>
    )
  }

];
