package br.pucgo.ads.projetointegrador.diario_saude.repository;

<<<<<<< HEAD
=======
<<<<<<< HEAD
import br.pucgo.ads.projetointegrador.diario_saude.entity.RespostaQuestionarioEntity;
import br.pucgo.ads.projetointegrador.diario_saude.entity.PerguntaEntity;
import br.pucgo.ads.projetointegrador.diario_saude.entity.UsuarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
=======
>>>>>>> 8d723c75dea8e98c051b7ee5bdebfd20b5e0e829
import br.pucgo.ads.projetointegrador.diario_saude.entity.PerguntaEntity;
import br.pucgo.ads.projetointegrador.diario_saude.entity.RespostaQuestionarioEntity;
import br.pucgo.ads.projetointegrador.plataforma.entity.User; // ✅ trocado de UsuarioEntity
import org.springframework.data.jpa.repository.JpaRepository;
<<<<<<< HEAD
=======
>>>>>>> 642918d614cd2e5e6344c70451602c5148974576
>>>>>>> 8d723c75dea8e98c051b7ee5bdebfd20b5e0e829

import java.util.List;
import java.util.Optional;

<<<<<<< HEAD
=======
<<<<<<< HEAD
@Repository
public interface RespostaQuestionarioRepository extends JpaRepository<RespostaQuestionarioEntity, Long> {

    List<RespostaQuestionarioEntity> findByUsuario(UsuarioEntity usuario);

    Optional<RespostaQuestionarioEntity> findByUsuarioAndPergunta(UsuarioEntity usuario, PerguntaEntity pergunta);
=======
>>>>>>> 8d723c75dea8e98c051b7ee5bdebfd20b5e0e829
public interface RespostaQuestionarioRepository extends JpaRepository<RespostaQuestionarioEntity, Long> {

    List<RespostaQuestionarioEntity> findByUsuario(User usuario);

    Optional<RespostaQuestionarioEntity> findByUsuarioAndPergunta(User usuario, PerguntaEntity pergunta);
<<<<<<< HEAD
=======
>>>>>>> 642918d614cd2e5e6344c70451602c5148974576
>>>>>>> 8d723c75dea8e98c051b7ee5bdebfd20b5e0e829
}
