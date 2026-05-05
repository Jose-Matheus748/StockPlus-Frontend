import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { EstoquesComponent } from './pages/estoques/estoques.component';
import { EstoqueComponent } from './pages/estoque/estoque.component';
import { ProdutosComponent } from './pages/produtos/produtos.component';
import { ProtocolosComponent } from './pages/protocolos/protocolos.component';
import { ProtocoloComponent } from './pages/protocolo/protocolo.component';
import { WelcomeComponent } from './pages/bem_vindo/bem_vindo.component';

import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [

  {
    path: '',
    component: WelcomeComponent,
  },

  {
    path: 'login/:tipo',
    component: LoginComponent,
  },

  {
    path: 'cadastro/:tipo',
    component: CadastroComponent,
  },

  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: 'estoques', component: EstoquesComponent },
      { path: 'estoques/:id', component: EstoqueComponent },
      { path: 'produtos', component: ProdutosComponent },
      { path: 'protocolos', component: ProtocolosComponent },
      { path: 'protocolos/:id', component: ProtocoloComponent },
    ]
  },

  {
    path: '**',
    redirectTo: '',
  },
];
