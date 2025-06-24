
import { FC } from "react";
import { Link } from "react-router-dom";

export const Footer: FC = () => {
  return (
    <footer id="contact" className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">DigiUrbis</h3>
            <p className="text-gray-400 mb-6 max-w-md">
              A plataforma completa para modernizar a gestão municipal e conectar 
              cidadãos com os serviços públicos de forma eficiente e transparente.
            </p>
            <div className="text-gray-400">
              <p>© 2024 DigiUrbis. Todos os direitos reservados.</p>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Produto</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#benefits" className="hover:text-white transition-colors">Benefícios</a></li>
              <li><a href="#modules" className="hover:text-white transition-colors">Módulos</a></li>
              <li><Link to="/admin" className="hover:text-white transition-colors">Demonstração</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Preços</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Suporte</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Documentação</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Status do Sistema</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm">
            <a href="#" className="hover:text-white mr-6">Política de Privacidade</a>
            <a href="#" className="hover:text-white mr-6">Termos de Uso</a>
            <a href="#" className="hover:text-white">Cookies</a>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button variant="outline" size="sm" asChild className="bg-transparent text-gray-400 border-gray-600 hover:bg-gray-800 hover:text-white">
              <Link to="/admin">Acessar Sistema</Link>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};
