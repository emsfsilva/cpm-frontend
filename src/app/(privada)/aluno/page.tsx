'use client';  // Diretriz para garantir que este arquivo seja tratado como Componente de Cliente

import { useEffect, useState } from 'react';
import styles from '../privateLayout.module.css';
import { useRouter } from 'next/navigation';  // useRouter importado de 'next/navigation'

const AlunosPage = () => {
  const [alunos, setAlunos] = useState<Aluno[]>([]); 
  const [filteredAlunos, setFilteredAlunos] = useState<Aluno[]>([]); 
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(''); 
  const router = useRouter(); // Inicializando o useRouter

  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const token = document.cookie.split('; ').find(row => row.startsWith('accessToken='));
        const accessToken = token ? token.split('=')[1] : null;
    
        if (!accessToken) {
          throw new Error('Token não encontrado');
        }

        const alunosResponse = await fetch('http://localhost:8081/aluno', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,  // Correção aqui para interpolar corretamente o token
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!alunosResponse.ok) {
          throw new Error(`Erro ao buscar alunos: ${alunosResponse.status} - ${alunosResponse.statusText}`);
        }

        const alunosData = await alunosResponse.json();
        setAlunos(alunosData);
        setFilteredAlunos(alunosData); // Inicializa os alunos filtrados com todos os dados

      } catch (error) {
        setError((error as Error).message);
        console.error('Erro na requisição:', error);
      }
    };

    fetchAlunos();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    setFilteredAlunos(alunos.filter(aluno =>
      aluno.user.nomeGuerra.toLowerCase().includes(value) || 
      aluno.user.funcao.toLowerCase().includes(value)
    ));
  };

  // Função para redirecionar para a página de detalhes
const handleView = (id: number) => {
  console.log(`Redirecionando para o aluno com ID: ${id}`);
  router.push(`/alunoDetalhe/${id}`);  // Certifique-se de que a URL está correta
};

  return (
    <div className={styles.conteudoPagina}>
      {error && <p>{error}</p>}

      <h1 className='tituloConteudoPrincipal'>Alunos</h1>

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Digite o Nome..."
          value={searchTerm}
          onChange={handleSearch}
          className={styles.searchInput}
        />
      </div>

      {filteredAlunos.length > 0 ? (
        <div className={styles.tableWrapper}>
          <table className={styles.tabelaUsuarios}>
            <thead>
              <tr>
                <th>Foto</th>
                <th>Usuário</th>
                <th>Telefone</th>
                <th>Turma</th>
                <th>Cia</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlunos.map(aluno => {
                return (
                  <tr key={aluno.userId}>
                    <td>
                      <img src="/assets/images/avatar.png" className={styles.userImageList} />
                    </td>
                    <td>{aluno.user.pg} {aluno.user.nomeGuerra}</td>
                    <td>{aluno.user.phone}</td>
                    <td>{aluno.turma ? aluno.turma.name : 'N/A'}</td>
                    <td>{aluno.turma.cia.name ? aluno.turma.cia.name : 'N/A'}</td>
                    <td className={styles.acoesColuna}>
                      <button className="fa fa-eye" title="Ver" onClick={() => handleView(aluno.id)}></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Não há alunos para exibir.</p>
      )}
    </div>
  );
};

export default AlunosPage;
