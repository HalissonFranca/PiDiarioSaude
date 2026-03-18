package br.pucgo.ads.projetointegrador.diario_saude.service;

import br.pucgo.ads.projetointegrador.diario_saude.entity.RespostaQuestionarioEntity;
import br.pucgo.ads.projetointegrador.diario_saude.repository.RespostaQuestionarioRepository;
import br.pucgo.ads.projetointegrador.plataforma.entity.User; // ✅ trocado de UsuarioEntity
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RespostaQuestionarioService {

    private final RespostaQuestionarioRepository respostaRepository;

    public RespostaQuestionarioService(RespostaQuestionarioRepository respostaRepository) {
        this.respostaRepository = respostaRepository;
    }

    public List<RespostaQuestionarioEntity> buscarPorUsuario(User usuario) {
        return respostaRepository.findByUsuario(usuario);
    }

    @Transactional
    public void salvarRespostas(List<RespostaQuestionarioEntity> respostas) {
        for (RespostaQuestionarioEntity r : respostas) {
            respostaRepository
                    .findByUsuarioAndPergunta(r.getUsuario(), r.getPergunta())
                    .ifPresentOrElse(
                            existente -> {
                                // ✅ Atualiza resposta existente
                                existente.setResposta(r.getResposta());
                                existente.setPeso(r.getPeso());
                                respostaRepository.save(existente);
                            },
                            () -> respostaRepository.save(r) // ✅ Cria nova
                    );
        }
    }

    public int calcularPontuacaoTotal(User usuario) {
        return buscarPorUsuario(usuario)
                .stream()
                .mapToInt(RespostaQuestionarioEntity::getPeso)
                .sum();
    }
}
