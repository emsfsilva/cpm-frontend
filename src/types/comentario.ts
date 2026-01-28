interface UserComentario {
  imagemUrl: string;
  pg: string;
  nomeGuerra: string;
  funcao: string;
}

interface Comentario {
  id: number;
  comentario: string;
  createdAt: string;
  usercomentario?: UserComentario;
}
