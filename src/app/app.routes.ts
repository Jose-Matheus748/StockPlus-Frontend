import { Routes } from '@angular/router';

import { EstoquesComponent } from './pages/estoques/estoques.component';
import { EstoqueComponent } from './pages/estoque/estoque.component';
import { ProdutosComponent } from './pages/produtos/produtos.component';
import { ProtocolosComponent } from './pages/protocolos/protocolos.component';
import { ProtocoloComponent } from './pages/protocolo/protocolo.component';
import { WelcomeComponent } from './pages/bem_vindo/bem_vindo.component';
import { PedidosLojaComponent } from './pages/pedidos_loja/pedidos_loja.component';
import { LoginClienteComponent } from './pages/login_cliente/login_cliente.component';
import { LoginLojaComponent } from './pages/login_loja/login_loja.component';
import { CadastroClienteComponent } from './pages/cadastro_cliente/cadastro_cliente.component';
import { CadastroLojaComponent } from './pages/cadastro_loja/cadastro_loja.component';
import { LayoutClienteComponent } from './components/layout/layout-cliente/layout-cliente';
import { LojasComponent } from './pages/lojas/lojas.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [

  {
    path: '',
    component: WelcomeComponent,
  },

  { path: 'login/cliente', component: LoginClienteComponent },
  { path: 'login/loja',    component: LoginLojaComponent },
  { path: 'cadastro/cliente', component: CadastroClienteComponent },
  { path: 'cadastro/loja',    component: CadastroLojaComponent },

  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: 'estoques', component: EstoquesComponent },
      { path: 'estoques/:id', component: EstoqueComponent },
      { path: 'produtos', component: ProdutosComponent },
      { path: 'protocolos', component: ProtocolosComponent },
      { path: 'protocolos/:id', component: ProtocoloComponent },
      { path: 'pedidos', component:PedidosLojaComponent },
      { path: 'lojas', component: LojasComponent },
//      { path: 'lojas/:id', component: LojaDetalheComponent },
//      { path: 'meus-pedidos', component: MeusPedidosComponent },
    ]
  },

  {
    path: '**',
    redirectTo: '',
  },
];
