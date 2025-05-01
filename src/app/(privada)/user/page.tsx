'use client'; // Diretriz para o componente ser tratado no cliente

import { useEffect, useState } from 'react';
import styles from '../privateLayout.module.css';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  orgao: string;
  pg: string;
  mat: number;
  nomeGuerra: string;
  funcao: string;
  typeUser: number;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(''); // Estado para o termo de busca

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Obter o token de acesso do cookie
        const token = document.cookie.split('; ').find(row => row.startsWith('accessToken='));
        const accessToken = token ? token.split('=')[1] : null;
    
        if (!accessToken) {
          throw new Error('Token não encontrado');
        }
    
        console.log('Access Token:', accessToken); // Verifique o token no console para garantir que ele é válido
    
        // Fazer a requisição para a API com o token no cabeçalho Authorization
        const response = await fetch('http://localhost:8081/user', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`Erro ao buscar usuários: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Usuários recebidos:', data);

        setUsers(data);
        setFilteredUsers(data); // Inicialmente, os usuários filtrados são os mesmos que os usuários totais
      } catch (error) {
        setError((error as Error).message);
        console.error('Erro na requisição:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    // Filtra os usuários conforme o valor da busca
    setFilteredUsers(users.filter(user =>
      user.nomeGuerra.toLowerCase().includes(value) || 
      user.funcao.toLowerCase().includes(value)
    ));
  };

  return (
    <div className={styles.conteudoPagina}>
      {error && <p>{error}</p>}

      {/* Título "Usuários" fora da tabela */}
      <h1 className='tituloConteudoPrincipal'>Usuários</h1>

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Digite o Nome..."
          value={searchTerm}
          onChange={handleSearch}
          className={styles.searchInput}
        />
      </div>

      {filteredUsers.length > 0 ? (
        <div className={styles.tableWrapper}> {/* Div para tornar a tabela responsiva */}
          <table className={styles.tabelaUsuarios}>
            <thead>
              <tr>
                <th>Foto</th>
                <th>Usuario</th>
                <th>Função</th>
                <th>Telefone</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>
                    <img 
                      src="/assets/images/avatar.png"
                      className={styles.userImageList} 
                    />
                  </td>
                  <td>{user.pg} {user.mat} {user.nomeGuerra} {user.orgao}</td>
                  <td>{user.funcao}</td>
                  <td>{user.phone}</td>    
                  <td className={styles.acoesColuna}>
                    <button className="fa fa-eye" title="Ver" onClick={() => handleView(user.id)}></button>
                    <button className="fa fa-edit" title="Editar" onClick={() => handleEdit(user.id)}></button>
                    <button className="fa fa-trash" title="Excluir" onClick={() => handleDelete(user.id)}></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Não há usuários para exibir.</p>
      )}
    </div>
  );
};

function handleView(userId: number) {
  console.log(`Visualizando usuário com ID: ${userId}`);
  // Adicione a lógica para ver o usuário
}

function handleEdit(userId: number) {
  console.log(`Editando usuário com ID: ${userId}`);
  // Adicione a lógica para editar o usuário
}

function handleDelete(userId: number) {
  console.log(`Excluindo usuário com ID: ${userId}`);
  // Adicione a lógica para excluir o usuário
}

export default UsersPage;
