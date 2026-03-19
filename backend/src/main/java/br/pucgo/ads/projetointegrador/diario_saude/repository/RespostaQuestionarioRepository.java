package br.pucgo.ads.projetointegrador.diario_saude.repository;

<<<<<<< HEAD
import br.pucgo.ads.projetointegrador.diario_saude.entity.RespostaQuestionarioEntity;
import br.pucgo.ads.projetointegrador.diario_saude.entity.PerguntaEntity;
import br.pucgo.ads.projetointegrador.diario_saude.entity.UsuarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
=======
import br.pucgo.ads.projetointegrador.diario_saude.entity.PerguntaEntity;
import br.pucgo.ads.projetointegrador.diario_saude.entity.RespostaQuestionarioEntity;
import br.pucgo.ads.projetointegrador.plataforma.entity.User; // ✅ trocado de UsuarioEntity
import org.springframework.data.jpa.repository.JpaRepository;
>>>>>>> 642918d614cd2e5e6344c70451602c5148974576

import java.util.List;
import java.util.Optional;

<<<<<<< HEAD
@Repository
public interface RespostaQuestionarioRepository extends JpaRepository<RespostaQuestionarioEntity, Long> {

    List<RespostaQuestionarioEntity> findByUsuario(UsuarioEntity usuario);

    Optional<RespostaQuestionarioEntity> findByUsuarioAndPergunta(UsuarioEntity usuario, PerguntaEntity pergunta);
=======
public interface RespostaQuestionarioRepository extends JpaRepository<RespostaQuestionarioEntity, Long> {

    List<RespostaQuestionarioEntity> findByUsuario(User usuario);

    Optional<RespostaQuestionarioEntity> findByUsuarioAndPergunta(User usuario, PerguntaEntity pergunta);
>>>>>>> 642918d614cd2e5e6344c70451602c5148974576
}
