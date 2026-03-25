package br.pucgo.ads.projetointegrador.diario_saude.repository;

import br.pucgo.ads.projetointegrador.diario_saude.entity.PerguntaEntity;
import br.pucgo.ads.projetointegrador.diario_saude.entity.RespostaQuestionarioEntity;
import br.pucgo.ads.projetointegrador.plataforma.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RespostaQuestionarioRepository extends JpaRepository<RespostaQuestionarioEntity, Long> {

    List<RespostaQuestionarioEntity> findByUsuario(User usuario);

    Optional<RespostaQuestionarioEntity> findByUsuarioAndPergunta(User usuario, PerguntaEntity pergunta);
}